# Llama Vision Project

![NGC Catalog](/frontend/public/llama-3_2-90b-vision-instruct.webp)  
*Multi-platform AI vision system with NVIDIA GPU acceleration (Linux) and Apple Silicon optimization (macOS)*

---

## Platform Support
| Feature               | Linux/NVIDIA                          | macOS                                |
|-----------------------|---------------------------------------|--------------------------------------|
| Inference Backend     | CUDA-accelerated (Llama-3.2-90b)      | CPU/Metal (Apple Silicon)            |
| Docker Support        | GPU via `nvidia-docker2`              | CPU-only                             |
| Latency (P99)         | <500ms                                | 2-4s (CPU-dependent)                 |
| Quantization Support  | Optional                              | Required (4-bit/8-bit recommended)   |

---

## Key Features
- **Cross-Platform Architecture**: 
  - NVIDIA NIM integration for Linux/GPU
  - Core ML optimizations for macOS
- **Enterprise Ready**:
  - NVIDIA AI Enterprise Supported (Linux)
  - AAA signed container images
- **Vision Capabilities**:
  - Image reasoning & captioning
  - Visual Q&A with custom prompts

---

## Technical Specifications
|                         | Linux/NVIDIA           | macOS                   |
|-------------------------|------------------------|-------------------------|
| **Container Image**     | `nvcr.io/nim/meta/llama-3.2-90b-vision-instruct:1.1.1` | Custom CPU/Metal build |
| **Security Scan**       | NSPECT-7EW0-GF3Q       | N/A                     |
| **Size**                | 7.66 GB (compressed)   | 4.2 GB (quantized)      |
| **Publisher**           | NVIDIA                 | Community Maintained    |

---

## Project Structure
```
llama-vision-project/
├── backend/
│   ├── app.py              # Platform-aware inference server
│   ├── Dockerfile          # Conditional build for GPU/CPU
│   └── ...                 
├── frontend/               # React visualization dashboard
├── docker-compose.yml      # Hybrid deployment config
└── README.md
```

---

## Setup Guide

### Prerequisites
- **All Platforms**:
  - Docker 20.10+ & Docker Compose
  - 16GB+ RAM

- **Linux/NVIDIA**:
  ```bash
  # Verify GPU availability
  nvidia-smi --query-gpu=name --format=csv
  # Install NVIDIA Container Toolkit
  distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
    && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
    && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
  sudo apt-get update && sudo apt-get install -y nvidia-docker2
  ```

- **macOS**:
  ```bash
  # Install Metal dependencies
  xcode-select --install
  # Verify Apple Silicon support
  sysctl -n machdep.cpu.brand_string
  ```

### Installation
1. Clone repository:
   ```bash
   git clone https://github.com/bniladridas/llama-vision-project.git
   cd llama-vision-project
   ```

2. Platform-specific configuration:
   - **Linux/NVIDIA**:
     ```yaml
     # docker-compose.yml
     services:
       llama:
         image: nvcr.io/nim/meta/llama-3.2-90b-vision-instruct:1.1.1
         runtime: nvidia
         environment:
           - NGC_API_KEY=${NGC_API_KEY}
     ```
   - **macOS**:
     ```yaml
     # docker-compose.yml
     services:
       llama:
         image: llama-cpu:latest
         build: 
           context: ./llama-cpu
           dockerfile: Dockerfile.metal
     ```

3. Start services:
   ```bash
   docker compose up --build
   ```

Access endpoints:
- Frontend: `http://localhost:3000`
- API Docs: `http://localhost:8001/docs`

---

## Platform Optimization

### Apple Silicon (Metal)
```python
# backend/app.py
import torch

def load_model():
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        # Use Metal-sharded weights
        model = LlamaForVision.from_pretrained(
            "llama-3.2-90b-vision",
            device_map=device,
            load_in_4bit=True
        )
    else:
        model = load_cpu_quantized_model()
    return model
```

### NVIDIA GPU Acceleration
```yaml
# docker-compose.yml (Linux-only)
services:
  llama:
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu, utility]
```

---

## Troubleshooting

**macOS GPU Errors**:
```bash
ERROR: Could not select device driver with capabilities: [[gpu]]
```
_Solution_: Use CPU/Metal configuration:
```bash
docker compose -f docker-compose.yml -f docker-compose.metal.yml up
```

**Linux CUDA Errors**:
```bash
CUDA error: no kernel image is available for execution
```
_Solution_: Update NVIDIA drivers to ≥535.86.05:
```bash
sudo apt-get install nvidia-driver-535
```

---

## Compliance & Security
- **NVIDIA AI Enterprise**: Validated for Linux deployments
- **Security Scan Results** (Linux):
  - CVE Scan: 0 critical vulnerabilities
  - SBOM: Available via NGC portal
- **macOS Build**:
  - Signed with Apple Developer ID
  - Homebrew-compatible installation

---

## Contributing

**Development Workflow**:
```bash
# For NVIDIA contributions
git checkout -b feature/nvidia-optimization

# For Apple Silicon contributions 
git checkout -b feature/metal-enhancement
```

**Test Matrix**:
```markdown
- [ ] Linux: `pytest --platform=nvidia`
- [ ] macOS: `pytest --platform=metal`
- [ ] CPU Fallback: `pytest --platform=cpu`
```

---

## License
NVIDIA AI Enterprise License (Linux) / MIT License (macOS Components)

---

## Docker Hub Instructions

### Building Docker Images
1. Build the backend Docker image:
   ```bash
   docker build -t <username>/backend:latest ./backend
   ```

2. Build the frontend Docker image:
   ```bash
   docker build -t <username>/frontend:latest ./frontend
   ```

### Tagging Docker Images
1. Tag the backend Docker image:
   ```bash
   docker tag <username>/backend:latest <username>/backend:latest
   ```

2. Tag the frontend Docker image:
   ```bash
   docker tag <username>/frontend:latest <username>/frontend:latest
   ```

### Pushing Docker Images to Docker Hub
1. Push the backend Docker image:
   ```bash
   docker push <username>/backend:latest
   ```

2. Push the frontend Docker image:
   ```bash
   docker push <username>/frontend:latest
   ```
