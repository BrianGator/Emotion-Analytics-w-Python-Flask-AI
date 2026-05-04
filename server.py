"""
Flask web-service that wraps the EmotionDetection package.
"""

from flask import Flask, request, render_template_string
from EmotionDetection.emotion_detection import emotion_detector

app = Flask(__name__)

def _format_response(data):
    """
    Build the human-readable sentence that the assignment expects.

    Parameters
    ----------
    data : dict
        Dictionary returned by ``emotion_detector``. Must contain the
        keys ``anger``, ``disgust``, ``fear``, ``joy``, ``sadness`` and
        |dominant_emotion``.

    Returns
    -------
    str
        Sentence of the form:
        For the given statement, the system response is
        'anger': <anger>, 'disgust': <disgust>, 'fear': <fear>,
        'joy': <joy> and 'sadness': <sadness>. The dominant emotion is <dominant_emotion>.
    """
    return (
        f"For the given statement, the system response is "
        f"'anger': {data['anger']}, 'disgust': {data['disgust']}, "
        f"'fear': {data['fear']}, 'joy': {data['joy']} and "
        f"'sadness': {data['sadness']}. The dominant emotion is {data['dominant_emotion']}."
    )


@app.route("/", methods=["GET"])
def home():
    """
    Home page - a minimal HTML form for the emotion detector.
    """
    html = """
    <!doctype html>
    <html>
      <head>
        <title>Emotion Detector</title>
        <style>
          body { font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; line-height: 1.6; }
          textarea { width: 100%; border-radius: 8px; border: 1px solid #ccc; padding: 10px; }
          input[type="submit"] { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h2>Enter a statement to analyse</h2>
        <form action="/emotionDetector" method="get">
          <textarea name="textToAnalyze" rows="4" placeholder="Type your text here..."></textarea><br><br>
          <input type="submit" value="Detect Emotion">
        </form>
      </body>
    </html>
    """
    return render_template_string(html)


@app.route("/emotionDetector", methods=["POST", "GET"])
def detect_emotion():
    """
    Receives a text string, forwards it to the EmotionDetection package,
    and returns either:
    * a friendly sentence (status 200) when the analysis succeeds, or
    * an error message for invalid/blank inputs (Task 7).
    """
    # 1. Retrieve the submitted text (supports GET query, POST Form, and POST JSON)
    text = ""
    if request.method == 'POST':
        if request.is_json:
            payload = request.get_json(silent=True) or {}
            text = payload.get("text", "").strip()
        else:
            text = request.form.get("text", "").strip()
    else:
        text = request.args.get('textToAnalyze', "").strip()

    # 2. Call the core emotion detector
    result = emotion_detector(text)

    # 3. Task 7: Handling of blank input errors
    if result.get('status_code') == 400 or result.get('dominant_emotion') is None:
        return "Invalid text! Please try again!."

    # 4. Build the response
    friendly = _format_response(result)

    # Return the sentence as plain text with JSON Content-Type as requested
    return (
        friendly,
        200,
        {"Content-Type": "application/json"}
    )


if __name__ == "__main__":
    # Note: host 0.0.0.0 and port 3000 are required for access in this sandbox.
    # For local lab work, you may change this to 127.0.0.1 and 5000.
    app.run(host="0.0.0.0", port=3000, debug=False)
