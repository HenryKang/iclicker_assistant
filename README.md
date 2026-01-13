# iClicker Assistant

AI-powered Chrome extension that helps with iClicker attendance questions.

## ⚠️ Disclaimer
This extension is for educational purposes and attendance-based questions only. Not for graded assessments.

## 🏗️ Architecture
- **Extension:** Runs in Chrome, detects questions
- **Server:** Local Node.js server, keeps API keys secure
- **AI:** Uses OpenAI or Anthropic APIs

## 📁 Project Structure
```
iclicker-assistant/
  ├── extension/     # Chrome extension files
  │   ├── manifest.json
  │   ├── content.js
  │   ├── background.js
  │   ├── popup.html
  │   └── popup.js
  └── server/        # Local Node.js server
      ├── server.js
      ├── package.json
      └── .env (not included - create your own!)
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js installed
- Chrome browser
- OpenAI or Anthropic API key

### Server Setup
1. Navigate to server folder:
```bash
   cd server
```

2. Install dependencies:
```bash
   npm install
```

3. Create `.env` file with your API key:
```
   OPENAI_API_KEY=your_key_here
   # OR
   ANTHROPIC_API_KEY=your_key_here
```

4. Start the server:
```bash
   node server.js
```

### Extension Setup
1. Open Chrome and go to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Click the extension icon and configure settings

## 🔒 Security
- API keys are stored locally in `.env` file (never committed to Git)
- Extension communicates with local server only
- No API keys are exposed in the extension code

## 📚 Technologies Used
- **Frontend:** JavaScript, Chrome Extension APIs, HTML/CSS
- **Backend:** Node.js, Express.js
- **AI:** OpenAI API, Anthropic API
- **Security:** dotenv, CORS

## 🎓 Learning Objectives
This project demonstrates:
- Chrome extension development
- Client-server architecture
- REST API design
- Secure API key management
- Async JavaScript
- DOM manipulation
- AI API integration

## 📄 License
MIT License - feel free to use for educational purposes