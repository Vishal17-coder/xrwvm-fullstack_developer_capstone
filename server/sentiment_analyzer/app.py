import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "service": "Automotive Review Sentiment Analyzer Microservice",
        "endpoint": "/analyze/<text>"
    })

@app.route("/analyze/<path:review_text>", methods=["GET"])
def analyze_sentiment(review_text):
    try:
        # Use TextBlob sentiment analysis or fallback heuristic
        blob = TextBlob(review_text)
        polarity = blob.sentiment.polarity

        if polarity > 0.05:
            sentiment = "positive"
        elif polarity < -0.05:
            sentiment = "negative"
        else:
            # Check keywords as backup
            text_lower = review_text.lower()
            positive_words = ["fantastic", "great", "excellent", "good", "amazing", "awesome", "perfect", "loved", "best", "happy", "smooth", "courteous", "impeccable"]
            negative_words = ["bad", "terrible", "awful", "horrible", "poor", "worst", "disappointed", "rude", "scam", "broken", "unhappy"]
            
            if any(w in text_lower for w in positive_words):
                sentiment = "positive"
            elif any(w in text_lower for w in negative_words):
                sentiment = "negative"
            else:
                sentiment = "neutral"

        return jsonify({
            "status": 200,
            "text": review_text,
            "sentiment": sentiment,
            "polarity": round(polarity, 2)
        }), 200
    except Exception as e:
        return jsonify({"status": 500, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
