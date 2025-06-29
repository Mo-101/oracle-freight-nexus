
# DeepCAL++ Gradio Oracle Service

This is the Python backend service that provides ML-powered Oracle capabilities for DeepCAL++.

## Features

- **Neutrosophic TOPSIS Engine**: Advanced multi-criteria decision analysis
- **OpenAI TTS Integration**: AI-powered voice synthesis with 11 voices
- **Interactive ML Interface**: Real-time parameter adjustment and calculation
- **Quantum Oracle Personalities**: Mystical, Humorous, and Corporate voice modes

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set OpenAI API Key:**
   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```

3. **Run the service:**
   ```bash
   python app.py
   ```

4. **Access the interface:**
   - Local: http://localhost:7860
   - With sharing: Check terminal for public URL

## Deployment Options

### Local Development
- Run `python app.py` for local testing
- The service will be available at http://localhost:7860

### Hugging Face Spaces
- Push this directory as a new Space
- Set `OPENAI_API_KEY` in Space secrets
- Automatic deployment with public URL

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["python", "app.py"]
```

## Integration with React Frontend

The React frontend can embed this service via:
1. **iframe embedding** (current implementation)
2. **API calls** via Supabase Edge Functions
3. **Direct fetch** for development

## Voice Personalities

- **Mystical Oracle** (sage voice): Ancient wisdom and mystical pronouncements  
- **Humorous Logistics** (nova voice): Witty and casual commentary
- **Corporate Professional** (onyx voice): Business-focused and formal delivery

## API Endpoints

When running, the Gradio interface provides a web UI, but you can also call it programmatically using the Gradio client libraries.
