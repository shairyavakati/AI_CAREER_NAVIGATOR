"""
Shared helper utilities for authentication and common operations.
"""

import jwt
from functools import wraps
from flask import request, jsonify, current_app
from config import Config


def token_required(f):
    """Decorator to protect routes with JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get("Authorization", "")

        parts = auth_header.split(" ")
        if len(parts) == 2 and parts[0] == "Bearer":
            token = parts[1]

        if not token:
            return jsonify({"error": "Authentication token is missing"}), 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            current_user_id = payload["user_id"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        return f(current_user_id, *args, **kwargs)

    return decorated


def get_supabase():
    """Get the Supabase client from the Flask app context."""
    return current_app.supabase
