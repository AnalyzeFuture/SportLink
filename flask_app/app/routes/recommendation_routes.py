from flask import Blueprint, request, jsonify
from app.controllers.recommendation_controller import get_recommendations

recommendation_bp = Blueprint('recommendation_bp', __name__)

@recommendation_bp.route('/recommendations', methods=['POST'])
def recommendations():
    data = request.get_json()
    post_id = data.get('post_id')
    recommendations = get_recommendations(post_id)
    return jsonify(recommendations)

# Ensure recommendation_bp is exported
__all__ = ['recommendation_bp']
