
import gradio as gr
import requests
import numpy as np
import pandas as pd
import os
import hashlib
from datetime import datetime
import urllib.parse
import tempfile

# Advanced TTS Service Configuration
TTS_URL_TEMPLATE = os.getenv("TTS_API_URL_TEMPLATE")
NSFW_URL_TEMPLATE = os.getenv("NSFW_API_URL_TEMPLATE")

if not TTS_URL_TEMPLATE:
    print("Warning: TTS_API_URL_TEMPLATE not set. Voice features will be limited.")
if not NSFW_URL_TEMPLATE:
    print("Warning: NSFW_API_URL_TEMPLATE not set. Content filtering disabled.")

class NeutrosophicEngine:
    def __init__(self):
        pass
    
    def calculate_topsis(self, forwarders_data, weights):
        """
        Calculate TOPSIS scores for forwarders using neutrosophic logic
        """
        if not forwarders_data:
            return []
        
        # Convert to numpy array for calculations
        matrix = []
        names = []
        
        for forwarder in forwarders_data:
            matrix.append([
                forwarder['cost'],
                forwarder['time'], 
                forwarder['reliability'],
                forwarder['risk']
            ])
            names.append(forwarder['name'])
        
        matrix = np.array(matrix)
        
        # Normalize matrix
        norm_matrix = matrix / np.sqrt(np.sum(matrix**2, axis=0))
        
        # Apply weights
        weight_array = [weights['cost'], weights['time'], weights['reliability'], weights['risk']]
        weighted_matrix = norm_matrix * weight_array
        
        # Find ideal and anti-ideal solutions
        ideal = np.array([
            np.min(weighted_matrix[:, 0]),  # cost - minimize
            np.min(weighted_matrix[:, 1]),  # time - minimize  
            np.max(weighted_matrix[:, 2]),  # reliability - maximize
            np.min(weighted_matrix[:, 3])   # risk - minimize
        ])
        
        anti_ideal = np.array([
            np.max(weighted_matrix[:, 0]),
            np.max(weighted_matrix[:, 1]),
            np.min(weighted_matrix[:, 2]),
            np.max(weighted_matrix[:, 3])
        ])
        
        # Calculate distances and TOPSIS scores
        results = []
        for i, name in enumerate(names):
            dist_ideal = np.linalg.norm(weighted_matrix[i] - ideal)
            dist_anti_ideal = np.linalg.norm(weighted_matrix[i] - anti_ideal)
            
            topsis_score = dist_anti_ideal / (dist_ideal + dist_anti_ideal)
            
            # Neutrosophic components
            truth = min(forwarders_data[i]['reliability'] / 100, topsis_score)
            falsity = max(forwarders_data[i]['risk'] / 100, 1 - topsis_score)
            indeterminacy = abs(truth - falsity) * 0.1
            crisp_score = truth - falsity
            
            # Generate hash
            data_string = f"{name}-{topsis_score}-{datetime.now().isoformat()}"
            hash_value = hashlib.sha256(data_string.encode()).hexdigest()[:16]
            
            results.append({
                'name': name,
                'topsis_score': topsis_score,
                'neutrosophic': {
                    'truth': truth,
                    'indeterminacy': indeterminacy,
                    'falsity': falsity,
                    'crisp_score': crisp_score
                },
                'hash': hash_value
            })
        
        # Sort by TOPSIS score
        results.sort(key=lambda x: x['topsis_score'], reverse=True)
        for i, result in enumerate(results):
            result['rank'] = i + 1
            
        return results

def generate_advanced_tts(text, voice="ballad", emotion="mystical and wise"):
    """Generate TTS using the advanced TTS service"""
    if not TTS_URL_TEMPLATE:
        return None
    
    try:
        encoded_prompt = urllib.parse.quote(text)
        encoded_emotion = urllib.parse.quote(emotion)
        
        url = TTS_URL_TEMPLATE.format(
            prompt=encoded_prompt,
            emotion=encoded_emotion,
            voice=voice,
            seed=12345
        )
        
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        content_type = response.headers.get('content-type', '').lower()
        if 'audio' not in content_type:
            print(f"Warning: Unexpected content type: {content_type}")
            return None
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_file:
            temp_file.write(response.content)
            return temp_file.name
            
    except Exception as e:
        print(f"Advanced TTS Error: {e}")
        return None

