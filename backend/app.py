from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import httpx
import base64
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageAnalysisRequest(BaseModel):
    image_url: Optional[str] = None
    prompt: str = "Describe this image"

LLAMA_API_URL = os.getenv("LLAMA_API_URL", "http://localhost:8000/v1/chat/completions")

@app.post("/api/analyze")
async def analyze_image(request: ImageAnalysisRequest):
    try:
        payload = {
            "model": "meta/llama-3.2-90b-vision-instruct",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": request.prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": request.image_url}
                    }
                ]
            }],
            "max_tokens": 256
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(LLAMA_API_URL, json=payload)
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    # In a real application, you would upload this to proper storage
    # For demo purposes, we'll save locally
    file_location = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)
    
    try:
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        return {
            "image_url": f"http://localhost:8000/uploads/{file.filename}"
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/image-analysis")
async def image_analysis(request: ImageAnalysisRequest):
    try:
        payload = {
            "model": "meta/llama-3.2-90b-vision-instruct",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": request.prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": request.image_url}
                    }
                ]
            }],
            "max_tokens": 256
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(LLAMA_API_URL, json=payload)
            response.raise_for_status()
            return response.json()
            
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
