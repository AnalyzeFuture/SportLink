from app.models.sentiment_model import predict_sentiment

def analyze_sentiment(text):
    """
    Controller function to handle sentiment analysis.
    """
    return predict_sentiment(text)