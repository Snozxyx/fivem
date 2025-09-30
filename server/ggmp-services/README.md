# GGMP Services

Local services that replace CFX.re dependencies for GGMP platform.

## Services Included

### 1. Keymaster Service (Port 3001)
Replaces `keymaster.cfx.re` functionality:
- License key validation
- Key registration and management
- Usage tracking

### 2. Policy Service (Port 3002)
Replaces `policy-live.fivem.net` functionality:
- Game policy configuration
- Pool size limits
- Feature flags

### 3. Nucleus Service (Port 3003)
Replaces `cfx.re/api/register` functionality:
- Server registration
- Source IP validation
- Server status management

### 4. Admin Panel (Port 3000)
React-based admin dashboard:
- Token management
- Server monitoring
- User authentication
- Statistics and analytics

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your settings
nano .env
```

### Running Services

```bash
# Run all services
npm start

# Or run individually
npm run start:keymaster
npm run start:policy
npm run start:nucleus
npm run start:admin

# Development mode (with hot reload)
npm run dev
```

## Configuration

### Client/Server Configuration

Update your GGMP client/server to use local services:

```cpp
// In code/components/net/src/NetLibrary.cpp
#define POLICY_LIVE_ENDPOINT "http://localhost:3002/"

// Set environment variables or update code to use:
GGMP_KEYMASTER_URL=http://localhost:3001
GGMP_POLICY_URL=http://localhost:3002
GGMP_NUCLEUS_URL=http://localhost:3003
```

### Server Configuration (server.cfg)

```cfg
# GGMP Service URLs
set ggmp_keymaster_url "http://localhost:3001"
set ggmp_policy_url "http://localhost:3002"
set ggmp_nucleus_url "http://localhost:3003"

# Use local services
set sv_disableClientConsole false
set sv_customAuth "enabled"
```

## API Documentation

### Keymaster API

**POST /api/validate**
Validate a license key
```json
{
  "key": "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX",
  "serverEndpoint": "server.example.com"
}
```

**POST /api/register-key**
Register a new key
```json
{
  "key": "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX",
  "serverName": "My Server",
  "maxPlayers": 2048
}
```

**GET /api/keys**
List all registered keys

**DELETE /api/keys/:key**
Revoke a key

### Policy API

**GET /**
Get policy configuration

**GET /pool-size-limits/:game**
Get pool size limits for a specific game

### Nucleus API

**POST /api/register**
Register a server

**POST /api/validateSource**
Validate source IP

**GET /api/servers**
List registered servers

## Production Deployment

For production use:

1. Use a reverse proxy (nginx/apache)
2. Enable HTTPS
3. Use a database instead of in-memory storage
4. Implement rate limiting
5. Add authentication for admin endpoints
6. Set up monitoring and logging

## Troubleshooting

### Services won't start
- Check if ports are already in use
- Verify Node.js version (14+ required)
- Check .env configuration

### Client can't connect
- Verify firewall settings
- Check service URLs in client configuration
- Ensure services are running

### Keys not working
- Check keymaster logs
- Verify key format
- Ensure key is registered

## Support

For issues or questions:
- Check documentation: docs/GGMP.md
- Review logs in console
- Create an issue on GitHub

---

**GGMP Services v1.0.0**
Part of the GGMP (Game Global Multiplayer Platform)
