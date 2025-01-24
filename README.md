# Llama Vision Project

The Llama Vision Project is designed to analyze images using a backend service powered by FastAPI and a frontend built with React. The backend handles image uploads and analysis requests, while the frontend provides a user interface for uploading images and displaying analysis results. The project uses Docker Compose to manage the services and dependencies.

## Project Structure

```
llama-vision-project/
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── uploads/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── docker-compose.yml
└── README.md
```

## Setup

### Prerequisites

- Docker
- Docker Compose

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/bniladridas/llama-vision-project.git
   cd llama-vision-project
   ```

2. Build and start the services:

   ```sh
   docker compose up --build
   ```

3. Access the frontend application at `http://localhost:3000`.

## Usage

1. Open the frontend application in your browser.
2. Upload an image using the "Choose Image" button.
3. Enter a prompt to describe the image.
4. Click the "Analyze Image" button to analyze the image.
5. View the analysis result displayed on the page.

## Current State

The project is set up to analyze images using a pre-trained model. The backend service handles image uploads and analysis requests, while the frontend provides a user interface for uploading images and displaying analysis results. The project is containerized using Docker and managed with Docker Compose.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.