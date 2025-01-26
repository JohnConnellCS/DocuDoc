from huggingface_hub import InferenceClient
from flask import Flask, request, jsonify
from pydub import AudioSegment
from dotenv import load_dotenv
import io
import os

app = Flask(__name__)

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
    client = InferenceClient(token = permissionToEnter)
    full_text = ""
    for aud in userInputs:
        cur_text = ""
        for i in range(5):
            try:
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

@app.route('/', methods=['POST'])
def process():
    if 'audio' in request.files:
        print("got audio")
        audio_file = request.files['audio']
    else:
        return jsonify({'error': 'No audio file provided.'}), 400
    total = getText(audio_file)
    data = [{'text': total, 'summary': 'whatisup'}]
    return jsonify(data), 200


if __name__ == '__main__':
    app.run(debug = True)

