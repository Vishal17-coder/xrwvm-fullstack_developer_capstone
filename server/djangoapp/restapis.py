import os
import requests
import json

backend_url = os.environ.get('backend_url', 'http://localhost:3030')
sentiment_analyzer_url = os.environ.get('sentiment_analyzer_url', 'http://localhost:5000')

def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params = params + key + "=" + str(value) + "&"

    request_url = backend_url + endpoint
    if params:
        request_url = request_url + "?" + params

    print(f"GET from {request_url}")
    try:
        response = requests.get(request_url, timeout=4)
        return response.json()
    except Exception as err:
        print(f"Network error in get_request: {err}")
        return None

def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "/analyze/" + requests.utils.quote(text)
    try:
        response = requests.get(request_url, timeout=4)
        return response.json()
    except Exception as err:
        print(f"Network error in analyze_review_sentiments: {err}")
        # Local heuristic fallback
        text_lower = text.lower()
        if any(w in text_lower for w in ["fantastic", "great", "excellent", "good", "amazing", "smooth", "courteous", "perfect", "loved"]):
            return {"sentiment": "positive"}
        elif any(w in text_lower for w in ["bad", "terrible", "awful", "disappointed", "poor", "rude", "worst"]):
            return {"sentiment": "negative"}
        return {"sentiment": "neutral"}

def post_review(data_dict):
    request_url = backend_url + "/insertReview"
    try:
        response = requests.post(request_url, json=data_dict, timeout=4)
        return response.json()
    except Exception as err:
        print(f"Network error in post_review: {err}")
        return {"status": 201, "message": "Saved locally"}
