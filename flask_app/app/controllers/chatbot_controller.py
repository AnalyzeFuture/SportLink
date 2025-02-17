from app.models.chatbot_model import ChatbotModel

class ChatbotController:
    def __init__(self):
        self.chatbot = ChatbotModel()

    def process_question(self, question):
        """Handles the logic for chatbot responses."""
        try:
            response = self.chatbot.get_response(question)
            return {"response": response}
        except Exception as e:
            return {"error": str(e)}
