# Example Configurations and Scripts

This directory contains example configurations and scripts for the custom FiveM build.

## Files Overview

### Server Configuration

- **server.cfg.example** - Complete server configuration example with all custom modifications
  - 2048 player support
  - Custom authentication settings
  - Streaming pool size configurations
  - OneSync settings

### Authentication Servers

Two example authentication server implementations are provided:

#### 1. Simple Token-Based Auth (`auth-server-simple.js`)

**Features:**
- Simple token validation
- In-memory token storage
- Basic user management
- Easy to understand and modify

**Use for:**
- Testing and development
- Small private servers
- Learning authentication concepts

**Setup:**
```bash
npm install express
node auth-server-simple.js
```

**Default tokens:**
- `token_player1_abc123`
- `token_player2_def456`
- `token_player3_ghi789`

**Endpoints:**
- `POST /validate` - Validate token
- `POST /generate-token` - Generate new token
- `POST /revoke-token` - Revoke token
- `GET /users` - List users
- `GET /health` - Health check

#### 2. JWT-Based Auth (`auth-server-jwt.js`)

**Features:**
- JSON Web Token (JWT) authentication
- Password hashing with bcrypt
- Token expiration and refresh
- Session management
- More secure than simple tokens

**Use for:**
- Production environments
- Larger servers
- Enhanced security requirements

**Setup:**
```bash
npm install express jsonwebtoken bcrypt
node auth-server-jwt.js
```

**Default users:**
- Username: `admin`, Password: `admin123`
- Username: `player1`, Password: `player123`

**Endpoints:**
- `POST /login` - Login and get JWT token
- `POST /validate` - Validate JWT token
- `POST /logout` - Logout user
- `POST /refresh` - Refresh token
- `POST /create-user` - Create new user
- `GET /sessions` - List active sessions
- `GET /health` - Health check

## Quick Start

### 1. Set Up Auth Server

Choose one of the authentication servers:

**Simple Auth:**
```bash
cd docs/examples
npm install express
node auth-server-simple.js
```

**JWT Auth:**
```bash
cd docs/examples
npm install express jsonwebtoken bcrypt
JWT_SECRET="your-secret-key" node auth-server-jwt.js
```

### 2. Configure FiveM Server

Copy the example configuration:
```bash
cp docs/examples/server.cfg.example server.cfg
```

Edit `server.cfg` and change:
- `sv_hostname` - Your server name
- `sv_customLicenseKey` - Your custom key
- `sv_authEndpoint` - Your auth server URL
- `rcon_password` - RCON password
- Add your resources

### 3. Start FiveM Server

```bash
./FXServer +exec server.cfg
```

### 4. Generate Client Token

**For Simple Auth:**
```bash
curl -X POST http://localhost:3000/generate-token \
  -H "Content-Type: application/json" \
  -d '{"username": "newplayer", "roles": ["player"]}'
```

**For JWT Auth:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "player1", "password": "player123"}'
```

### 5. Connect Client

Provide the token to the FiveM client:

**Option 1: Configuration File**
Create `FiveM Application Data/citizen/auth_token.txt`:
```
your-token-here
```

**Option 2: Environment Variable**
```bash
set FIVEM_AUTH_TOKEN=your-token-here
FiveM.exe
```

## Testing Authentication

### Test Simple Auth

```bash
# Generate token
curl -X POST http://localhost:3000/generate-token \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "roles": ["player"]}'

# Response: {"success":true,"token":"token_testuser_abc123xyz"}

# Validate token
curl -X POST http://localhost:3000/validate \
  -H "Content-Type: application/json" \
  -d '{"customAuthToken": "token_testuser_abc123xyz"}'

# Response: {"success":true,"userId":"user_001","username":"testuser",...}
```

### Test JWT Auth

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "player1", "password": "player123"}'

# Response: {"success":true,"token":"eyJhbGciOiJIUzI1NiIs..."}

# Validate token
curl -X POST http://localhost:3000/validate \
  -H "Content-Type: application/json" \
  -d '{"customAuthToken": "eyJhbGciOiJIUzI1NiIs..."}'

# Response: {"success":true,"userId":"2","username":"player1",...}
```

## Security Notes

### Development vs Production

**These examples are for development/testing. For production:**

1. **Change default credentials**
   - JWT_SECRET
   - Admin passwords
   - RCON password
   - Default tokens

2. **Use HTTPS**
   ```javascript
   const https = require('https');
   const fs = require('fs');
   
   const options = {
       key: fs.readFileSync('privkey.pem'),
       cert: fs.readFileSync('cert.pem')
   };
   
   https.createServer(options, app).listen(3000);
   ```

3. **Implement rate limiting**
   ```bash
   npm install express-rate-limit
   ```
   
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15 minutes
       max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/validate', limiter);
   ```

4. **Add database integration**
   - PostgreSQL, MySQL, or MongoDB
   - Connection pooling
   - Prepared statements

5. **Implement logging**
   ```bash
   npm install winston
   ```

6. **Add monitoring**
   - Health checks
   - Metrics collection
   - Error tracking

## Customization

### Adding Custom User Fields

Edit the auth server to include custom fields:

```javascript
const users = {
    'username': {
        id: '1',
        username: 'username',
        passwordHash: '...',
        // Custom fields
        country: 'US',
        membershipLevel: 'premium',
        registeredDate: '2024-01-01',
        discordVerified: true,
        steamVerified: true,
        customData: {
            // Any additional data
        }
    }
};
```

### Adding Role-Based Access

```javascript
app.post('/validate', (req, res) => {
    // ... existing validation code
    
    // Check required roles
    const requiredRole = req.body.requiredRole;
    if (requiredRole && !decoded.roles.includes(requiredRole)) {
        return res.status(403).json({
            success: false,
            error: 'Insufficient permissions'
        });
    }
    
    // ... continue
});
```

### Integration with Discord

```bash
npm install discord.js
```

```javascript
const { Client, GatewayIntentBits } = require('discord.js');

const discord = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Verify Discord membership
async function verifyDiscordMember(discordId) {
    const guild = discord.guilds.cache.get('YOUR_GUILD_ID');
    const member = await guild.members.fetch(discordId);
    return member ? member.roles.cache.has('MEMBER_ROLE_ID') : false;
}
```

## Troubleshooting

### Auth Server Not Starting

```bash
# Check if port is in use
netstat -an | grep 3000

# Try different port
PORT=3001 node auth-server-simple.js
```

### Token Validation Fails

1. Check auth server logs
2. Verify token format
3. Check network connectivity
4. Ensure FiveM server config has correct endpoint

### Cannot Connect to Auth Server

1. Check firewall rules:
   ```bash
   # Linux
   sudo ufw allow 3000/tcp
   
   # Windows
   netsh advfirewall firewall add rule name="Auth Server" dir=in action=allow protocol=TCP localport=3000
   ```

2. Verify auth server is running:
   ```bash
   curl http://localhost:3000/health
   ```

3. Check FiveM server config has correct URL

## Additional Resources

- [Main Documentation](../custom-modifications.md)
- [Quick Start Guide](../quick-start-guide.md)
- [Building Documentation](../building.md)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review server and auth server logs
3. Test endpoints with curl
4. Create an issue with:
   - Error messages
   - Configuration files
   - Steps to reproduce

---

**Security Warning:** Never expose authentication servers to the public internet without proper security measures including HTTPS, rate limiting, input validation, and monitoring.
