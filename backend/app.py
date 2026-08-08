import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2

from fer_model import predict_emotion_from_frame

app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json

        if "image" not in data:
            return jsonify({"error": "No image received"}), 400

        # Decode image
        image_data = data["image"].split(",")[1]
        img_bytes = base64.b64decode(image_data)

        npimg = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if frame is None:
            return jsonify({"emotion": "Invalid Frame", "box": None})

        print("Frame:", frame.shape)

        # Get emotion + bounding box
        emotion, box = predict_emotion_from_frame(frame)

        return jsonify({
            "emotion": emotion,
            "box": box
        })

    except Exception as e:
        print("APP ERROR:", e)
        return jsonify({"emotion": "Error", "box": None}), 500


@app.route('/', methods=['GET'])
def home():
    return "Flask FER Server Running!"


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)