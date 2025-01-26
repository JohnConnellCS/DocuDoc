from huggingface_hub import InferenceClient
from flask import Flask, request, jsonify
from pydub import AudioSegment
from dotenv import load_dotenv
import assemblyai as aai
from flask_cors import CORS
import io
import os
from transformers import pipeline

app = Flask(__name__)
summarizer_model = pipeline("summarization", model="Mahalingam/DistilBart-Med-Summary")
CORS(app)

def parseAudio(fromFront):
    audio = AudioSegment.from_wav(fromFront)
    chunksize = 30000 

    num_clips = len(audio) // chunksize

    clips = []

    for i in range(num_clips + 1):
        start = i * chunksize
        end = (i + 1) * chunksize
        if end > len(audio):
            end = len(audio)
        clip = audio[start:end]
        buffer = io.BytesIO()
        clip.export(buffer, format = 'wav')
        buffer.seek(0)
        clips.append(buffer)
    return clips


def getText(userInput):
    userInputs = parseAudio(userInput)
    print("audioParsed")
    load_dotenv('../.env')
    permissionToEnter = os.getenv("HUGGING_FACE")
    full_text = ""
    for aud in userInputs:
        cur_text = ""
        for i in range(5):
            try:
                client = InferenceClient(token = permissionToEnter)
                result = client.automatic_speech_recognition(audio = aud)
                cur_text = result.get('text', "") + " "
                break
            except Exception as e:
                #just do anything
                print(e)
                if i == 4:
                    return "error"
                continue
        full_text += cur_text + " "
    if not full_text.strip():
            return "No transcription available."
    return full_text.strip()

def fastToText(audio):
    load_dotenv('../.env')
    permissionToEnter = os.getenv("ASSEMBLY_AI")
    aai.settings.api_key = permissionToEnter
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(audio)
    if transcript.status == aai.TranscriptStatus.error:
        print(f"Transcription failed: {transcript.error}")
        return "error"
    return transcript.text

def summarizer(text):
    text_length = len(text.split())
    max_length = 150
    min_length = 0
    summary = summarizer_model(text,  max_length = max_length, min_length = min_length)
    summary_text = summary[0]['summary_text']
    clean_summary = summary_text.replace("\"", "").strip()
    return clean_summary

def summarize_care(text):
    text_length = len(text.split())
    max_length = 150
    min_length = 0
    prompt = "Summarize only the medical care instructions: "
    text_to_summarize = prompt + text
    summary = summarizer_model(text_to_summarize,  max_length = max_length, min_length = min_length)
    summary_text = summary[0]['summary_text']
    clean_summary = summary_text.replace("\"", "").strip()
    return clean_summary


@app.route('/', methods=['POST'])
def process():
    if 'audio' in request.files:
        print("got audio")
        audio_file = request.files['audio']
    else:
        return jsonify({'error': 'No audio file provided.'}), 400
    #total = getText(audio_file)
    total = fastToText(audio_file)
    summary = summarizer(total)
    instruct = summarize_care(total)
    data = [{'text': total, 'summary': summary, 'instructions': instruct}]
    return jsonify(data), 200

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello World!"}), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5001, debug = True)

