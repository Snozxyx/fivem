# GGMP Scripts and Tools

This directory contains utility scripts and tools for GGMP server management.

## Keymaster Generator

Generate custom license keys for GGMP servers.

### Node.js Version

**Usage:**
```bash
node generate-keymaster.js [options]
```

**Options:**
- `--output <file>` - Output file for keys (default: keymaster-keys.json)
- `--count <number>` - Number of keys to generate (default: 1)
- `--name <name>` - Server name (default: GGMP Server)
- `--help, -h` - Show help message

**Examples:**
```bash
# Generate a single key
node generate-keymaster.js

# Generate 5 keys for a specific server
node generate-keymaster.js --count 5 --name "My GGMP Server"

# Save to custom file
node generate-keymaster.js --output my-keys.json --count 10
```

### Python Version

**Usage:**
```bash
python3 generate-keymaster.py [options]
```

**Options:**
- `--output <file>` - Output file for keys (default: keymaster-keys.json)
- `--count <number>` - Number of keys to generate (default: 1)
- `--name <name>` - Server name (default: GGMP Server)

**Examples:**
```bash
# Generate a single key
python3 generate-keymaster.py

# Generate 5 keys for a specific server
python3 generate-keymaster.py --count 5 --name "My GGMP Server"
```

## Key Format

Generated keys follow this format:
```
GGMP-XXXX-XXXX-XXXX-XXXX-XXXX
```

Where each X is a hexadecimal character (0-9, A-F).

## Output Format

Keys are saved in JSON format:

```json
{
  "generator": "GGMP Keymaster Generator",
  "version": "1.0.0",
  "generated": "2024-01-01T12:00:00Z",
  "serverName": "GGMP Server",
  "totalKeys": 3,
  "keys": [
    {
      "key": "GGMP-1234-5678-90AB-CDEF-1234",
      "id": 1,
      "serverName": "GGMP Server",
      "generated": "2024-01-01T12:00:00Z",
      "expiresAt": null,
      "maxPlayers": 2048,
      "features": {
        "customAuth": true,
        "enhancedStreaming": true,
        "unlimitedPlayers": true,
        "premiumPerks": true
      },
      "type": "GGMP_LOCAL",
      "version": "1.0.0"
    }
  ]
}
```

## Using Generated Keys

### In server.cfg

```cfg
set sv_customLicenseKey "GGMP-1234-5678-90AB-CDEF-1234"
```

### As Environment Variable

**Windows:**
```cmd
set GGMP_LICENSE_KEY=GGMP-1234-5678-90AB-CDEF-1234
```

**Linux/macOS:**
```bash
export GGMP_LICENSE_KEY="GGMP-1234-5678-90AB-CDEF-1234"
```

## Key Management Best Practices

1. **Generate Unique Keys**: Use different keys for different servers
2. **Keep Keys Secure**: Don't share keys publicly
3. **Backup Keys**: Save the JSON file in a secure location
4. **Regenerate if Compromised**: Generate new keys if security is compromised
5. **Document Usage**: Keep track of which keys are used for which servers

## Troubleshooting

### Node.js Script Issues

**Problem:** `node: command not found`
**Solution:** Install Node.js from https://nodejs.org/

**Problem:** Permission denied
**Solution:** 
```bash
chmod +x generate-keymaster.js
# Or run with node directly
node generate-keymaster.js
```

### Python Script Issues

**Problem:** `python3: command not found`
**Solution:** Install Python 3.8+ from https://python.org/

**Problem:** Permission denied
**Solution:**
```bash
chmod +x generate-keymaster.py
# Or run with python3 directly
python3 generate-keymaster.py
```

## Additional Tools

More tools will be added to this directory in future updates:
- Server management scripts
- Configuration validators
- Performance monitoring tools
- Database migration scripts
- Backup utilities

## Contributing

If you've created useful scripts for GGMP, consider contributing them:

1. Ensure scripts are well-documented
2. Include error handling
3. Add usage examples
4. Test thoroughly
5. Submit a pull request

## Support

For help with these scripts:
1. Check the documentation
2. Review the examples
3. Check GitHub issues
4. Create a new issue if needed

---

**GGMP Scripts & Tools**  
Version 1.0.0  
https://github.com/Snozxyx/fivem
