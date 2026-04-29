"""
AI Career Navigator - Flask Backend
Main application entry point
"""

from flask import Flask
from flask_cors import CORS
from config import Config
from supabase import create_client

from routes.auth import auth_bp
from routes.roles import roles_bp
from routes.assessment import assessment_bp
from routes.learning_path import learning_path_bp
from routes.study_planner import study_planner_bp
from routes.analytics import analytics_bp
from routes.quiz import quiz_bp
from routes.revision import revision_bp
from routes.motivation import motivation_bp
from routes.resources import resources_bp
from routes.skill_evolution import skill_evolution_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

    # Initialize Supabase client
    try:
        supabase = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
        app.supabase = supabase
    except Exception as e:
        print(f"Warning: Could not initialize Supabase client: {e}")
        app.supabase = None

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(roles_bp, url_prefix="/api/roles")
    app.register_blueprint(assessment_bp, url_prefix="/api/assessment")
    app.register_blueprint(learning_path_bp, url_prefix="/api/learning-path")
    app.register_blueprint(study_planner_bp, url_prefix="/api/planner")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(quiz_bp, url_prefix="/api/quiz")
    app.register_blueprint(revision_bp, url_prefix="/api/revision")
    app.register_blueprint(motivation_bp, url_prefix="/api/motivation")
    app.register_blueprint(resources_bp, url_prefix="/api/resources")
    app.register_blueprint(skill_evolution_bp, url_prefix="/api/skill-evolution")

    # Health check and root
    @app.route("/")
    def index():
        return {"status": "ok", "message": "Welcome to AI Career Navigator API. The frontend is running on port 5173."}

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "AI Career Navigator API is running"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
