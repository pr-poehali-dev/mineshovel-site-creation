"""YooKassa webhook handler — обновляет статус заказа и добавляет товар в очередь выдачи."""
import json
import os
import base64
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError

import psycopg2

HEADERS = {
    'Content-Type': 'application/json'
}

YOOKASSA_API_URL = "https://api.yookassa.ru/v3/payments"


def verify_payment_via_api(payment_id, shop_id, secret_key):
    """Верификация платежа через API ЮKassa."""
    auth_string = f"{shop_id}:{secret_key}"
    auth_bytes = base64.b64encode(auth_string.encode()).decode()

    request = Request(
        f"{YOOKASSA_API_URL}/{payment_id}",
        headers={
            'Authorization': f'Basic {auth_bytes}',
            'Content-Type': 'application/json'
        },
        method='GET'
    )

    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode())
    except (HTTPError, Exception):
        return None


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_schema():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    return f"{schema}." if schema else ""


def build_rcon_command(product_key, duration_key, username):
    """Построить RCON команду по типу товара."""
    PRIVILEGE_COMMANDS = {
        'midnight': {'1m': 'lp user {user} parent addtemp midnight 30d', '3m': 'lp user {user} parent addtemp midnight 90d', 'forever': 'lp user {user} parent add midnight'},
        'exotic': {'1m': 'lp user {user} parent addtemp exotic 30d', '3m': 'lp user {user} parent addtemp exotic 90d', 'forever': 'lp user {user} parent add exotic'},
        'atomic': {'1m': 'lp user {user} parent addtemp atomic 30d', '3m': 'lp user {user} parent addtemp atomic 90d', 'forever': 'lp user {user} parent add atomic'},
        'warden': {'1m': 'lp user {user} parent addtemp warden 30d', '3m': 'lp user {user} parent addtemp warden 90d', 'forever': 'lp user {user} parent add warden'},
        'noris': {'1m': 'lp user {user} parent addtemp noris 30d', '3m': 'lp user {user} parent addtemp noris 90d', 'forever': 'lp user {user} parent add noris'},
        'chrona': {'1m': 'lp user {user} parent addtemp chrona 30d', '3m': 'lp user {user} parent addtemp chrona 90d', 'forever': 'lp user {user} parent add chrona'},
        'briz': {'1m': 'lp user {user} parent addtemp briz 30d', '3m': 'lp user {user} parent addtemp briz 90d', 'forever': 'lp user {user} parent add briz'},
        'shovel': {'1m': 'lp user {user} parent addtemp shovel 30d', '3m': 'lp user {user} parent addtemp shovel 90d', 'forever': 'lp user {user} parent add shovel'},
        'kactom': {'1m': 'lp user {user} parent addtemp custom 30d', '2m': 'lp user {user} parent addtemp custom 60d', '3m': 'lp user {user} parent addtemp custom 90d'},
    }

    ITEM_COMMANDS = {
        'case_donate': 'cubelets give {user} donate 1',
        'case_currency': 'cubelets give {user} value 1',
        'cache_keys': 'cache give {user} holo5 1',
        'harribo': 'cubelets give {user} harribo 1',
        'unban': 'unban {user}',
        'unmute': 'unmute {user}',
        'shovel_pass': 'pass give {user} 30d',
    }

    product_lower = product_key.lower() if product_key else ''

    if product_lower.startswith('season_'):
        days = product_lower.replace('season_', '')
        cmd = f'lp user {username} parent addtemp season {days}d'
        return cmd

    if 'кусочков' in product_lower or 'currency_' in product_lower:
        amount = product_lower.replace('currency_', '')
        try:
            amount = int(amount)
        except ValueError:
            amount = 100
        return f'points give {username} {amount}'

    if product_lower in PRIVILEGE_COMMANDS:
        cmds = PRIVILEGE_COMMANDS[product_lower]
        dk = duration_key or '1m'
        cmd = cmds.get(dk, cmds.get('1m', ''))
        return cmd.replace('{user}', username)

    if product_lower in ITEM_COMMANDS:
        return ITEM_COMMANDS[product_lower].replace('{user}', username)

    return None


