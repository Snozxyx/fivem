# GGMP Services Setup Guide

Complete guide to setting up and running GGMP local services.

## Quick Start

### Prerequisites

- Node.js 14+ ([Download](https://nodejs.org/))
- npm or yarn
- Git

### Installation

```bash
# 1. Navigate to GGMP services directory
cd server/ggmp-services

# 2. Install dependencies for all services
npm install

# 3. Install admin panel dependencies
cd admin-panel
npm install
cd ..

# 4. Copy environment configuration
cp .env.example .env

# 5. Edit .env if needed (optional)
nano .env
```

### Starting Services

#### Option 1: Start All Services Together

```bash
cd server/ggmp-services
npm start
```

This starts:
- Keymaster Service (Port 3001)
- Policy Service (Port 3002)
- Nucleus Service (Port 3003)

Then in a separate terminal:
```bash
cd server/ggmp-services/admin-panel
npm start
```

This starts:
- Admin Panel (Port 3000)

#### Option 2: Start Services Individually

```bash
# Terminal 1 - Keymaster
npm run start:keymaster

# Terminal 2 - Policy
npm run start:policy

# Terminal 3 - Nucleus
npm run start:nucleus

# Terminal 4 - Admin Panel
npm run start:admin
```

## Accessing the Admin Panel

1. Open your browser
2. Navigate to: http://localhost:3000
3. Login with default credentials:
   - **Username**: admin
   - **Password**: admin

⚠️ **Important**: Change the default password in production!

## Admin Panel Features

### 1. Dashboard
- View service status (Keymaster, Policy, Nucleus)
- See total servers, active keys, and player counts
- Monitor system uptime
- Quick action buttons

### 2. Token Management
- Generate new GGMP license keys
- View all registered tokens
- See usage statistics per token
- Revoke tokens when needed
- Export token list

### 3. Server List
- View all registered servers
- See real-time player counts
- Monitor server status
- Check last seen timestamps
- Server details and IDs

### 4. Settings
- Configure maximum players
- Set streaming memory limits
- Enable/disable offline mode
- Toggle keymaster requirement
- Auto-refresh settings
- Interface preferences

## API Usage

### Keymaster API

**Validate a key:**
```bash
curl -X POST http://localhost:3001/api/validate \
  -H "Content-Type: application/json" \
  -d '{"key": "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX", "serverEndpoint": "server.example.com"}'
```

**Register a new key:**
```bash
curl -X POST http://localhost:3001/api/register-key \
  -H "Content-Type: application/json" \
  -d '{"key": "GGMP-1234-5678-90AB-CDEF-1234", "serverName": "My Server", "maxPlayers": 2048}'
```

**List all keys:**
```bash
curl http://localhost:3001/api/keys
```

**Revoke a key:**
```bash
curl -X DELETE http://localhost:3001/api/keys/GGMP-1234-5678-90AB-CDEF-1234
```

### Policy API

**Get policy configuration:**
```bash
curl http://localhost:3002/
curl http://localhost:3002/api/policy
```

**Get pool size limits:**
```bash
curl http://localhost:3002/pool-size-limits/fivem
```

### Nucleus API

**Register a server:**
```bash
curl -X POST http://localhost:3003/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "My GGMP Server", "maxPlayers": 256}'
```

**List registered servers:**
```bash
curl http://localhost:3003/api/servers
```

## Configuring GGMP Client/Server

### Client Configuration

The GGMP client is pre-configured to use local services. If you need to change endpoints:

1. Set environment variables:
```bash
export GGMP_KEYMASTER_URL=http://localhost:3001
export GGMP_POLICY_URL=http://localhost:3002
export GGMP_NUCLEUS_URL=http://localhost:3003
```

2. Or modify `code/components/net/include/GGMPConfig.h`:
```cpp
#define GGMP_KEYMASTER_URL "http://your-server:3001"
#define GGMP_POLICY_URL "http://your-server:3002"
#define GGMP_NUCLEUS_URL "http://your-server:3003"
```

### Server Configuration (server.cfg)

```cfg
# GGMP Service URLs
set ggmp_keymaster_url "http://localhost:3001"
set ggmp_policy_url "http://localhost:3002"
set ggmp_nucleus_url "http://localhost:3003"

# GGMP License Key (generate from admin panel)
set sv_customLicenseKey "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX"

# Server settings
sv_hostname "GGMP Server - 2048 Players"
sv_maxclients 256

# OneSync (required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1
```

## Troubleshooting

### Services won't start

**Issue**: Port already in use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution**: Kill the process using the port or change the port in `.env`
```bash
# Linux/Mac
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Issue**: Dependencies not installed
```
Error: Cannot find module 'express'
```

**Solution**: Install dependencies
```bash
npm install
cd admin-panel && npm install
```

### Admin Panel issues

**Issue**: White screen or blank page

**Solution**: Check browser console for errors
```bash
# Rebuild admin panel
cd admin-panel
npm run build
npm start
```

**Issue**: Can't login

**Solution**: Clear browser cache and localStorage
```javascript
// In browser console
localStorage.clear()
location.reload()
```

### API Connection issues

**Issue**: Cannot connect to services from admin panel

**Solution**: Check if services are running
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

**Issue**: CORS errors in browser

**Solution**: Services have CORS enabled by default. If issues persist, check firewall settings.

## Production Deployment

For production use, follow these additional steps:

### 1. Security

- Change default admin password
- Use environment variables for secrets
- Enable HTTPS with SSL certificates
- Implement rate limiting
- Add authentication middleware
- Use a firewall

### 2. Database

Replace in-memory storage with a database:

```javascript
// Example: Using PostgreSQL
const { Pool } = require('pg')
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
})
```

### 3. Reverse Proxy

Use nginx or Apache:

```nginx
# nginx example
server {
    listen 80;
    server_name ggmp.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/keymaster {
        proxy_pass http://localhost:3001/api;
    }
    
    location /api/policy {
        proxy_pass http://localhost:3002/api;
    }
    
    location /api/nucleus {
        proxy_pass http://localhost:3003/api;
    }
}
```

### 4. Process Management

Use PM2 for process management:

```bash
npm install -g pm2

# Start services with PM2
pm2 start index.js --name ggmp-services
pm2 start admin-panel/package.json --name ggmp-admin

# Save PM2 configuration
pm2 save

# Enable startup on boot
pm2 startup
```

### 5. Monitoring

Add monitoring and logging:

```javascript
// Install winston for logging
npm install winston

// In your services
const winston = require('winston')
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

## Support

For issues or questions:
- Documentation: [docs/GGMP.md](../../docs/GGMP.md)
- Issues: [GitHub Issues](https://github.com/Snozxyx/fivem/issues)
- Setup Guide: This file

## Development

### Running in Development Mode

```bash
# Install dev dependencies
npm install --save-dev nodemon

# Add to package.json scripts
"dev:keymaster": "nodemon keymaster/server.js",
"dev:policy": "nodemon policy/server.js",
"dev:nucleus": "nodemon nucleus/server.js"

# Run with hot reload
npm run dev:keymaster
```

### Building Admin Panel for Production

```bash
cd admin-panel
npm run build

# The built files will be in admin-panel/dist/
# Serve with any static file server
```

## License

Part of the GGMP (Game Global Multiplayer Platform) project.
See main repository for license information.

---

**GGMP Services v1.0.0**  
For more information, visit: https://github.com/Snozxyx/fivem
