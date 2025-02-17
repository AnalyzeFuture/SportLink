from flask import Blueprint, request, jsonify
from app.controllers.chatbot_controller import ChatbotController

chatbot_bp = Blueprint('chatbot', __name__)
chatbot_controller = ChatbotController()

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    """
    Expects a JSON payload with a 'question' field.
    Example:
        {
            "question": "What is SportLink?"
        }
    """
    data = request.get_json()
    if not data or 'question' not in data:
        return jsonify({'error': 'Missing "question" in request.'}), 400

    question = data['question']
    response = chatbot_controller.process_question(question)
    return jsonify(response)
