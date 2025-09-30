/**
 * Simple Custom Authentication Server for FiveM
 * 
 * This is a basic authentication server that validates tokens.
 * For production use, implement proper security measures:
 * - HTTPS/TLS
 * - Rate limiting
 * - Token expiration
 * - Database integration
 * - Logging and monitoring
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Simple in-memory token store (replace with database in production)
const validTokens = new Set([
    'token_player1_abc123',
    'token_player2_def456',
    'token_player3_ghi789',
    // Add more tokens as needed
]);

// User information (in production, use a database)
const users = {
    'token_player1_abc123': {
        userId: 'user_001',
        username: 'Player1',
        steamId: '76561198012345678',
        discordId: '123456789012345678',
        roles: ['player', 'vip']
    },
    'token_player2_def456': {
        userId: 'user_002',
        username: 'Player2',
        steamId: '76561198087654321',
        discordId: '987654321098765432',
        roles: ['player', 'moderator']
    },
    'token_player3_ghi789': {
        userId: 'user_003',
        username: 'Player3',
        steamId: '76561198011111111',
        discordId: '111111111111111111',
        roles: ['player', 'admin']
    }
};

/**
 * Main authentication endpoint
 * Called by FiveM server when a player attempts to connect
 */
app.post('/validate', (req, res) => {
    const { customAuthToken } = req.body;
    
    console.log(`[AUTH] Validation request for token: ${customAuthToken?.substring(0, 10)}...`);
    
    // Check if token exists and is valid
    if (!customAuthToken) {
        console.log('[AUTH] Missing token');
        return res.status(400).json({
            success: false,
            error: 'Missing authentication token'
        });
    }
    
    if (validTokens.has(customAuthToken)) {
        const user = users[customAuthToken];
        
        console.log(`[AUTH] ✓ Valid token for user: ${user.username}`);
        
        return res.json({
            success: true,
            userId: user.userId,
            username: user.username,
            steamId: user.steamId,
            discordId: user.discordId,
            roles: user.roles
        });
    } else {
        console.log('[AUTH] ✗ Invalid token');
        
        return res.status(401).json({
            success: false,
            error: 'Invalid authentication token'
        });
    }
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        activeTokens: validTokens.size
    });
});

/**
 * Token generation endpoint (for testing/admin use only)
 * In production, protect this endpoint or use a separate admin panel
 */
app.post('/generate-token', (req, res) => {
    const { username, steamId, discordId, roles } = req.body;
    
    if (!username) {
        return res.status(400).json({
            error: 'Username is required'
        });
    }
    
    // Generate a random token
    const token = `token_${username}_${Math.random().toString(36).substring(2, 15)}`;
    
    // Store token
    validTokens.add(token);
    users[token] = {
        userId: `user_${Date.now()}`,
        username,
        steamId: steamId || 'none',
        discordId: discordId || 'none',
        roles: roles || ['player']
    };
    
    console.log(`[AUTH] Generated new token for ${username}`);
    
    res.json({
        success: true,
        token: token,
        message: 'Token generated successfully'
    });
});

/**
 * List all registered users (admin endpoint - protect in production!)
 */
app.get('/users', (req, res) => {
    const userList = Array.from(validTokens).map(token => ({
        username: users[token].username,
        userId: users[token].userId,
        roles: users[token].roles
    }));
    
    res.json({
        count: userList.length,
        users: userList
    });
});

/**
 * Revoke a token (admin endpoint - protect in production!)
 */
app.post('/revoke-token', (req, res) => {
    const { token } = req.body;
    
    if (validTokens.has(token)) {
        const username = users[token]?.username || 'unknown';
        validTokens.delete(token);
        delete users[token];
        
        console.log(`[AUTH] Revoked token for ${username}`);
        
        res.json({
            success: true,
            message: 'Token revoked successfully'
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Token not found'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('[ERROR]', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   Custom FiveM Authentication Server      ║
║   Port: ${PORT}                            ║
║   Status: Running                         ║
╚═══════════════════════════════════════════╝

Endpoints:
  POST /validate          - Validate auth token
  POST /generate-token    - Generate new token
  POST /revoke-token      - Revoke a token
  GET  /users            - List all users
  GET  /health           - Health check

Active tokens: ${validTokens.size}
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[AUTH] Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[AUTH] Shutting down gracefully...');
    process.exit(0);
});
