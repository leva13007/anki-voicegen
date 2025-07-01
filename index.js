// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const { writeFile } = require('node:fs/promises');

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './keys/round-rain-464601-d4-861a23f6cccf.json',
});

async function quickStart() {
    // The text to synthesize
    const text = `Hello, this is a test of the text-to-speech service.`;

    const ssml = `
    <speak>
        <say-as interpret-as="characters">can</say-as>
    </speak>
    `;

    // const input = {text};
    const input = {ssml};

    // const voice = { languageCode: 'en-gb', ssmlGender: 'NEUTRAL', name: 'en-GB-Chirp3-HD-Achernar' };
    const voice = {
            'languageCode': 'en-us',
            'name': 'en-US-Standard-B',
            'ssmlGender': 'MALE'
        };
    // Construct the request
    const request = {
        input,
        voice,
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.00, },
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Save the generated binary audio content to a local file
    await writeFile('./sounds/output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}

(async () => {
    await quickStart();
    // const res = await client.listVoices();
    // console.log('List of voices:', res[0].voices);
})();