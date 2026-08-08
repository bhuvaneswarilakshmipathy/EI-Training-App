from emotiefflib.facial_analysis import EmotiEffLibRecognizer
import cv2
from collections import deque

# Load model
recognizer = EmotiEffLibRecognizer(
    model_name="enet_b0_8_best_afew",
    engine="torch",
    device="cpu"
)

# Face detector
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

emotion_buffer = deque(maxlen=5)


def predict_emotion_from_frame(frame):
    try:
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=3,
            minSize=(30, 30)
        )

        print("Faces:", len(faces))

        if len(faces) == 0:
            return "No Face", None

        for (x, y, w, h) in faces:
            pad = 20
            y1 = max(0, y - pad)
            y2 = min(frame.shape[0], y + h + pad)
            x1 = max(0, x - pad)
            x2 = min(frame.shape[1], x + w + pad)

            face = frame[y1:y2, x1:x2]

            if face.shape[0] < 50 or face.shape[1] < 50:
                continue

            try:
                img_rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                img_rgb = cv2.resize(img_rgb, (224, 224))

                emotions, scores = recognizer.predict_emotions(img_rgb, logits=False)

                if emotions:
                    label = emotions[0]

                    emotion_buffer.append(label)
                    final_label = max(set(emotion_buffer), key=emotion_buffer.count)

                    return final_label, [int(x), int(y), int(w), int(h)]

            except Exception as e:
                print("Prediction ERROR:", e)
                return "Error", None

        return "No Face", None

    except Exception as e:
        print("Model ERROR:", e)
        return "Error", None