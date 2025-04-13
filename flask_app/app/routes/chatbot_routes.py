from flask import Blueprint, request, jsonify
from app.controllers.chatbot_controller import ChatbotController

chatbot_bp = Blueprint('chatbot', __name__)
chatbot_controller = ChatbotController()

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    """
    Expects a JSON payload with a 'userQuery' field.
    Example:
        {
            "userQuery": "What is SportLink?"
        }
    """
    data = request.get_json()
    if not data or 'userQuery' not in data:
        return jsonify({'error': 'Missing "userQuery" in request.'}), 400
    userQuery = data['userQuery']

    try:
        response = chatbot_controller.get_chat_response(userQuery)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # response = chatbot_controller.process_question(userQuery)
    # return jsonify(response)
