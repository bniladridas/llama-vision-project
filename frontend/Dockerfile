FROM node:14-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Set environment variable for image analysis API URL
ENV REACT_APP_IMAGE_ANALYSIS_API_URL=http://localhost:8002

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
