"""API для платформы репетитора — управление разделами, материалами и уведомлениями."""
import json
import os
import re
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, status=400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def is_admin(event):
    return event.get("headers", {}).get("X-Admin-Token") == "admin"

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:40] or "section"

def fmt_date(dt):
    months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"]
    return f"{dt.day} {months[dt.month - 1]}"

def handler(event: dict, context) -> dict:
    """Единая точка API: ?resource=sections|materials|notifications&id=...&section=..."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    resource = qs.get("resource", "")
    res_id = qs.get("id", "")

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── sections ──────────────────────────────────────
        if resource == "sections":
            if method == "GET":
                cur.execute("SELECT id, slug, label, icon, color, sort_order FROM sections ORDER BY sort_order, id")
                rows = cur.fetchall()
                return ok([{"id": r[0], "slug": r[1], "label": r[2], "icon": r[3], "color": r[4], "sort_order": r[5]} for r in rows])

            if method == "POST":
                if not is_admin(event):
                    return err("Forbidden", 403)
                label = body.get("label", "").strip()
                if not label:
                    return err("label is required")
                slug = slugify(label)
                icon = body.get("icon", "FolderOpen")
                color = body.get("color", "from-violet-500 to-purple-600")
                cur.execute("SELECT COUNT(*) FROM sections WHERE slug = %s", (slug,))
                if cur.fetchone()[0] > 0:
                    slug = slug + "_" + str(abs(hash(label)) % 1000)
                cur.execute(
                    "INSERT INTO sections (slug, label, icon, color, sort_order) VALUES (%s, %s, %s, %s, (SELECT COALESCE(MAX(sort_order),0)+1 FROM sections)) RETURNING id, slug, label, icon, color, sort_order",
                    (slug, label, icon, color)
                )
                row = cur.fetchone()
                conn.commit()
                return ok({"id": row[0], "slug": row[1], "label": row[2], "icon": row[3], "color": row[4], "sort_order": row[5]}, 201)

            if method == "DELETE":
                if not is_admin(event):
                    return err("Forbidden", 403)
                if not res_id:
                    return err("id required")
                cur.execute("DELETE FROM materials WHERE section_slug = (SELECT slug FROM sections WHERE id = %s)", (res_id,))
                cur.execute("DELETE FROM sections WHERE id = %s", (res_id,))
                conn.commit()
                return ok({"ok": True})

        # ── materials ─────────────────────────────────────
        if resource == "materials":
            if method == "GET":
                section = qs.get("section")
                if section:
                    cur.execute("SELECT id, title, description, tag, color, icon, section_slug, created_at FROM materials WHERE section_slug = %s ORDER BY created_at DESC", (section,))
                else:
                    cur.execute("SELECT id, title, description, tag, color, icon, section_slug, created_at FROM materials ORDER BY created_at DESC")
                rows = cur.fetchall()
                return ok([{"id": r[0], "title": r[1], "desc": r[2], "tag": r[3], "color": r[4], "icon": r[5], "section": r[6], "date": fmt_date(r[7])} for r in rows])

            if method == "POST":
                if not is_admin(event):
                    return err("Forbidden", 403)
                title = body.get("title", "").strip()
                if not title:
                    return err("title is required")
                section_slug = body.get("section", "")
                cur.execute("SELECT slug FROM sections WHERE slug = %s", (section_slug,))
                if not cur.fetchone():
                    return err("section not found")
                cur.execute(
                    "INSERT INTO materials (title, description, tag, color, icon, section_slug) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, title, description, tag, color, icon, section_slug, created_at",
                    (title, body.get("desc", ""), body.get("tag", ""), body.get("color", "from-violet-500 to-purple-600"), body.get("icon", "BookOpen"), section_slug)
                )
                row = cur.fetchone()
                conn.commit()
                return ok({"id": row[0], "title": row[1], "desc": row[2], "tag": row[3], "color": row[4], "icon": row[5], "section": row[6], "date": fmt_date(row[7])}, 201)

            if method == "DELETE":
                if not is_admin(event):
                    return err("Forbidden", 403)
                if not res_id:
                    return err("id required")
                cur.execute("DELETE FROM materials WHERE id = %s", (int(res_id),))
                conn.commit()
                return ok({"ok": True})

        # ── notifications ─────────────────────────────────
        if resource == "notifications":
            if method == "GET":
                cur.execute("SELECT id, text, type, created_at FROM notifications ORDER BY created_at DESC LIMIT 50")
                rows = cur.fetchall()
                return ok([{"id": r[0], "text": r[1], "type": r[2], "time": fmt_date(r[3])} for r in rows])

            if method == "POST":
                if not is_admin(event):
                    return err("Forbidden", 403)
                text = body.get("text", "").strip()
                if not text:
                    return err("text is required")
                ntype = body.get("type", "task")
                cur.execute("INSERT INTO notifications (text, type) VALUES (%s, %s) RETURNING id, text, type, created_at", (text, ntype))
                row = cur.fetchone()
                conn.commit()
                return ok({"id": row[0], "text": row[1], "type": row[2], "time": fmt_date(row[3])}, 201)

        return err("Not found", 404)

    finally:
        cur.close()
        conn.close()
