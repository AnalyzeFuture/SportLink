import joblib
import os

# Load the pre-trained model and vectorizer
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../logistic_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), '../../tfidf_vectorizer.pkl')

print("Loading model from:", MODEL_PATH)
print("Loading vectorizer from:", VECTORIZER_PATH)


with open(MODEL_PATH, 'rb') as model_file:
    logistic_model = joblib.load(model_file)

with open(VECTORIZER_PATH, 'rb') as vectorizer_file:
    tfidf_vectorizer = joblib.load(vectorizer_file)

def predict_sentiment(text):
    """
    Predict the sentiment of the given text using the logistic regression model.
    """
    # Transform the input text using the vectorizer
    text_vectorized = tfidf_vectorizer.transform([text])
    
    # Predict sentiment (0 = Negative, 1 = Positive)
    prediction = logistic_model.predict(text_vectorized)
    
    # Map prediction to sentiment label
    sentiment = int(prediction[0])   # 0 for negative, 1 for positive
    return {"sentiment": sentiment}