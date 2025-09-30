/**
 * GGMP Keymaster Service
 * Replaces keymaster.cfx.re functionality
 * Handles license key validation for GGMP servers
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.KEYMASTER_PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for keys (in production, use a database)
const validKeys = new Map();
const keyUsage = new Map();

// Load keys from file if exists
const keysFile = path.join(__dirname, 'keys.json');
if (fs.existsSync(keysFile)) {
    const data = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
    data.keys.forEach(key => {
        validKeys.set(key.key, key);
    });
    console.log(`✓ Loaded ${validKeys.size} keys from ${keysFile}`);
}

/**
 * Validate a GGMP license key
 * Mimics keymaster.cfx.re validation endpoint
 */
app.post('/api/validate', (req, res) => {
    const { key, serverEndpoint } = req.body;
    
    console.log(`[KEYMASTER] Validation request for key: ${key?.substring(0, 10)}... from ${serverEndpoint}`);
    
    if (!key) {
        return res.status(400).json({
            success: false,
            error: 'Missing license key'
        });
    }
    
    // Check if key exists and is valid
    if (validKeys.has(key)) {
        const keyData = validKeys.get(key);
        
        // Check if key is expired
        if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
            return res.status(403).json({
                success: false,
                error: 'License key has expired'
            });
        }
        
        // Track usage
        if (!keyUsage.has(key)) {
            keyUsage.set(key, []);
        }
        keyUsage.get(key).push({
            timestamp: new Date().toISOString(),
            endpoint: serverEndpoint
        });
        
        console.log(`[KEYMASTER] ✓ Valid key: ${key.substring(0, 10)}...`);
        
        return res.json({
            success: true,
            key: key,
            serverName: keyData.serverName,
            maxPlayers: keyData.maxPlayers || 2048,
            features: keyData.features || {
                customAuth: true,
                enhancedStreaming: true,
                unlimitedPlayers: true,
                premiumPerks: true
            },
            expiresAt: keyData.expiresAt,
            type: 'GGMP_LOCAL'
        });
    }
    
    console.log(`[KEYMASTER] ✗ Invalid key: ${key?.substring(0, 10)}...`);
    return res.status(403).json({
        success: false,
        error: 'Invalid license key'
    });
});

/**
 * Register a new key
 */
app.post('/api/register-key', (req, res) => {
    const { key, serverName, maxPlayers, features, expiresAt } = req.body;
    
    if (!key) {
        return res.status(400).json({
            success: false,
            error: 'Missing license key'
        });
    }
    
    const keyData = {
        key,
        serverName: serverName || 'GGMP Server',
        maxPlayers: maxPlayers || 2048,
        features: features || {
            customAuth: true,
            enhancedStreaming: true,
            unlimitedPlayers: true,
            premiumPerks: true
        },
        expiresAt: expiresAt || null,
        registered: new Date().toISOString()
    };
    
    validKeys.set(key, keyData);
    
    // Save to file
    const keysArray = Array.from(validKeys.values());
    fs.writeFileSync(keysFile, JSON.stringify({ keys: keysArray }, null, 2));
    
    console.log(`[KEYMASTER] ✓ Registered new key: ${key.substring(0, 10)}...`);
    
    res.json({
        success: true,
        message: 'Key registered successfully',
        key: keyData
    });
});

/**
 * List all registered keys
 */
app.get('/api/keys', (req, res) => {
    const keys = Array.from(validKeys.values()).map(k => ({
        key: k.key,
        serverName: k.serverName,
        maxPlayers: k.maxPlayers,
        registered: k.registered,
        expiresAt: k.expiresAt,
        usage: keyUsage.get(k.key) || []
    }));
    
    res.json({
        success: true,
        count: keys.length,
        keys
    });
});

/**
 * Revoke a key
 */
app.delete('/api/keys/:key', (req, res) => {
    const { key } = req.params;
    
    if (validKeys.has(key)) {
        validKeys.delete(key);
        keyUsage.delete(key);
        
        // Save to file
        const keysArray = Array.from(validKeys.values());
        fs.writeFileSync(keysFile, JSON.stringify({ keys: keysArray }, null, 2));
        
        console.log(`[KEYMASTER] ✓ Revoked key: ${key.substring(0, 10)}...`);
        
        return res.json({
            success: true,
            message: 'Key revoked successfully'
        });
    }
    
    res.status(404).json({
        success: false,
        error: 'Key not found'
    });
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'GGMP Keymaster',
        timestamp: new Date().toISOString(),
        activeKeys: validKeys.size
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║        GGMP Keymaster Service Running               ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Service: GGMP Keymaster`);
    console.log(`✓ Port: ${PORT}`);
    console.log(`✓ Active Keys: ${validKeys.size}`);
    console.log('');
    console.log('Endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/validate`);
    console.log(`  POST http://localhost:${PORT}/api/register-key`);
    console.log(`  GET  http://localhost:${PORT}/api/keys`);
    console.log(`  DELETE http://localhost:${PORT}/api/keys/:key`);
    console.log('');
});

module.exports = app;
