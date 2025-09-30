/**
 * GGMP Services Main Entry Point
 * Starts all GGMP services (Keymaster, Policy, Nucleus)
 */

require('dotenv').config();

const keymaster = require('./keymaster/server');
const policy = require('./policy/server');
const nucleus = require('./nucleus/server');

console.log('\n');
console.log('═══════════════════════════════════════════════════════════════');
console.log('              GGMP Services Started Successfully               ');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');
console.log('All GGMP services are now running:');
console.log('');
console.log('  ✓ Keymaster Service - Port 3001');
console.log('  ✓ Policy Service    - Port 3002');
console.log('  ✓ Nucleus Service   - Port 3003');
console.log('');
console.log('To use these services, configure your GGMP client/server:');
console.log('');
console.log('  1. Set GGMP_KEYMASTER_URL=http://localhost:3001');
console.log('  2. Set GGMP_POLICY_URL=http://localhost:3002');
console.log('  3. Set GGMP_NUCLEUS_URL=http://localhost:3003');
console.log('');
console.log('═══════════════════════════════════════════════════════════════');
console.log('\n');
