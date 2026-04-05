import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=True)
    notes = db.Column(db.Text, nullable=False)
    result = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "notes": self.notes,
            "result": self.result,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


@app.route("/")
def home():
    return {"message": "Backend is running"}


@app.route("/summarize", methods=["POST"])
def summarize_notes():
    try:
        data = request.get_json()
        notes = data.get("notes", "").strip()
        title = data.get("title", "Untitled Research").strip()

        if not notes:
            return jsonify({"error": "Notes are required"}), 400

        prompt = f"""
You are a UX research assistant.

Analyze the following user research notes and return:
1. A short summary
2. 3 main themes
3. 3 actionable insights

Research notes:
{notes}
"""

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt
        )

        result = response.output_text

        new_project = Project(
            title=title,
            notes=notes,
            result=result
        )
        db.session.add(new_project)
        db.session.commit()

        return jsonify({
            "result": result,
            "project": new_project.to_dict()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/projects", methods=["GET"])
def get_projects():
    try:
        projects = Project.query.order_by(Project.created_at.desc()).all()
        return jsonify([project.to_dict() for project in projects])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)