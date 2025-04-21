from flask import Blueprint, request, jsonify
from app.controllers.sentiment_controller import analyze_sentiment

# Define a Blueprint for sentiment routes
sentiment_bp = Blueprint('sentiment', __name__)

@sentiment_bp.route('/sentiment', methods=['POST'])
def sentiment_analysis():
    """
    API endpoint to analyze sentiment of a given text.
    """
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Text field is required"}), 400

    text = data['text']
    result = analyze_sentiment(text)
    return jsonify(result), 200