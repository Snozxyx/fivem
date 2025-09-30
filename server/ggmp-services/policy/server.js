/**
 * GGMP Policy Service
 * Replaces policy-live.fivem.net functionality
 * Provides game policies and configurations
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.POLICY_PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Default GGMP policy configuration
const ggmpPolicy = {
    version: '1.0.0',
    platform: 'GGMP',
    maxPlayers: 2048,
    streamingMemory: '18MB',
    features: {
        customAuth: true,
        enhancedStreaming: true,
        unlimitedPlayers: true,
        premiumPerks: true,
        unlimitedClothing: true,
        unlimitedProps: true
    },
    limits: {
        entities: 50000,
        props: 25000,
        vehicles: 10000,
        peds: 5000
    },
    security: {
        enforceGameBuild: false,
        allowOfflineMode: true,
        requireKeymaster: false
    }
};

/**
 * Get policy configuration
 * Mimics policy-live.fivem.net endpoint
 */
app.get('/', (req, res) => {
    console.log('[POLICY] Configuration request received');
    res.json(ggmpPolicy);
});

app.get('/api/policy', (req, res) => {
    console.log('[POLICY] API policy request received');
    res.json(ggmpPolicy);
});

/**
 * Update policy configuration
 */
app.post('/api/policy', (req, res) => {
    const updates = req.body;
    
    Object.assign(ggmpPolicy, updates);
    
    console.log('[POLICY] Configuration updated');
    res.json({
        success: true,
        policy: ggmpPolicy
    });
});

/**
 * Get pool size limits
 */
app.get('/pool-size-limits/:game', (req, res) => {
    const { game } = req.params;
    
    console.log(`[POLICY] Pool size limits request for ${game}`);
    
    const limits = {
        game: game,
        limits: {
            CTaskVehicleTempAction: 500,
            CVehicleClipRequestData: 300,
            CPedPropsMgr: 2048,
            CCompEntity: 10000,
            CVehicle: 1000,
            CPed: 512,
            CObject: 5000,
            CPickup: 1000,
            ...ggmpPolicy.limits
        }
    };
    
    res.json(limits);
});

/**
 * Health check
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'GGMP Policy',
        timestamp: new Date().toISOString(),
        version: ggmpPolicy.version
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║          GGMP Policy Service Running                ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✓ Service: GGMP Policy`);
    console.log(`✓ Port: ${PORT}`);
    console.log(`✓ Max Players: ${ggmpPolicy.maxPlayers}`);
    console.log('');
    console.log('Endpoints:');
    console.log(`  GET  http://localhost:${PORT}/`);
    console.log(`  GET  http://localhost:${PORT}/api/policy`);
    console.log(`  POST http://localhost:${PORT}/api/policy`);
    console.log(`  GET  http://localhost:${PORT}/pool-size-limits/:game`);
    console.log('');
});

module.exports = app;
