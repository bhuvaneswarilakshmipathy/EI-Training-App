from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

def predict_emotion(frame):
    return "Happy"  

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['frame']
    
    # Convert image to OpenCV format
    npimg = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    emotion = predict_emotion(frame)

    return jsonify({
        "emotion": emotion
    })

if __name__ == '__main__':
    app.run(debug=True)