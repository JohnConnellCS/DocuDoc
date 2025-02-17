## Winner: IrvineHacks 2025: Patient Safety Track Winner

## Inspiration

**125,000 people die every year due to medical noncoherence** (according to the AAMC).  While some of those deaths can be attributed to intentional misbehavior, many more are caused by gaps in communication and understanding between patient and healthcare provider. Many patients are rushed in and out the door, bombarded with medical jargon and post-visit instructions nearly impossible to fully understand. These problems are exacerbated for many that do not speak English as a first language or have lower levels of education. Our solution is DocuDoc, a summary and transcription tool meant to bridge the gap between doctor's orders and what actually happens after a visit.

## What it does

DocuDoc listens in on a conversation between a doctor and a patient. After the appointment ends, the tool creates a summary of the visit, highlighting next steps for the patient and providing a full text-transcription for reference.

## How we built it

This product is made primarily with react-native and firebase. We utilized expo-av to record audios from the microphone, then used Assembly AI API to convert the audio files to text transcriptions. These text transcriptions were then fed into the distilBart-Med-Summary model from Hugging Face(see challenges) to create summaries and recommendations. **This model was trained on thousands doctor-patient interactions**, maximizing its efficacy for our use case.

## Accomplishments that we're proud of

*Fully integrating speech-to-text transcriptions

*Plugging those transcriptions into model trained on doctor-patient interactions

*Using the output of the model to provide effective summaries for patients

## What's next for DocuDoc
After locating a better model for after-visit instructions, we would like to further accessibility features such as language translation for those who do not speak English as a first language. 


https://devpost.com/software/docudoc
