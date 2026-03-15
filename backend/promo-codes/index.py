"""API для промокодов: проверка, CRUD для админов, статистика."""
import json
import os
import base64
from datetime import datetime

import psycopg2

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
    'Content-Type': 'application/json'
}

ADMIN_KEY_HEADER = 'X-Admin-Key'


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_schema():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    return f"{schema}." if schema else ""


def check_admin(event):
    headers = event.get('headers', {})
    admin_key = headers.get(ADMIN_KEY_HEADER, '') or headers.get(ADMIN_KEY_HEADER.lower(), '')
    expected = os.environ.get('ADMIN_SECRET_KEY', '')
    if not expected:
        return False
    return admin_key == expected


def handler(event, context):
    """API промокодов: проверка, создание, статистика."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('queryStringParameters', {}) or {}
    action = path.get('action', 'check')

    body = event.get('body', '{}')
    if event.get('isBase64Encoded'):
        body = base64.b64decode(body).decode('utf-8')
    try:
        data = json.loads(body) if body else {}
    except json.JSONDecodeError:
        data = {}

    S = get_schema()
    conn = get_connection()

    try:
        cur = conn.cursor()

        if action == 'check' and method == 'POST':
            code = data.get('code', '').strip().lower()
            product_name = data.get('product_name', '')

            if not code:
                return response(400, {'error': 'Промокод не указан'})

            cur.execute(f"SELECT id, code, discount_percent, is_active, max_uses, total_uses, exclude_items FROM {S}promo_codes WHERE LOWER(code) = %s", (code,))
            row = cur.fetchone()

            if not row:
                return response(404, {'valid': False, 'message': 'Промокод не найден'})

            promo_id, promo_code, discount, is_active, max_uses, total_uses, exclude_items = row

            if not is_active:
                return response(200, {'valid': False, 'message': 'Промокод не активен'})

            if max_uses and total_uses >= max_uses:
                return response(200, {'valid': False, 'message': 'Промокод использован максимальное количество раз'})

            if exclude_items and product_name:
                for excl in exclude_items:
                    if excl.lower() in product_name.lower():
                        return response(200, {'valid': False, 'message': 'Промокод не работает на этот товар'})

            return response(200, {
                'valid': True,
                'discount': discount,
                'message': f'Скидка {discount}% применена'
            })

        elif action == 'list' and method == 'GET':
            if not check_admin(event):
                return response(403, {'error': 'Доступ запрещен'})

            cur.execute(f"SELECT id, code, discount_percent, is_active, max_uses, total_uses, exclude_items, created_at FROM {S}promo_codes ORDER BY created_at DESC")
            rows = cur.fetchall()
            promos = []
            for r in rows:
                promos.append({
                    'id': r[0], 'code': r[1], 'discount': r[2],
                    'is_active': r[3], 'max_uses': r[4], 'total_uses': r[5],
                    'exclude_items': r[6] or [], 'created_at': str(r[7])
                })
            return response(200, {'promo_codes': promos})

        elif action == 'create' and method == 'POST':
            if not check_admin(event):
                return response(403, {'error': 'Доступ запрещен'})

            code = data.get('code', '').strip().lower()
            discount = data.get('discount', 0)
            max_uses = data.get('max_uses')
            exclude_items = data.get('exclude_items', [])

            if not code or not discount:
                return response(400, {'error': 'code и discount обязательны'})

            cur.execute(
                f"INSERT INTO {S}promo_codes (code, discount_percent, max_uses, exclude_items) VALUES (%s, %s, %s, %s) RETURNING id",
                (code, discount, max_uses, exclude_items)
            )
            promo_id = cur.fetchone()[0]
            conn.commit()
            return response(201, {'id': promo_id, 'message': 'Промокод создан'})

        elif action == 'update' and method == 'PUT':
            if not check_admin(event):
                return response(403, {'error': 'Доступ запрещен'})

            promo_id = data.get('id')
            if not promo_id:
                return response(400, {'error': 'id обязателен'})

            updates = []
            params = []
            if 'is_active' in data:
                updates.append("is_active = %s")
                params.append(data['is_active'])
            if 'discount' in data:
                updates.append("discount_percent = %s")
                params.append(data['discount'])
            if 'max_uses' in data:
                updates.append("max_uses = %s")
                params.append(data['max_uses'])
            if 'exclude_items' in data:
                updates.append("exclude_items = %s")
                params.append(data['exclude_items'])

            if not updates:
                return response(400, {'error': 'Нет полей для обновления'})

            updates.append("updated_at = %s")
            params.append(datetime.utcnow().isoformat())
            params.append(promo_id)

            cur.execute(f"UPDATE {S}promo_codes SET {', '.join(updates)} WHERE id = %s", params)
            conn.commit()
            return response(200, {'message': 'Промокод обновлен'})

        elif action == 'stats' and method == 'GET':
            if not check_admin(event):
                return response(403, {'error': 'Доступ запрещен'})

            cur.execute(f"""
                SELECT pc.code, pus.month_year, COUNT(*) as uses
                FROM {S}promo_usage_stats pus
                JOIN {S}promo_codes pc ON pc.id = pus.promo_code_id
                GROUP BY pc.code, pus.month_year
                ORDER BY pus.month_year DESC, uses DESC
            """)
            rows = cur.fetchall()
            stats = []
            for r in rows:
                stats.append({'code': r[0], 'month': r[1], 'uses': r[2]})
            return response(200, {'stats': stats})

        return response(400, {'error': 'Неизвестное действие'})

    except Exception as e:
        conn.rollback()
        return response(500, {'error': str(e)})
    finally:
        conn.close()


def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': HEADERS,
        'body': json.dumps(body, ensure_ascii=False)
    }
