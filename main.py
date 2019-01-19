from flask import Flask, render_template, jsonify, request
from PIL import Image
import os
import base64
import cv2
import numpy as np
import matplotlib.pyplot as plt

import os

import tensorflow as tf

import keras
from keras.models import load_model

global graph, model

graph = tf.get_default_graph()
model = load_model('mnist_model.h5')


app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    raw_image_json = request.get_json()
    image_str = raw_image_json['imageData']

    prediction = classify_image(image_str)

    return jsonify({'prediction': prediction}), 201


def classify_image(image_str):
    imgdata = base64.b64decode(image_str)

    filename = 'image.png'
    with open(filename, 'wb') as f:
        f.write(imgdata)

    img = Image.open(filename)

    img_array = np.asarray(img)
    resized = cv2.resize(img_array, (28, 28))
    gray_scale = cv2.cvtColor(resized, cv2.COLOR_BGR2GRAY)
    image = gray_scale

    image = image / 255
    image = image.reshape(1, 28, 28, 1)

    prediction = None
    with graph.as_default():
        prediction = model.predict_classes(image)

    prediction_str = str(prediction[0])
    print(prediction_str)

    os.remove(filename)

    tf.keras.backend.clear_session()

    return prediction_str


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port)
