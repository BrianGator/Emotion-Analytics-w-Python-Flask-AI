import unittest
from EmotionDetection.emotion_detection import emotion_detector

class TestEmotionDetection(unittest.TestCase):
    def test_emotion_detector(self):
        # Test Case 1: Joy
        result_1 = emotion_detector("I am glad this happened")
        self.assertEqual(result_1['dominant_emotion'], 'joy')
        
        # Test Case 2: Anger
        result_2 = emotion_detector("I am really mad about this")
        self.assertEqual(result_2['dominant_emotion'], 'anger')
        
        # Test Case 3: Disgust
        result_3 = emotion_detector("I am really disgusted just sounding about this")
        self.assertEqual(result_3['dominant_emotion'], 'disgust')
        
        # Test Case 4: Fear
        result_4 = emotion_detector("I am really afraid that this will happen")
        self.assertEqual(result_4['dominant_emotion'], 'fear')
        
        # Test Case 5: Sadness
        result_5 = emotion_detector("I am really sad about this")
        self.assertEqual(result_5['dominant_emotion'], 'sadness')

if __name__ == "__main__":
    unittest.main()
