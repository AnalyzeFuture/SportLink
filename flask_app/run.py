from flask import Flask
from app.routes.chatbot_routes import chatbot_bp

def create_app():
    app = Flask(__name__)

    # Register Blueprints
    app.register_blueprint(chatbot_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host="0.0.0.0", port=8080)
