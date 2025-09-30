#!/usr/bin/env python3
"""
GGMP Keymaster Generator (Python)

Generates custom keymaster keys for GGMP servers
This script creates license keys for local/private server deployments

Usage:
    python generate-keymaster.py
    python generate-keymaster.py --output keys.json
    python generate-keymaster.py --count 10
"""

import os
import sys
import json
import secrets
import argparse
from datetime import datetime


def generate_key():
    """Generate a random keymaster key"""
    # Generate random bytes
    random_bytes = secrets.token_bytes(20)
    
    # Create a key in the format: GGMP-XXXX-XXXX-XXXX-XXXX-XXXX
    parts = []
    for i in range(5):
        segment = random_bytes[i*4:(i+1)*4].hex().upper()[:4]
        parts.append(segment)
    
    return 'GGMP-' + '-'.join(parts)


def generate_key_metadata(key, index, server_name):
    """Generate key metadata"""
    now = datetime.now().astimezone().replace(microsecond=0).isoformat()
    
    return {
        'key': key,
        'id': index + 1,
        'serverName': server_name,
        'generated': now,
        'expiresAt': None,  # No expiration for local keys
        'maxPlayers': 2048,
        'features': {
            'customAuth': True,
            'enhancedStreaming': True,
            'unlimitedPlayers': True,
            'premiumPerks': True
        },
        'type': 'GGMP_LOCAL',
        'version': '1.0.0'
    }


def main():
    """Main function"""
    parser = argparse.ArgumentParser(
        description='GGMP Keymaster Key Generator',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python generate-keymaster.py
  python generate-keymaster.py --output server-keys.json
  python generate-keymaster.py --count 5 --name "My GGMP Server"
        """
    )
    
    parser.add_argument('--output', default='keymaster-keys.json',
                        help='Output file for keys (default: keymaster-keys.json)')
    parser.add_argument('--count', type=int, default=1,
                        help='Number of keys to generate (default: 1)')
    parser.add_argument('--name', default='GGMP Server',
                        help='Server name (default: GGMP Server)')
    
    args = parser.parse_args()
    
    print('╔══════════════════════════════════════════╗')
    print('║   GGMP Keymaster Key Generator v1.0      ║')
    print('╚══════════════════════════════════════════╝')
    print()
    
    print(f'Generating {args.count} key(s) for: {args.name}')
    print()
    
    keys = []
    
    for i in range(args.count):
        key = generate_key()
        metadata = generate_key_metadata(key, i, args.name)
        keys.append(metadata)
        
        print(f'✓ Generated key {i + 1}/{args.count}: {key}')
    
    # Save to file
    output = {
        'generator': 'GGMP Keymaster Generator',
        'version': '1.0.0',
        'generated': datetime.now().astimezone().replace(microsecond=0).isoformat(),
        'serverName': args.name,
        'totalKeys': args.count,
        'keys': keys
    }
    
    with open(args.output, 'w') as f:
        json.dump(output, f, indent=2)
    
    print()
    print(f'✓ Keys saved to: {args.output}')
    print()
    print('═══════════════════════════════════════════')
    print('Configuration Instructions:')
    print('═══════════════════════════════════════════')
    print()
    print('Add to your server.cfg:')
    print(f'  set sv_customLicenseKey "{keys[0]["key"]}"')
    print()
    print('Or use environment variable:')
    print(f'  export GGMP_LICENSE_KEY="{keys[0]["key"]}"')
    print()
    print('For multiple servers, use different keys from the generated file.')
    print()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\nAborted by user.')
        sys.exit(1)
    except Exception as e:
        print(f'Error generating keys: {e}', file=sys.stderr)
        sys.exit(1)
