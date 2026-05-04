import requests
import json

def emotion_detector(text_to_analyze):
    """
    Function to detect emotions using Watson NLP Emotion Predict API.
    """
    url = 'https://sn-watson-emotion.labs.skills.network/v1/watson.runtime.nlp.v1/NlpService/EmotionPredict'
    headers = {"grpc-metadata-mm-model-id": "emotion_aggregated-workflow_lang_en_stock"}
    input_json = { "raw_document": { "text": text_to_analyze } }
    
    response = requests.post(url, json=input_json, headers=headers)
    
    # Task 3/7: Error handling for 400
    if response.status_code == 400:
        return {
            "anger": None,
            "disgust": None,
            "fear": None,
            "joy": None,
            "sadness": None,
            "dominant_emotion": None
        }
        
    formatted_response = json.loads(response.text)
    
    # Extracting emotions
    emotions = formatted_response['emotionPredictions'][0]['emotion']
    anger = emotions['anger']
    disgust = emotions['disgust']
    fear = emotions['fear']
    joy = emotions['joy']
    sadness = emotions['sadness']
    
    # Finding the dominant emotion
    emotion_list = [anger, disgust, fear, joy, sadness]
    emotion_names = ['anger', 'disgust', 'fear', 'joy', 'sadness']
    dominant_emotion = emotion_names[emotion_list.index(max(emotion_list))]
    
    result = {
        'anger': anger,
        'disgust': disgust,
        'fear': fear,
        'joy': joy,
        'sadness': sadness,
        'dominant_emotion': dominant_emotion
    }
    
    return result
