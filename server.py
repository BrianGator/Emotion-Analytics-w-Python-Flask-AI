import os
import json
import requests
from flask import Flask, request, send_from_directory, render_template_string
from EmotionDetection.emotion_detection import emotion_detector

app = Flask(__name__, static_folder='dist')

def _format_response(data):
    """
    Build the human-readable sentence that the assignment expects.
    """
    return (
        f"For the given statement, the system response is "
        f"'anger': {data['anger']}, 'disgust': {data['disgust']}, "
        f"'fear': {data['fear']}, 'joy': {data['joy']} and "
        f"'sadness': {data['sadness']}. The dominant emotion is {data['dominant_emotion']}."
    )

# --- Dashboard API (Ported from server.ts) ---

@app.route("/api/analyze", methods=["POST"])
def analyze_api():
    """
    Dashboard API endpoint for the React frontend.
    """
    data = request.get_json()
    text = data.get('text', '').strip() if data else ''

    if not text:
        return {
            "anger": None,
            "disgust": None,
            "fear": None,
            "joy": None,
            "sadness": None,
            "dominant_emotion": None,
            "error": "Invalid text! Please provide feedback to analyze."
        }, 400

    # Primary: Watson NLP via EmotionDetection package
    result = emotion_detector(text)
    
    if result.get('status_code') == 200:
        return result

    # Fallback: Gemini AI via direct REST API
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return {"error": "API Key missing"}, 500

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        prompt = f"""Analyze the following customer feedback text and output ONLY a JSON object containing the scores for these emotions: anger, disgust, fear, joy, and sadness. Each score should be between 0.0 and 1.0. Also include a "dominant_emotion" field.
        
        Text: "{text}"
        
        JSON format example:
        {{
          "anger": 0.01,
          "disgust": 0.02,
          "fear": 0.0,
          "joy": 0.95,
          "sadness": 0.02,
          "dominant_emotion": "joy"
        }}"""

        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        resp_json = response.json()
        
        text_out = resp_json['candidates'][0]['content']['parts'][0]['text']
        # Extract JSON from potential markdown tags
        import re
        match = re.search(r'\{[\s\S]*\}', text_out)
        if match:
            return json.loads(match.group(0))
        raise Exception("JSON parse error")

    except Exception as e:
        print(f"Analysis Error: {e}")
        return {"error": "System error during analysis."}, 500

# --- Lab Requirement API ---

@app.route("/emotionDetector", methods=["GET", "POST"])
def detect_emotion():
    """
    Lab endpoint for emotion analysis.
    """
    text = ""
    if request.method == 'POST':
        if request.is_json:
            text = (request.get_json() or {}).get("text", "").strip()
        else:
            text = request.form.get("text", "").strip()
    else:
        text = request.args.get('textToAnalyze', "").strip()

    result = emotion_detector(text)

    if result.get('status_code') == 400 or result.get('dominant_emotion') is None:
        return "Invalid text! Please try again!."

    return (
        _format_response(result),
        200,
        {"Content-Type": "application/json"}
    )

# --- Static File Serving & Routing ---

@app.route("/", defaults={'path': ''})
@app.route("/<path:path>")
def serve(path):
    """
    Serves the built React app from the dist folder.
    """
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    # Ensure port 3000 is used for external accessibility
    app.run(host="0.0.0.0", port=3000, debug=False)
