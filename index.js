const { writeFile } = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const readline = require('node:readline');
const textToSpeech = require('@google-cloud/text-to-speech');

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

const voice = { languageCode: 'en-gb', ssmlGender: 'NEUTRAL', name: 'en-GB-Chirp3-HD-Achernar' };

async function synthesizeToFile(text, filename) {
  const request = {
    input: { text },
    voice,
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
        console.error(`❌ Error generating audio for: ${text}`);
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