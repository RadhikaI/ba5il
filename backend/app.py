import os
import cv2
import tester
from together import Together
from flask import Flask, make_response, request, redirect, url_for, abort, session, jsonify
from flask_cors import CORS

try:
    from urlparse import urlparse, urljoin
except ImportError:
    from urllib.parse import urlparse, urljoin


app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})


TOGETHER_API_KEY = "" 
LLM_MODEL = "meta_3b"

together_models = {
    "meta_8b": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
    "meta_3b": "meta-llama/Llama-3.2-3B-Instruct-Turbo",
    "gemma2_27b": "google/gemma-2-27b-it",
    "gemma2_9b": "google/gemma-2-9b-it",
}


together_client  = Together(api_key = TOGETHER_API_KEY)

def together_function(message, conlang):
    system_message = f"""You are provided with a user message in English. 
Translate its contents into {conlang}. Return only the translated {conlang} as one string. 
If there are multiple possible translations, choose the best one. There is no need to provide an explanation.
User message: {message}"""
    messages = [
        {"role": "system", "content": system_message}
    ]
    response = together_client.chat.completions.create(
        model= "meta-llama/Llama-3.2-3B-Instruct-Turbo",
        messages=messages,
        max_tokens=100,
        temperature=0,
        top_p=1,
        top_k=1,
        repetition_penalty=0,
        stop=["<|eot_id|>"],
        stream=False
    )
    return response.choices[0].message.content.strip()


@app.route('/api/translate', methods=['POST'])
def handle_translate():
    data = request.json
    translation = together_function(data['text'], data['conlang'])
    print(translation)
    return jsonify({'translation': translation})

@app.route('/', methods=['GET', 'OPTIONS'])
def hello():
    ret, frame = cap.read()
            
    if tracker.analyze(frame):
        return jsonify(tracker.get_normalized_gaze_coordinates())
            
    return "error"

if __name__ == '__main__':
    app.run(debug=True)
cap = cv2.VideoCapture(0)
tracker = tester.GazeTracker()
