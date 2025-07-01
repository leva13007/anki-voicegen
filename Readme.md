# anki-voicegen - English Vocabulary Anki Cards Generator

🎧 Generate Anki cards with audio using Google Cloud Text-to-Speech.

It creates "listen and type" style cards where you hear the word/phrase and need to type what you heard.

Feed a simple CSV file, get high-quality MP3s and ready-to-import Anki content.

Perfect for language learners who want to boost listening + writing skills.

## Features

- Google TTS (any voice, language)
- Auto-named MP3s with hash
- Output for fast Anki import
- Easy CLI-based workflow

## Project Structure

```
voice/
├── index.js           # Main application
├── package.json       # Dependencies
├── keys/             # Google Cloud service account key
├── vocabs/           # Input and output files
│   ├── vocab.csv     # Input vocabulary list
│   └── output.csv    # Generated Anki-ready CSV
└── sounds/           # Generated MP3 audio files
```

## Prerequisites

1. **Node.js** (version 18 or higher)
2. **Google Cloud Account** with Text-to-Speech API enabled
3. **Anki** desktop application

## Installation

### 1. Clone and Setup

```bash
git clone https://github.com/leva13007/anki-voicegen.git
cd voice
npm install
# or if using yarn:
yarn install
```

### 2. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Cloud Text-to-Speech API**
4. Create a service account:
   - Go to IAM & Admin → Service Accounts
   - Click "Create Service Account"
   - Give it a name (e.g., "text-to-speech-service")
   - Grant it the "Cloud Text-to-Speech User" role
5. Generate and download the JSON key file
6. Place the key file in the `keys/` directory
7. Update the `keyFilename` path in `index.js` if needed

### 3. Prepare Your Vocabulary

Create a file `vocabs/vocab.csv` with your vocabulary words:

```csv
[native lang];Hello, how are you today?
[native lang];Beautiful sunset over the mountains
[native lang];I would like to order a coffee
[native lang];The weather is quite unpredictable
[native lang];Learning English is challenging but rewarding
```

**Format**: Each line should start with `;` followed by the text you want to convert to speech.

## Usage

### 1. Run the Generator

```bash
node index.js
```

The script will:
- Read vocabulary from `vocabs/vocab.csv`
- Generate MP3 audio files in `sounds/` directory
- Create `vocabs/output.csv` for Anki import

### 2. Import to Anki

1. Open Anki
2. Click **File** → **Import**
3. Select `vocabs/output.csv`
4. Configure import settings:
   - **Type**: Basic
   - **Deck**: Choose your target deck
   - **Fields separated by**: Semicolon
   - **Allow HTML in fields**: ✅ Checked
5. Click **Import**

### 3. Setup Card Templates

In Anki, edit your note type to create listen-and-type cards:

**Front Template:**
```html
<div style="text-align: center; font-size: 18px;">
  🎧 Listen and type what you hear:
</div>
<br>
{{Front}}

{{type:Back}}
```

**Back Template:**
```html
{{Front}}

<hr id=answer>

{{type:Back}}
```

## Configuration

You can customize the voice settings in `index.js`:

```javascript
const voice = { 
  languageCode: 'en-gb',           // Language (en-US, en-GB, etc.)
  ssmlGender: 'NEUTRAL',           // MALE, FEMALE, NEUTRAL
  name: 'en-GB-Chirp3-HD-Achernar' // Specific voice name
};
```

Available voices:
- `en-GB-Chirp3-HD-Achernar` (British, Natural)
- `en-US-Chirp3-HD-Lyra` (American, Natural)
- `en-AU-Chirp3-HD-Auriga` (Australian, Natural)

## File Naming

Audio files are named using MD5 hash of the text content:
- Format: `rec_{12-char-hash}.mp3`
- Example: `rec_a1b2c3d4e5f6.mp3`

This ensures:
- No duplicate files for identical text
- Safe filenames for all operating systems
- Easy identification and caching

## Troubleshooting

### Authentication Errors
```bash
Error: Could not load the default credentials
```
**Solution**: Check that your Google Cloud key file path is correct in `index.js`

### Permission Errors
```bash
EACCES: permission denied
```
**Solution**: Ensure the `sounds/` and `vocabs/` directories are writable

### Missing Audio in Anki
**Solution**: 
1. Make sure audio files are in Anki's media folder
2. Copy files from `sounds/` to `~/Library/Application Support/Anki2/[profile]/collection.media/` (macOS)

```bash
cp sounds/*.mp3 ~/Library/Application\ Support/Anki2/[profile]/collection.media/
```

my case:
```bash
cp sounds/*.mp3 ~/Library/Application\ Support/Anki2/User\ 1/collection.media
```

### Rate Limiting
The script includes a 500ms delay between API calls to respect Google's rate limits. For large vocabularies, consider:
- Splitting into smaller batches
- Using different voice models
- Upgrading your Google Cloud quota

## Cost Estimation

Google Cloud Text-to-Speech pricing (as of 2025):
- **WaveNet/Neural2 voices**: $16.00 per 1 million characters
- **Standard voices**: $4.00 per 1 million characters

Example: 1000 words (avg 15 characters each) = ~15,000 characters ≈ $0.24

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Google Cloud Text-to-Speech documentation
3. Open an issue in the repository

---

**Happy Learning! 🎓**
