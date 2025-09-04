# attention/ml.py
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
from PIL import Image

# Load model globally once
MODEL_PATH = "attention/model/mobilenetv2fifth871.h5"
model = load_model(MODEL_PATH)

# Make sure you know your model's input size
IMG_SIZE = (224, 224)  # <-- change this to match your training

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Convert raw bytes into preprocessed image tensor"""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)  
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # shape (1, H, W, C)
    img_array = img_array / 255.0  # normalize if your training had rescaling
    return img_array

def predict_attention(image_bytes: bytes) -> tuple[bool, float]:
    """
    Predict attention.
    Returns: (attentive: bool, confidence: float)
    """
    x = preprocess_image(image_bytes)
    preds = model.predict(x)  # e.g. [[0.85]] if binary classification
    score = float(preds[0][0])

    # If > 0.5 → attentive, else distracted
    attentive = score < 0.3
    confidence = score if attentive else 1 - score

    return attentive, confidence
