# Ollama Express API - Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- Ollama already deployed and accessible
- Git (for deployment)

## Deployment Options

### Option 1: Deploy to VPS/Server

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ollama-api
   ```

2. **Install dependencies:**
   ```bash
   npm install --production
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file:
   ```env
   PORT=3001
   NODE_ENV=production
   API_KEY=your-secret-api-key-here
   OLLAMA_BASE_URL=http://your-ollama-server:11434
   OLLAMA_DEFAULT_MODEL=deepseek-r1
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Set up PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ollama-api"
   pm2 save
   pm2 startup
   ```

### Option 2: Deploy with Docker

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     ollama-api:
       build: .
       ports:
         - "3001:3001"
       environment:
         - NODE_ENV=production
         - API_KEY=${API_KEY}
         - OLLAMA_BASE_URL=${OLLAMA_BASE_URL}
         - OLLAMA_DEFAULT_MODEL=${OLLAMA_DEFAULT_MODEL}
       restart: unless-stopped
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

### Option 3: Deploy to Railway

1. **Connect your repository to Railway**
2. **Set environment variables in Railway dashboard:**
   - `NODE_ENV=production`
   - `API_KEY=your-secret-api-key`
   - `OLLAMA_BASE_URL=your-ollama-url`
   - `OLLAMA_DEFAULT_MODEL=deepseek-r1`
3. **Deploy automatically on push**

### Option 4: Deploy to Render

1. **Connect your repository to Render**
2. **Create a new Web Service**
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Set all required env vars
4. **Deploy**

### Option 5: Deploy to Heroku

1. **Install Heroku CLI and login**
2. **Create Heroku app:**
   ```bash
   heroku create your-ollama-api
   ```

3. **Set environment variables:**
   ```bash
      NODE_ENV=production
      API_KEY=your-secret-api-key
      OLLAMA_BASE_URL=your-ollama-url
      OLLAMA_DEFAULT_MODEL=deepseek-r1
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | Yes | Set to `production` |
| `API_KEY` | Yes | Your secret API key |
| `OLLAMA_BASE_URL` | Yes | URL of your deployed Ollama instance |
| `OLLAMA_DEFAULT_MODEL` | No | Default model name |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window (default: 900000) |
| `RATE_LIMIT_MAX_REQUESTS` | No | Max requests per window (default: 100) |

## Post-Deployment

1. **Test the health endpoint:**
   ```bash
   curl https://your-domain.com/health
   ```

2. **Test with API key:**
   ```bash
   curl -X POST https://your-domain.com/api/chat \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-secret-api-key" \
     -d '{
       "model": "deepseek-r1",
       "messages": [{ "role": "user", "content": "Hello" }],
       "stream": false
     }'
   ```

3. **Set up monitoring (optional):**
   - Use PM2 monitoring: `pm2 monit`
   - Set up log rotation
   - Configure alerts for downtime

## Security Considerations

- Use HTTPS in production
- Rotate API keys regularly
- Set up firewall rules
- Monitor rate limits
- Use environment variables for secrets
- Consider using a reverse proxy (nginx) 