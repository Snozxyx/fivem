#!/usr/bin/env node
/**
 * GGMP Keymaster Generator
 * 
 * Generates custom keymaster keys for GGMP servers
 * This script creates license keys for local/private server deployments
 * 
 * Usage:
 *   node generate-keymaster.js
 *   node generate-keymaster.js --output keys.json
 *   node generate-keymaster.js --count 10
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let outputFile = 'keymaster-keys.json';
let keyCount = 1;
let serverName = 'GGMP Server';

for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && i + 1 < args.length) {
        outputFile = args[i + 1];
        i++;
    } else if (args[i] === '--count' && i + 1 < args.length) {
        keyCount = parseInt(args[i + 1]);
        i++;
    } else if (args[i] === '--name' && i + 1 < args.length) {
        serverName = args[i + 1];
        i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
        console.log(`
GGMP Keymaster Generator

Usage:
  node generate-keymaster.js [options]

Options:
  --output <file>    Output file for keys (default: keymaster-keys.json)
  --count <number>   Number of keys to generate (default: 1)
  --name <name>      Server name (default: GGMP Server)
  --help, -h         Show this help message

Examples:
  node generate-keymaster.js
  node generate-keymaster.js --output server-keys.json
  node generate-keymaster.js --count 5 --name "My GGMP Server"
        `);
        process.exit(0);
    }
}

/**
 * Generate a random keymaster key
 */
function generateKey() {
    // Generate a 32-byte random key
    const randomBytes = crypto.randomBytes(32);
    
    // Create a key in the format: GGMP-XXXX-XXXX-XXXX-XXXX-XXXX
    const parts = [];
    for (let i = 0; i < 5; i++) {
        const segment = randomBytes.slice(i * 4, (i + 1) * 4).toString('hex').toUpperCase().substring(0, 4);
        parts.push(segment);
    }
    
    return 'GGMP-' + parts.join('-');
}

/**
 * Generate key metadata
 */
function generateKeyMetadata(key, index) {
    const now = new Date().toISOString();
    
    return {
        key: key,
        id: index + 1,
        serverName: serverName,
        generated: now,
        expiresAt: null, // No expiration for local keys
        maxPlayers: 2048,
        features: {
            customAuth: true,
            enhancedStreaming: true,
            unlimitedPlayers: true,
            premiumPerks: true
        },
        type: 'GGMP_LOCAL',
        version: '1.0.0'
    };
}

/**
 * Main function
 */
function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║   GGMP Keymaster Key Generator v1.0      ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
    
    console.log(`Generating ${keyCount} key(s) for: ${serverName}`);
    console.log('');
    
    const keys = [];
    
    for (let i = 0; i < keyCount; i++) {
        const key = generateKey();
        const metadata = generateKeyMetadata(key, i);
        keys.push(metadata);
        
        console.log(`✓ Generated key ${i + 1}/${keyCount}: ${key}`);
    }
    
    // Save to file
    const output = {
        generator: 'GGMP Keymaster Generator',
        version: '1.0.0',
        generated: new Date().toISOString(),
        serverName: serverName,
        totalKeys: keyCount,
        keys: keys
    };
    
    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    
    console.log('');
    console.log(`✓ Keys saved to: ${outputFile}`);
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('Configuration Instructions:');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Add to your server.cfg:');
    console.log(`  set sv_customLicenseKey "${keys[0].key}"`);
    console.log('');
    console.log('Or use environment variable:');
    console.log(`  export GGMP_LICENSE_KEY="${keys[0].key}"`);
    console.log('');
    console.log('For multiple servers, use different keys from the generated file.');
    console.log('');
}

// Run the generator
try {
    main();
} catch (error) {
    console.error('Error generating keys:', error.message);
    process.exit(1);
}
