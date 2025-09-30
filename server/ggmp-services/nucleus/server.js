/**
 * GGMP Nucleus Service
 * Replaces cfx.re/api/register functionality
 * Handles server registration and management
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.NUCLEUS_PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for registered servers
const registeredServers = new Map();

/**
 * Register a server
 * Mimics cfx.re/api/register endpoint
 */
app.post('/api/register', (req, res) => {
    const serverData = req.body;
    
    const serverId = uuidv4();
    const serverInfo = {
        id: serverId,
        ...serverData,
        registeredAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        host: `${serverId}.ggmp.local`,
        rpToken: generateToken()
    };
    
    registeredServers.set(serverId, serverInfo);
    
    console.log(`[NUCLEUS] ✓ Server registered: ${serverData.name || 'Unknown'} (${serverId})`);
    
    res.json({
        success: true,
        id: serverId,
        host: serverInfo.host,
        rpToken: serverInfo.rpToken,
        message: 'Server registered with GGMP Nucleus'
    });
});

/**
 * Validate source IP
 * Mimics cfx.re/api/validateSource endpoint
 */
app.post('/api/validateSource', (req, res) => {
    const { ip } = req.body;
    
    console.log(`[NUCLEUS] Source validation request for IP: ${ip}`);
    
    // In GGMP, we allow all IPs for local deployment
    res.json({
        success: true,
        valid: true,
        ip: ip,
        message: 'IP validated by GGMP Nucleus'
    });
});

/**
 * Get registered servers list
 */
app.get('/api/servers', (req, res) => {
    const servers = Array.from(registeredServers.values()).map(s => ({
        id: s.id,
        name: s.name,
        host: s.host,
        players: s.players || 0,
        maxPlayers: s.maxPlayers || 2048,
        registeredAt: s.registeredAt,
        lastSeen: s.lastSeen
    }));
    
    res.json({
        success: true,
        count: servers.length,
        servers
    });
});

/**
 * Update server status
 */
app.post('/api/servers/:id/status', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if (registeredServers.has(id)) {
        const server = registeredServers.get(id);
        Object.assign(server, updates, {
            lastSeen: new Date().toISOString()
        });
        registeredServers.set(id, server);
        
        res.json({
            success: true,
            server
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Server not found'
        });
    }
});

/**
 * Unregister a server
 */
app.delete('/api/servers/:id', (req, res) => {
    const { id } = req.params;
    
    if (registeredServers.has(id)) {
        const server = registeredServers.get(id);
        registeredServers.delete(id);
        
        console.log(`[NUCLEUS] ✓ Server unregistered: ${server.name} (${id})`);
        
        res.json({
            success: true,
            message: 'Server unregistered'
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Server not found'
        });
    }
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'GGMP Nucleus',
        timestamp: new Date().toISOString(),
        registeredServers: registeredServers.size
    });
});

// Helper function to generate random token
function generateToken() {
    return require('crypto').randomBytes(32).toString('hex');
}

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║         GGMP Nucleus Service Running                ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Service: GGMP Nucleus`);
    console.log(`✓ Port: ${PORT}`);
    console.log(`✓ Registered Servers: ${registeredServers.size}`);
    console.log('');
    console.log('Endpoints:');
    console.log(`  POST   http://localhost:${PORT}/api/register`);
    console.log(`  POST   http://localhost:${PORT}/api/validateSource`);
    console.log(`  GET    http://localhost:${PORT}/api/servers`);
    console.log(`  POST   http://localhost:${PORT}/api/servers/:id/status`);
    console.log(`  DELETE http://localhost:${PORT}/api/servers/:id`);
    console.log('');
});

module.exports = app;
