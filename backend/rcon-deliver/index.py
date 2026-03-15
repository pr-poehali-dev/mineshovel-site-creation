"""RCON выдача товаров на Minecraft сервер. Проверяет очередь и выдаёт товары."""
import json
import os
import socket
import struct
import base64
from datetime import datetime

import psycopg2

HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
    'Content-Type': 'application/json'
}

MAX_ATTEMPTS = 10


def get_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def get_schema():
    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    return f"{schema}." if schema else ""


def check_admin(event):
    headers = event.get('headers', {})
    admin_key = headers.get('X-Admin-Key', '') or headers.get('x-admin-key', '')
    expected = os.environ.get('ADMIN_SECRET_KEY', '')
    if not expected:
        return False
    return admin_key == expected


class RconClient:
    """RCON клиент для Minecraft сервера."""

    SERVERDATA_AUTH = 3
    SERVERDATA_AUTH_RESPONSE = 2
    SERVERDATA_EXECCOMMAND = 2
    SERVERDATA_RESPONSE_VALUE = 0

    def __init__(self, host, port, password, timeout=10):
        self.host = host
        self.port = port
        self.password = password
        self.timeout = timeout
        self.sock = None
        self.request_id = 0

    def connect(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect((self.host, self.port))
        return self._auth()

    def _auth(self):
        self.request_id += 1
        self._send_packet(self.SERVERDATA_AUTH, self.password)
        response = self._read_packet()
        if response is None:
            return False
        return response['id'] != -1

    def command(self, cmd):
        self.request_id += 1
        self._send_packet(self.SERVERDATA_EXECCOMMAND, cmd)
        response = self._read_packet()
        if response is None:
            return None
        return response.get('body', '')

    def _send_packet(self, ptype, body):
        body_bytes = body.encode('utf-8') + b'\x00\x00'
        length = 4 + 4 + len(body_bytes)
        packet = struct.pack('<iii', length, self.request_id, ptype) + body_bytes
        self.sock.sendall(packet)

    def _read_packet(self):
        try:
            length_data = self._recv_exact(4)
            if not length_data:
                return None
            length = struct.unpack('<i', length_data)[0]
            data = self._recv_exact(length)
            if not data:
                return None
            request_id = struct.unpack('<i', data[:4])[0]
            ptype = struct.unpack('<i', data[4:8])[0]
            body = data[8:-2].decode('utf-8', errors='replace')
            return {'id': request_id, 'type': ptype, 'body': body}
        except (socket.timeout, ConnectionError, struct.error):
            return None

    def _recv_exact(self, n):
        data = b''
        while len(data) < n:
            try:
                chunk = self.sock.recv(n - len(data))
                if not chunk:
                    return None
                data += chunk
            except socket.timeout:
                return None
        return data

    def close(self):
        if self.sock:
            self.sock.close()


def execute_rcon(command):
    """Отправить команду на сервер через RCON."""
    host = os.environ.get('RCON_HOST', '')
    port = int(os.environ.get('RCON_PORT', '25575'))
    password = os.environ.get('RCON_PASSWORD', '')

    if not host or not password:
        return None, 'RCON не настроен'

    client = RconClient(host, port, password)
    try:
        if not client.connect():
            return None, 'Ошибка авторизации RCON'
        result = client.command(command)
        return result, None
    except (socket.timeout, ConnectionRefusedError, OSError) as e:
        return None, f'Не удалось подключиться к серверу: {str(e)}'
    finally:
        client.close()


def is_player_online(username):
    """Проверить, онлайн ли игрок."""
    result, error = execute_rcon(f'list')
    if error:
        return False, error
    if result and username.lower() in result.lower():
        return True, None
    return False, None


def handler(event, context):
    """Обработка очереди выдачи товаров через RCON."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', 'process')

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

        if action == 'process' and method == 'POST':
            cur.execute(f"""
                SELECT id, username, rcon_command, product_name, attempts
                FROM {S}delivery_queue
                WHERE status = 'pending' AND attempts < %s
                ORDER BY created_at ASC
                LIMIT 20
            """, (MAX_ATTEMPTS,))

            rows = cur.fetchall()
            results = []

            for row in rows:
                delivery_id, username, rcon_cmd, product_name, attempts = row
                now = datetime.utcnow().isoformat()

                online, err = is_player_online(username)

                if err:
                    cur.execute(f"""
                        UPDATE {S}delivery_queue
                        SET attempts = attempts + 1, last_attempt_at = %s, error_message = %s
                        WHERE id = %s
                    """, (now, err, delivery_id))
                    results.append({'id': delivery_id, 'status': 'error', 'error': err})
                    continue

                if not online:
                    results.append({'id': delivery_id, 'status': 'waiting', 'reason': 'player_offline'})
                    continue

                result, rcon_err = execute_rcon(rcon_cmd)

                if rcon_err:
                    cur.execute(f"""
                        UPDATE {S}delivery_queue
                        SET attempts = attempts + 1, last_attempt_at = %s, error_message = %s
                        WHERE id = %s
                    """, (now, rcon_err, delivery_id))
                    results.append({'id': delivery_id, 'status': 'error', 'error': rcon_err})
                else:
                    cur.execute(f"""
                        UPDATE {S}delivery_queue
                        SET status = 'delivered', delivered_at = %s, last_attempt_at = %s
                        WHERE id = %s
                    """, (now, now, delivery_id))

                    cur.execute(f"""
                        UPDATE {S}orders SET delivery_status = 'delivered', updated_at = %s
                        WHERE id = (SELECT order_id FROM {S}delivery_queue WHERE id = %s)
                    """, (now, delivery_id))

                    results.append({'id': delivery_id, 'status': 'delivered', 'product': product_name})

            conn.commit()
            return resp(200, {'processed': len(results), 'results': results})

        elif action == 'status' and method == 'GET':
            username = params.get('username', '').strip()
            if not username:
                return resp(400, {'error': 'username обязателен'})

            cur.execute(f"""
                SELECT id, product_name, status, created_at, delivered_at
                FROM {S}delivery_queue
                WHERE username = %s
                ORDER BY created_at DESC LIMIT 20
            """, (username,))

            rows = cur.fetchall()
            items = []
            for r in rows:
                items.append({
                    'id': r[0], 'product': r[1], 'status': r[2],
                    'created_at': str(r[3]), 'delivered_at': str(r[4]) if r[4] else None
                })
            return resp(200, {'deliveries': items})

        elif action == 'queue' and method == 'GET':
            if not check_admin(event):
                return resp(403, {'error': 'Доступ запрещен'})

            cur.execute(f"""
                SELECT dq.id, dq.username, dq.product_name, dq.status, dq.attempts,
                       dq.error_message, dq.created_at, dq.delivered_at
                FROM {S}delivery_queue dq
                ORDER BY dq.created_at DESC
                LIMIT 100
            """)

            rows = cur.fetchall()
            items = []
            for r in rows:
                items.append({
                    'id': r[0], 'username': r[1], 'product': r[2], 'status': r[3],
                    'attempts': r[4], 'error': r[5], 'created_at': str(r[6]),
                    'delivered_at': str(r[7]) if r[7] else None
                })
            return resp(200, {'queue': items})

        return resp(400, {'error': 'Неизвестное действие'})

    except Exception as e:
        conn.rollback()
        return resp(500, {'error': str(e)})
    finally:
        conn.close()


def resp(status_code, body):
    return {
        'statusCode': status_code,
        'headers': HEADERS,
        'body': json.dumps(body, ensure_ascii=False)
    }
