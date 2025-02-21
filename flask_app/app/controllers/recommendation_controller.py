from app.models.recommendation_model import get_recommendations_from_model

def get_recommendations(post_id):
    return get_recommendations_from_model(post_id)
