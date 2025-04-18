from flask import Flask, jsonify, request
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient("mongodb://localhost:27017/")
db = client["sportlink"]

@app.route("/api/sports-participation/<user_id>", methods=["GET"])
def get_sports_participation(user_id):
    try:
        print(f"Received request for user_id: {user_id}")  # Debugging log
        data = list(db.sports_participation.find({"user_id": user_id}, {"_id": 0}))
        print(f"Fetched data for user_id {user_id}: {data}")  # Debugging log
        return jsonify(data), 200
    except Exception as e:
        print(f"Error fetching sports participation data: {str(e)}")  # Debugging log
        return jsonify({"message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
