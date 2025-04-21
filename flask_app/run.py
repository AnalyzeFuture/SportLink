from flask import Flask
from app.routes.chatbot_routes import chatbot_bp
from app.routes.recommendation_routes import recommendation_bp
from flask_cors import CORS
from app.models.recommendation_model import fetch_data_from_node
from app.routes.sentiment_routes import sentiment_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Fetch data at the start of the server
    print("Calling fetch_data_from_node...")
    fetch_data_from_node()
    print("Data fetched successfully.")
    
    # Register Blueprints
    app.register_blueprint(chatbot_bp, url_prefix='/api')
    app.register_blueprint(recommendation_bp, url_prefix='/api')
    app.register_blueprint(sentiment_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0", port=8080)
