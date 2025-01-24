import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

function App() {
  const [imageUrl, setImageUrl] = useState('');
  const [prompt, setPrompt] = useState('Describe this image');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8001/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.image_url) {
        setImageUrl(data.image_url);
        setError('');
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!imageUrl) {
      setError('Please upload an image first');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl,
          prompt,
        }),
      });
      const data = await response.json();
      setResult(data.choices?.[0]?.message?.content || 'No result returned');
      setError('');
    } catch (err) {
      setError('Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Image Analysis with Llama Vision</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Upload Image</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </label>
            </div>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Uploaded preview" 
                className="mt-2 max-h-64 object-contain rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border rounded-md p-2"
            />
          </div>

          <button 
            onClick={analyzeImage} 
            disabled={loading || !imageUrl}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </span>
            ) : (
              'Analyze Image'
            )}
          </button>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {result && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Analysis Result:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;