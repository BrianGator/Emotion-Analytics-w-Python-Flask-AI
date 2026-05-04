# emotion_detection.py
# --------------------------------------------------------------
# Watson‑NLP EmotionPredict wrapper – includes proper 400 handling
# --------------------------------------------------------------
# The endpoint, headers and payload format are supplied by the lab.
# This version returns a dictionary with all emotion values set to
# ``None`` and ``status_code`` 400 when the service indicates a bad
# request (e.g. blank user input).
# --------------------------------------------------------------

import json
import urllib.request
from urllib.error import HTTPError, URLError

# ------------------------------------------------------------------
# Constants supplied by the lab (do **not** modify)
# ------------------------------------------------------------------
EMOTION_URL = (
    "https://sn-watson-emotion.labs.skills.network"
    "/v1/watson.runtime.nlp.v1/NlpService/EmotionPredict"
)
HEADERS = {
    "Content-Type": "application/json",
    "grpc-metadata-mm-model-id": "emotion_aggregated-workflow_lang_en_stock",
}


def emotion_detector(text_to_analyze: str) -> dict:
    """
    Sends *text_to_analyze* to Watson’s EmotionPredict service and
    returns a dictionary with the five emotion scores, the dominant
    emotion and a ``status_code`` key.

    If the service returns HTTP 400 (or the input is empty) the
    function returns a dictionary where **all emotion values are
    ``None``** and ``status_code`` is 400, as required for Task 7.

    Parameters
    ----------
    text_to_analyze : str
        The raw customer feedback that should be analysed.

    Returns
    -------
    dict
        {
            "anger":   float | None,
            "disgust": float | None,
            "fear":    float | None,
            "joy":     float | None,
            "sadness": float | None,
            "dominant_emotion": str | None,
            "status_code": int   # 200 = success, 400 = bad request
        }
    """
    # --------------------------------------------------------------
    # 1️⃣ Guard against empty/whitespace‑only input (client‑side check)
    # --------------------------------------------------------------
    if not isinstance(text_to_analyze, str) or not text_to_analyze.strip():
        return {
            "anger": None,
            "disgust": None,
            "fear": None,
            "joy": None,
            "sadness": None,
            "dominant_emotion": None,
            "status_code": 400
        }

    # --------------------------------------------------------------
    # 2️⃣ Build request payload
    # --------------------------------------------------------------
    payload = {
        "raw_document": {
            "text": text_to_analyze
        }
    }
    data = json.dumps(payload).encode("utf-8")

    # --------------------------------------------------------------
    # 3️⃣ Prepare and send the HTTP request
    # --------------------------------------------------------------
    request = urllib.request.Request(
        url=EMOTION_URL,
        data=data,
        headers=HEADERS,
        method="POST"
    )

    try:
        with urllib.request.urlopen(request) as response:
            status_code = response.getcode()
            response_bytes = response.read()
            response_str = response_bytes.decode("utf-8")
    except HTTPError as http_err:
        # If Watson explicitly returns a 400 error we map it to the
        # required output format.
        if http_err.code == 400:
            return {
                "anger": None,
                "disgust": None,
                "fear": None,
                "joy": None,
                "sadness": None,
                "dominant_emotion": None,
                "status_code": 400
            }
        # Any other HTTP error is treated as a server‑side failure.
        return {
            "error": f"HTTPError {http_err.code}: {http_err.reason}",
            "status_code": 500
        }
    except URLError as url_err:
        return {
            "error": f"URLError: {url_err.reason}",
            "status_code": 500
        }
    except Exception as exc:
        return {
            "error": f"Unexpected error: {exc}",
            "status_code": 500
        }

    # --------------------------------------------------------------
    # 4️⃣ If the response itself reports 400 (unlikely with urllib,
    #     but we keep the guard for completeness)
    # --------------------------------------------------------------
    if status_code == 400:
        return {
            "anger": None,
            "disgust": None,
            "fear": None,
            "joy": None,
            "sadness": None,
            "dominant_emotion": None,
            "status_code": 400
        }

    # --------------------------------------------------------------
    # 5️⃣ Normal (200) case – parse JSON and extract emotions
    # --------------------------------------------------------------
    try:
        response_json = json.loads(response_str)
    except json.JSONDecodeError:
        return {
            "error": "Invalid JSON received from Watson service.",
            "status_code": 500
        }

    # Watson’s response format (used in the project):
    # {
    #   "text": {
    #     "emotion": {
    #       "anger": ..., "disgust": ..., "fear": ..., "joy": ..., "sadness": ...
    #     }
    #   }
    # }
    emotions_block = (
        response_json
        .get("text", {})
        .get("emotion", {})
    )

    anger   = float(emotions_block.get("anger",   0.0))
    disgust = float(emotions_block.get("disgust", 0.0))
    fear    = float(emotions_block.get("fear",    0.0))
    joy     = float(emotions_block.get("joy",     0.0))
    sadness = float(emotions_block.get("sadness", 0.0))

    # --------------------------------------------------------------
    # 6️⃣ Determine dominant emotion (largest score)
    # --------------------------------------------------------------
    scores = {
        "anger":   anger,
        "disgust": disgust,
        "fear":    fear,
        "joy":     joy,
        "sadness": sadness
    }
    dominant_emotion = max(scores, key=scores.get)

    # --------------------------------------------------------------
    # 7️⃣ Build the final successful result dictionary
    # --------------------------------------------------------------
    return {
        "anger": anger,
        "disgust": disgust,
        "fear": fear,
        "joy": joy,
        "sadness": sadness,
        "dominant_emotion": dominant_emotion,
        "status_code": 200
    }


# ------------------------------------------------------------------
# CLI helper – quick manual test from the command line:
#   python -m emotion_detection "I love this new technology."
# ------------------------------------------------------------------
if __name__ == "__main__":
    import sys

    sample = (
        " ".join(sys.argv[1:])
        if len(sys.argv) > 1
        else "I love this new technology."
    )
    print(json.dumps(emotion_detector(sample), indent=2))
