
#!/bin/bash

# Set environment variables
export OPENAI_API_KEY=${OPENAI_API_KEY:-"your-openai-api-key-here"}

# Install dependencies
pip install -r requirements.txt

# Start the Gradio app
python app.py
