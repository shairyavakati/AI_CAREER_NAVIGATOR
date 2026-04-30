from flask import Blueprint, request, jsonify
from config import Config
import os
import jwt
from helpers import get_supabase

chatbot_bp = Blueprint("chatbot", __name__)

# Try importing groq
try:
    from groq import Groq
    HAS_GROQ = True
except ImportError:
    HAS_GROQ = False

# RAG Context Simulation
BASE_SYSTEM_PROMPT = """You are the AI Career Navigator Assistant. 
You provide guidance on learning paths, study schedules, and career development.
Use the following context to ground your responses:
- The user is using an application that provides Adaptive Learning Paths, Study Planners, and Skill Gap Analysis.
- Emphasize the importance of consistent learning and using the app's Motivation System (streaks, achievements).
- Be supportive, concise, and professional.
"""

@chatbot_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message is required"}), 400
        
    user_message = data["message"]
    
    # Build a personalized prompt if user is authenticated
    dynamic_prompt = BASE_SYSTEM_PROMPT
    auth_header = request.headers.get("Authorization")
    
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            # Decode token
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
            user_id = payload.get("user_id")
            
            # Fetch User Profile from Supabase
            sb = get_supabase()
            result = sb.table("users").select("name, chosen_role, level, time_commitment").eq("id", user_id).execute()
            
            if result.data:
                user = result.data[0]
                name = user.get("name", "User")
                role = user.get("chosen_role", "Unknown Role")
                level = user.get("level", "Beginner")
                time = user.get("time_commitment", 60)
                
                dynamic_prompt += f"\n\n--- USER CONTEXT ---\n"
                dynamic_prompt += f"Name: {name}\n"
                dynamic_prompt += f"Target Career Role: {role}\n"
                dynamic_prompt += f"Current Level: {level}\n"
                dynamic_prompt += f"Daily Time Commitment: {time} minutes/day\n"
                dynamic_prompt += "Tailor your advice specifically to this career role and their available time!"
        except Exception as e:
            print(f"Chatbot Auth/DB Warning: {e}")
            # Ignore errors and fall back to base prompt
            pass

    if HAS_GROQ and Config.GROQ_API_KEY:
        try:
            client = Groq(api_key=Config.GROQ_API_KEY)
            
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": dynamic_prompt},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.7,
                max_tokens=1024,
            )
            
            response_text = completion.choices[0].message.content
            return jsonify({"response": response_text})
        except Exception as e:
            return jsonify({"error": f"Failed to generate response: {str(e)}"}), 500
    else:
        # Simulated RAG / Fallback response
        fallback_response = (
            "I am the AI Career Navigator Assistant. "
            "To unlock full AI capabilities and retrieval-augmented generation (RAG), "
            "please add your GROQ_API_KEY to the backend .env file and install `groq`. "
            f"\n\nFor now, I can tell you that regarding '{user_message}', you should check out your Adaptive Learning Path!"
        )
        return jsonify({"response": fallback_response})


