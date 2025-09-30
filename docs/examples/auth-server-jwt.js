/**
 * JWT-based Custom Authentication Server for FiveM
 * 
 * This authentication server uses JSON Web Tokens (JWT) for secure authentication.
 * Requires: npm install express jsonwebtoken bcrypt
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE-THIS-SECRET-KEY-IN-PRODUCTION';
const JWT_EXPIRATION = '24h'; // Token expiration time

// Middleware
app.use(express.json());

// In-memory user database (replace with actual database in production)
const users = {
    'admin': {
        id: '1',
        username: 'admin',
        passwordHash: bcrypt.hashSync('admin123', 10), // In production, never hardcode passwords!
        steamId: '76561198012345678',
        discordId: '123456789012345678',
        roles: ['admin', 'moderator', 'player']
    },
    'player1': {
        id: '2',
        username: 'player1',
        passwordHash: bcrypt.hashSync('player123', 10),
        steamId: '76561198087654321',
        discordId: '987654321098765432',
        roles: ['player']
    }
};

// Active sessions (in production, use Redis or similar)
const activeSessions = new Map();

/**
 * User login endpoint
 * Returns a JWT token that can be used for authentication
 */
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log(`[AUTH] Login attempt for user: ${username}`);
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }
    
    const user = users[username];
    
    if (!user) {
        console.log(`[AUTH] ✗ User not found: ${username}`);
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
        console.log(`[AUTH] ✗ Invalid password for user: ${username}`);
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username,
            steamId: user.steamId,
            discordId: user.discordId,
            roles: user.roles
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
    
    // Store session
    activeSessions.set(token, {
        userId: user.id,
        username: user.username,
        loginTime: new Date().toISOString()
    });
    
    console.log(`[AUTH] ✓ Login successful for user: ${username}`);
    
    res.json({
        success: true,
        token: token,
        expiresIn: JWT_EXPIRATION,
        user: {
            id: user.id,
            username: user.username,
            roles: user.roles
        }
    });
});

/**
 * FiveM server validation endpoint
 * Validates JWT tokens from connecting players
 */
app.post('/validate', (req, res) => {
    const { customAuthToken } = req.body;
    
    console.log(`[AUTH] Validation request`);
    
    if (!customAuthToken) {
        console.log('[AUTH] ✗ Missing token');
        return res.status(400).json({
            success: false,
            error: 'Missing authentication token'
        });
    }
    
    try {
        // Verify JWT token
        const decoded = jwt.verify(customAuthToken, JWT_SECRET);
        
        // Check if session is still active
        if (!activeSessions.has(customAuthToken)) {
            console.log('[AUTH] ✗ Session not found or expired');
            return res.status(401).json({
                success: false,
                error: 'Session expired or invalid'
            });
        }
        
        console.log(`[AUTH] ✓ Valid token for user: ${decoded.username}`);
        
        res.json({
            success: true,
            userId: decoded.userId,
            username: decoded.username,
            steamId: decoded.steamId,
            discordId: decoded.discordId,
            roles: decoded.roles
        });
    } catch (error) {
        console.log(`[AUTH] ✗ Token verification failed: ${error.message}`);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired'
            });
        }
        
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }
});

/**
 * Logout endpoint
 * Invalidates the user's token
 */
app.post('/logout', (req, res) => {
    const { token } = req.body;
    
    if (activeSessions.has(token)) {
        const session = activeSessions.get(token);
        activeSessions.delete(token);
        console.log(`[AUTH] Logged out user: ${session.username}`);
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Session not found'
        });
    }
});

/**
 * Refresh token endpoint
 * Issues a new token before the old one expires
 */
app.post('/refresh', (req, res) => {
    const { token } = req.body;
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Generate new token
        const newToken = jwt.sign(
            {
                userId: decoded.userId,
                username: decoded.username,
                steamId: decoded.steamId,
                discordId: decoded.discordId,
                roles: decoded.roles
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );
        
        // Update session
        activeSessions.delete(token);
        activeSessions.set(newToken, {
            userId: decoded.userId,
            username: decoded.username,
            loginTime: new Date().toISOString()
        });
        
        console.log(`[AUTH] Token refreshed for user: ${decoded.username}`);
        
        res.json({
            success: true,
            token: newToken,
            expiresIn: JWT_EXPIRATION
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
});

/**
 * Create new user endpoint (admin only)
 */
app.post('/create-user', async (req, res) => {
    const { username, password, steamId, discordId, roles } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            error: 'Username and password are required'
        });
    }
    
    if (users[username]) {
        return res.status(409).json({
            success: false,
            error: 'Username already exists'
        });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    users[username] = {
        id: String(Object.keys(users).length + 1),
        username,
        passwordHash,
        steamId: steamId || 'none',
        discordId: discordId || 'none',
        roles: roles || ['player']
    };
    
    console.log(`[AUTH] Created new user: ${username}`);
    
    res.json({
        success: true,
        message: 'User created successfully',
        user: {
            id: users[username].id,
            username: users[username].username,
            roles: users[username].roles
        }
    });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        activeSessions: activeSessions.size,
        totalUsers: Object.keys(users).length
    });
});

/**
 * List active sessions (admin endpoint)
 */
app.get('/sessions', (req, res) => {
    const sessions = Array.from(activeSessions.values());
    res.json({
        count: sessions.length,
        sessions: sessions
    });
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
║   JWT-based FiveM Authentication Server   ║
║   Port: ${PORT}                            ║
║   Status: Running                         ║
╚═══════════════════════════════════════════╝

Endpoints:
  POST /login            - User login (returns JWT)
  POST /validate         - Validate JWT token
  POST /logout           - Logout user
  POST /refresh          - Refresh JWT token
  POST /create-user      - Create new user
  GET  /sessions         - List active sessions
  GET  /health           - Health check

Total users: ${Object.keys(users).length}
Active sessions: ${activeSessions.size}

⚠️  IMPORTANT: Change JWT_SECRET before production use!
    `);
});

// Cleanup expired sessions periodically
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [token, session] of activeSessions.entries()) {
        try {
            jwt.verify(token, JWT_SECRET);
        } catch (error) {
            activeSessions.delete(token);
            cleaned++;
        }
    }
    
    if (cleaned > 0) {
        console.log(`[AUTH] Cleaned ${cleaned} expired sessions`);
    }
}, 60000); // Check every minute

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('[AUTH] Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[AUTH] Shutting down gracefully...');
    process.exit(0);
});
