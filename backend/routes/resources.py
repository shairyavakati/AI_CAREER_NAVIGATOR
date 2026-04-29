"""
Resource Recommendation routes.
"""

from flask import Blueprint, request, jsonify
from helpers import get_supabase, token_required

resources_bp = Blueprint("resources", __name__)


@resources_bp.route("/", methods=["GET"])
@token_required
def get_resources(current_user_id):
    sb = get_supabase()
    filter_type = request.args.get("type", "All")

    query = sb.table("resources").select("*")
    if filter_type and filter_type != "All":
        query = query.eq("type", filter_type.rstrip("s"))  # "Courses" -> "Course"

    result = query.execute()

    icon_map = {"Course": "Video", "Article": "FileText", "Book": "BookOpen", "Practice": "Code"}
    resources = []
    for r in result.data:
        resources.append({
            "id": r["id"], "type": r["type"], "icon": icon_map.get(r["type"], "BookOpen"),
            "title": r["title"], "provider": r["provider"], "duration": r["duration"],
            "rating": r["rating"], "difficulty": r["difficulty"], "color": r["color"],
            "tags": r.get("tags", []), "url": r.get("url", "#")
        })

    return jsonify({"resources": resources})
