from sentence_transformers import SentenceTransformer, util
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

def handler(req):
    body = req.json()
    query = body.get("query", "")
    corpus = body.get("corpus", [])
    
    q_embed = model.encode(query, convert_to_tensor=True)
    c_embeds = model.encode(corpus, convert_to_tensor=True)
    
    scores = util.cos_sim(q_embed, c_embeds)[0]
    results = sorted(
        [{"text": text, "score": float(score)} for text, score in zip(corpus, scores)],
        key=lambda x: -x["score"]
    )
    
    return {
        "statusCode": 200,
        "body": json.dumps({"matches": results})
    }