def oracle_decision_engine(
    cost1, time1, rel1, risk1, name1,
    cost2, time2, rel2, risk2, name2, 
    cost3, time3, rel3, risk3, name3,
    weight_cost, weight_time, weight_rel, weight_risk,
    oracle_text, voice_mode, emergency_context
):
    """Main Oracle decision function with advanced TTS"""
    
    # Prepare forwarder data
    forwarders = [
        {'name': name1, 'cost': cost1, 'time': time1, 'reliability': rel1, 'risk': risk1},
        {'name': name2, 'cost': cost2, 'time': time2, 'reliability': rel2, 'risk': risk2},
        {'name': name3, 'cost': cost3, 'time': time3, 'reliability': rel3, 'risk': risk3}
    ]
    
    weights = {
        'cost': weight_cost,
        'time': weight_time, 
        'reliability': weight_rel,
        'risk': weight_risk
    }
    
    # Calculate TOPSIS
    engine = NeutrosophicEngine()
    results = engine.calculate_topsis(forwarders, weights)
    
    if not results:
        return "No results calculated", None, "Error in calculation"
    
    # Get top result
    winner = results[0]
    
    # Emotion mapping for different voice modes
    emotion_map = {
        "Mystical Oracle": "mystical, ancient wisdom with reverent tone",
        "Humorous Logistics": "witty, sarcastic and playful", 
        "Corporate Professional": "professional, authoritative and confident"
    }
    emotion = emotion_map.get(voice_mode, "mystical and wise")
    
    # Generate oracle verdict
    verdict = f"""🔮 DEEPCAL++ ORACLE TRANSMISSION vΩ

Emergency Context: {emergency_context}

NEUTROSOPHIC DECISION MATRIX COMPLETE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🥇 CHOSEN VESSEL: {winner['name']}
TOPSIS Score: {winner['topsis_score']:.3f}
Truth Level: {winner['neutrosophic']['truth']*100:.1f}%
Indeterminacy: {winner['neutrosophic']['indeterminacy']*100:.1f}%
Falsity Risk: {winner['neutrosophic']['falsity']*100:.1f}%

CEREMONIAL HASH: {winner['hash']}

The Oracle has spoken through quantum algorithms.
{oracle_text}
"""

    # Generate detailed ranking
    ranking_text = "🏆 COMPLETE RANKING:\n\n"
    for result in results:
        medal = ["🥇", "🥈", "🥉"][result['rank']-1] if result['rank'] <= 3 else "🔹"
        ranking_text += f"{medal} #{result['rank']} {result['name']} - Score: {result['topsis_score']:.3f}\n"
    
    # Generate TTS with ballad voice
    tts_text = f"""Behold, the quantum freight matrix has rendered its judgment. 
    In this hour of {emergency_context}, I declare {winner['name']} as the chosen vessel, 
    with a TOPSIS score of {winner['topsis_score']:.3f}. 
    The neutrosophic truth reveals {winner['neutrosophic']['truth']*100:.0f} percent certainty. 
    {oracle_text} May this decision guide your logistics destiny."""
    
    audio_file = generate_advanced_tts(tts_text, voice="ballad", emotion=emotion)
    
    return verdict, audio_file, ranking_text

# Create Gradio Interface
with gr.Blocks(title="🔮 DeepCAL++ Quantum Oracle", theme=gr.themes.Dark()) as demo:
    gr.Markdown("# 🔮 DeepCAL++ Quantum Oracle vΩ")
    gr.Markdown("*Neutrosophic TOPSIS Decision Engine with Advanced Ballad Voice*")
    
    with gr.Row():
        with gr.Column():
            gr.Markdown("## 📊 Forwarder Data Input")
            
            with gr.Group():
                gr.Markdown("### Forwarder 1")
                name1 = gr.Textbox("Kuehne + Nagel", label="Name")
                cost1 = gr.Number(4.61, label="Cost per kg ($)")
                time1 = gr.Number(5.2, label="Transit Days") 
                rel1 = gr.Number(92, label="Reliability (%)")
                risk1 = gr.Number(8, label="Risk Level (%)")
            
            with gr.Group():
                gr.Markdown("### Forwarder 2") 
                name2 = gr.Textbox("DHL Express", label="Name")
                cost2 = gr.Number(5.21, label="Cost per kg ($)")
                time2 = gr.Number(6.0, label="Transit Days")
                rel2 = gr.Number(88, label="Reliability (%)")
                risk2 = gr.Number(15, label="Risk Level (%)")
                
            with gr.Group():
                gr.Markdown("### Forwarder 3")
                name3 = gr.Textbox("Siginon Logistics", label="Name") 
                cost3 = gr.Number(4.45, label="Cost per kg ($)")
                time3 = gr.Number(6.5, label="Transit Days")
                rel3 = gr.Number(85, label="Reliability (%)")
                risk3 = gr.Number(22, label="Risk Level (%)")
        
        with gr.Column():
            gr.Markdown("## ⚖️ Decision Weights")
            weight_cost = gr.Slider(0, 1, value=0.3, label="Cost Weight")
            weight_time = gr.Slider(0, 1, value=0.2, label="Time Weight") 
            weight_rel = gr.Slider(0, 1, value=0.35, label="Reliability Weight")
            weight_risk = gr.Slider(0, 1, value=0.15, label="Risk Weight")
            
            gr.Markdown("## 🎭 Oracle Configuration")
            oracle_text = gr.Textbox("Guide us through this logistical challenge, O wise Oracle!", 
                                   label="Oracle Invocation", lines=3)
            voice_mode = gr.Dropdown(["Mystical Oracle", "Humorous Logistics", "Corporate Professional"],  
                                   value="Mystical Oracle", label="Voice Personality")
            emergency_context = gr.Textbox("Medical supply emergency - cholera outbreak", 
                                         label="Emergency Context")
            
            calculate_btn = gr.Button("🔮 INVOKE ORACLE", variant="primary", size="lg")
    
    with gr.Row():
        with gr.Column():
            verdict_output = gr.Textbox(label="🕊️ Oracle Transmission", lines=15)
            ranking_output = gr.Textbox(label="📊 Complete Rankings", lines=8)
        
        with gr.Column():
            audio_output = gr.Audio(label="🎙️ Oracle Voice (Ballad)", type="filepath")
    
    calculate_btn.click(
        fn=oracle_decision_engine,
        inputs=[
            cost1, time1, rel1, risk1, name1,
            cost2, time2, rel2, risk2, name2,
            cost3, time3, rel3, risk3, name3,
            weight_cost, weight_time, weight_rel, weight_risk,
            oracle_text, voice_mode, emergency_context
        ],
        outputs=[verdict_output, audio_output, ranking_output]
    )

if __name__ == "__main__":
    demo.launch(share=True, server_name="0.0.0.0", server_port=7860)
