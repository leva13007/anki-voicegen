const { writeFile } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline');
const textToSpeech = require('@google-cloud/text-to-speech');
const {random} = require("gamekit-utils");

const VOCAB_DIR = './vocabs/';
if (!fs.existsSync(VOCAB_DIR)) fs.mkdirSync(VOCAB_DIR);

const INPUT = VOCAB_DIR + 'vocab.csv';
const OUTPUT = VOCAB_DIR + 'output.csv';
const AUDIO_DIR = './sounds/';

if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR);

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './keys/round-rain-464601-d4-861a23f6cccf.json',
});

const voices = [
  'en-GB-Chirp3-HD-Achernar',
  'en-GB-Chirp3-HD-Achird',
  'en-GB-Chirp3-HD-Algenib',
  'en-GB-Chirp3-HD-Algieba',
  'en-GB-Chirp3-HD-Alnilam',
  'en-GB-Chirp3-HD-Aoede',
  'en-GB-Chirp3-HD-Autonoe',
  'en-GB-Chirp3-HD-Callirrhoe',
  'en-GB-Chirp3-HD-Charon',
  'en-GB-Chirp3-HD-Despina',
  'en-GB-Chirp3-HD-Enceladus',
  'en-GB-Chirp3-HD-Erinome',
  'en-GB-Chirp3-HD-Fenrir',
  'en-GB-Chirp3-HD-Gacrux',
  'en-GB-Chirp3-HD-Iapetus',
  'en-GB-Chirp3-HD-Kore',
  'en-GB-Chirp3-HD-Laomedeia',
  'en-GB-Chirp3-HD-Leda',
  'en-GB-Chirp3-HD-Orus',
  'en-GB-Chirp3-HD-Puck',
  'en-GB-Chirp3-HD-Pulcherrima',
  'en-GB-Chirp3-HD-Rasalgethi',
  'en-GB-Chirp3-HD-Sadachbia',
  'en-GB-Chirp3-HD-Sadaltager',
  'en-GB-Chirp3-HD-Schedar',
  'en-GB-Chirp3-HD-Sulafat',
  'en-GB-Chirp3-HD-Umbriel',
  'en-GB-Chirp3-HD-Vindemiatrix',
  'en-GB-Chirp3-HD-Zephyr',
  'en-GB-Chirp3-HD-Zubenelgenubi',
]

const voice = { languageCode: 'en-gb', ssmlGender: 'NEUTRAL', name: 'en-GB-Chirp3-HD-Fenrir' }; // 'en-GB-Chirp3-HD-Fenrir' 'en-GB-Chirp3-HD-Achernar';

const getVoice = () => {
  const randomVoice = random(voices);
  return { languageCode: 'en-gb', ssmlGender: 'NEUTRAL', name: randomVoice };
}

async function synthesizeToFile(text, filename) {
  const request = {
    input: { text },
    voice: getVoice() || voice,
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  await fs.promises.writeFile(filename, response.audioContent, 'binary');
}

async function processVocab() {
  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT),
    crlfDelay: Infinity,
  });

  const out = fs.createWriteStream(OUTPUT, { flags: 'w' });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const [, text] = trimmed.split(';');
    const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 12);
    const filename = `rec_${hash}.mp3`;
    const filepath = path.join(AUDIO_DIR, filename);

    if (!fs.existsSync(filepath)) {
      console.log(`Generating: ${text} → ${filename}`);
      try {
        await synthesizeToFile(text, filepath);
        await new Promise(res => setTimeout(res, 500)); // ⏱ пауза 0.5с
      } catch (err) {
        console.error(`❌ Error generating audio for: ${text}`, err);
        continue;
      }
    } else {
      console.log(`✅ Already exists: ${filename}`);
    }

    out.write(`[sound:${filename}];${text};\n`);
  }

  out.close();
  console.log('🎉 Done. Output saved to', OUTPUT);
}

processVocab().catch(console.error);