def handler(event, context):
    """Обработка вебхука ЮKassa — обновление заказа + очередь выдачи."""
    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': HEADERS,
            'body': json.dumps({'error': 'Method not allowed'})
        }

    body = event.get('body', '{}')
    if event.get('isBase64Encoded'):
        body = base64.b64decode(body).decode('utf-8')

    try:
        data = json.loads(body)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': 'Invalid JSON'})
        }

    payment_object = data.get('object', {})
    payment_id = payment_object.get('id', '')
    metadata = payment_object.get('metadata', {})

    if not payment_id:
        return {
            'statusCode': 400,
            'headers': HEADERS,
            'body': json.dumps({'error': 'Missing payment id'})
        }

    shop_id = os.environ.get('YOOKASSA_SHOP_ID', '')
    secret_key = os.environ.get('YOOKASSA_SECRET_KEY', '')

    if shop_id and secret_key:
        verified_payment = verify_payment_via_api(payment_id, shop_id, secret_key)
        if not verified_payment:
            return {
                'statusCode': 400,
                'headers': HEADERS,
                'body': json.dumps({'error': 'Payment verification failed'})
            }
        payment_status = verified_payment.get('status', '')
    else:
        payment_status = payment_object.get('status', '')

    S = get_schema()
    conn = get_connection()

    try:
        cur = conn.cursor()
        now = datetime.utcnow().isoformat()

        cur.execute(f"SELECT id, status, user_name, product_key, duration_key FROM {S}orders WHERE yookassa_payment_id = %s", (payment_id,))
        row = cur.fetchone()

        if not row:
            order_id_meta = metadata.get('order_id')
            if order_id_meta:
                cur.execute(f"SELECT id, status, user_name, product_key, duration_key FROM {S}orders WHERE id = %s", (int(order_id_meta),))
                row = cur.fetchone()

        if not row:
            return {
                'statusCode': 404,
                'headers': HEADERS,
                'body': json.dumps({'error': 'Order not found'})
            }

        order_id, current_status, username, product_key, duration_key = row

        if payment_status == 'succeeded' and current_status != 'paid':
            cur.execute(f"""
                UPDATE {S}orders
                SET status = 'paid', paid_at = %s, updated_at = %s
                WHERE id = %s
            """, (now, now, order_id))

            if username and product_key:
                rcon_cmd = build_rcon_command(product_key, duration_key, username)
                if rcon_cmd:
                    cur.execute(f"SELECT product_name FROM {S}order_items WHERE order_id = %s LIMIT 1", (order_id,))
                    item_row = cur.fetchone()
                    product_name = item_row[0] if item_row else product_key

                    cur.execute(f"""
                        INSERT INTO {S}delivery_queue
                        (order_id, username, rcon_command, product_name, status)
                        VALUES (%s, %s, %s, %s, 'pending')
                    """, (order_id, username, rcon_cmd, product_name))

                    cur.execute(f"UPDATE {S}orders SET delivery_status = 'queued', updated_at = %s WHERE id = %s", (now, order_id))

            cur.execute(f"""
                SELECT pc.id FROM {S}promo_codes pc
                JOIN {S}orders o ON LOWER(o.promo_code) = LOWER(pc.code)
                WHERE o.id = %s AND o.promo_code IS NOT NULL
            """, (order_id,))
            promo_row = cur.fetchone()
            if promo_row:
                promo_id = promo_row[0]
                month_year = datetime.utcnow().strftime('%Y-%m')
                cur.execute(f"UPDATE {S}promo_codes SET total_uses = total_uses + 1 WHERE id = %s", (promo_id,))
                cur.execute(f"""
                    INSERT INTO {S}promo_usage_stats (promo_code_id, order_id, month_year)
                    VALUES (%s, %s, %s)
                """, (promo_id, order_id, month_year))

            conn.commit()

        elif payment_status == 'canceled' and current_status not in ('paid', 'canceled'):
            cur.execute(f"""
                UPDATE {S}orders
                SET status = 'canceled', updated_at = %s
                WHERE id = %s
            """, (now, order_id))
            conn.commit()

        return {
            'statusCode': 200,
            'headers': HEADERS,
            'body': json.dumps({'status': 'ok'})
        }

    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': HEADERS,
            'body': json.dumps({'error': 'Internal error'})
        }
    finally:
        conn.close()
