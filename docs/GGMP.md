# GGMP - Game Global Multiplayer Platform

## Overview

**GGMP (Game Global Multiplayer Platform)** is a custom-built modification of FiveM/Cfx.re designed for private and local server deployments with enhanced capabilities and all premium features unlocked.

## What is GGMP?

GGMP is a comprehensive platform that removes all artificial limitations from FiveM, enabling server owners to:

- Host servers with up to 2048 concurrent players
- Use custom authentication systems without external dependencies
- Access all premium features without subscriptions or Patreon
- Stream unlimited custom content (clothing, vehicles, props, maps)
- Deploy completely offline/local server infrastructure

## Key Features

### 🎮 Enhanced Server Capabilities

#### Massive Player Support
- **Maximum Players**: 2048 (vs. 42 in standard FiveM)
- **Memory Optimization**: Efficient client memory management
- **Network Optimization**: Enhanced networking for high player counts
- **OneSync Compatibility**: Full support for OneSync Infinity and Beyond

#### Enhanced Asset Streaming
- **Streaming Memory**: 18MB (vs. 13.5MB standard) - 33% increase
- **Unlimited Clothing**: Stream as many custom clothing items as needed
- **Unlimited Props**: No restrictions on custom prop streaming
- **Custom Maps**: Support for massive custom map modifications

#### All Premium Features Unlocked
- **No Patreon Required**: All features available to everyone
- **No Subscriptions**: One-time setup, no recurring costs
- **All Perks Enabled**: Every premium feature is accessible by default
- **Future-Proof**: No dependency on external authentication services

### 🔐 Custom Authentication System

#### Complete Control
- **Local Authentication**: No internet required for auth
- **Custom Token System**: Implement your own authentication logic
- **Integration Ready**: Easy integration with Discord, databases, or custom systems
- **Multi-Factor Auth**: Support for advanced security features

#### Included Auth Servers
1. **Simple Token-Based**: Quick setup for testing and small servers
2. **JWT-Based**: Production-ready with bcrypt password hashing
3. **Extensible**: Easy to customize and extend

### 🔑 Custom Keymaster System

#### Independent License Management
- **Built-in Key Generator**: Create your own license keys
- **No External Validation**: Keys validated locally
- **Unlimited Keys**: Generate as many keys as needed
- **Flexible Management**: Keys for different servers and purposes

#### Key Generator Scripts
- **Node.js Version**: Cross-platform JavaScript implementation
- **Python Version**: Alternative Python implementation
- **Batch Generation**: Create multiple keys at once
- **Metadata Support**: Keys include feature flags and expiration options

## Architecture

### System Components

```
GGMP Platform
├── Client (Modified FiveM Client)
│   ├── 2048 Player Support
│   ├── Enhanced Streaming
│   ├── Custom Auth Integration
│   └── Premium Features Unlocked
│
├── Server (Modified FiveM Server)
│   ├── High Capacity Support
│   ├── Custom Keymaster
│   ├── Auth System Hooks
│   └── Resource Management
│
├── Authentication System
│   ├── Local Token Validator
│   ├── JWT Support
│   ├── Custom Integration Points
│   └── Role-Based Access Control
│
└── Tools & Scripts
    ├── Keymaster Generator
    ├── Build Scripts
    ├── Configuration Templates
    └── Documentation
```

### Key Modifications

#### 1. Player Limit Enhancement
**File**: `code/components/citizen-server-impl/include/Client.h`
```cpp
constexpr auto MAX_CLIENTS = (2048 + 1);
```

**Impact**:
- Server can handle 2048 concurrent players
- Memory allocation adjusted for large player counts
- Network buffers optimized

#### 2. Streaming Memory Increase
**File**: `code/components/gta-streaming-five/src/UnkStuff.cpp`
```cpp
if (size == 0xD00000) {
    size = 0x1200000;  // 13.5MB → 18MB
}
```

**Impact**:
- 33% more memory for asset streaming
- Reduced pop-in for custom content
- Better performance with many custom assets

#### 3. Premium Features Unlock
**File**: `code/components/glue/src/ConnectToNative.cpp`
```cpp
// GGMP: Enable premium features by default
bool hasEndUserPremium = true;
```

**Impact**:
- All premium UI features enabled
- No Patreon/subscription checks
- Full feature access for everyone

#### 4. Custom Authentication Hooks
**File**: `code/components/net/src/NetLibrary.cpp`
```cpp
// Custom auth interception point
OnInterceptConnectionForAuth(url, licenseKeyToken, callback)
```

**Impact**:
- Complete control over authentication
- Integration with custom systems
- No dependency on Cfx.re infrastructure

## Installation & Setup

### Quick Start

#### Prerequisites
- Windows 10/11 or Linux (Ubuntu 20.04+)
- Visual Studio 2022 (Windows) or GCC/Clang (Linux)
- Python 3.8+
- Node.js 16+ (for auth servers)
- Git with submodule support

#### Windows Build
```cmd
git clone https://github.com/Snozxyx/fivem.git -c core.symlinks=true
cd fivem
git submodule update --jobs=16 --init
pip install setuptools
fxd get-chrome
prebuild
fxd gen -game five
fxd vs -game five
```

Then build in Visual Studio (F7).

#### Linux Server Build
```bash
git clone https://github.com/Snozxyx/fivem.git
cd fivem
git submodule update --init --recursive
cd code
premake5 gmake2 --game=server --cc=clang --dotnet=msnet
cd build/server/linux
make config=release -j$(nproc)
```

### Generate License Keys

```bash
# Using Node.js
cd scripts
node generate-keymaster.js --count 5 --name "My GGMP Server"

# Using Python
python3 generate-keymaster.py --count 5 --name "My GGMP Server"
```

### Configure Server

Create/edit `server.cfg`:
```cfg
# GGMP Server Configuration
sv_hostname "GGMP Server - 2048 Players"
sv_maxclients 256

# OneSync (required for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# GGMP Custom License Key
set sv_customLicenseKey "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX"

# Custom Authentication
set sv_customAuth "enabled"
set sv_authEndpoint "http://localhost:3000/validate"

# Pool sizes for high player counts
set sv_poolSizesIncrease "{\"entities\": 20000, \"props\": 10000}"
```

### Set Up Authentication Server

```bash
cd docs/examples
npm install

# Run simple auth server
npm run start:simple

# Or run JWT auth server
JWT_SECRET="your-secret-key" npm run start:jwt
```

## Configuration

### Server Configuration Options

#### Player Limits
```cfg
sv_maxclients 256        # Active player limit (recommend starting at 256)
set onesync on           # Required for >32 players
set onesync_enableInfinity 1
set onesync_enableBeyond 1
```

#### Memory & Performance
```cfg
# Pool sizes (adjust based on your needs)
set sv_poolSizesIncrease "{\"entities\": 20000, \"props\": 10000}"

# Streaming configuration
set sv_enforceGameBuild ""  # Allow any game build
```

#### Authentication
```cfg
# Custom GGMP license key
set sv_customLicenseKey "GGMP-XXXX-XXXX-XXXX-XXXX-XXXX"

# Custom auth endpoint
set sv_authEndpoint "http://localhost:3000/validate"
set sv_customAuth "enabled"
```

### Authentication Server Configuration

#### Simple Token Auth
```javascript
const validTokens = new Set([
    'token_player1_abc123',
    'token_player2_def456'
]);

// Add/remove tokens as needed
validTokens.add('new_token_here');
```

#### JWT Auth
```javascript
// Environment variables
JWT_SECRET=your-secret-key-change-this
TOKEN_EXPIRY=24h
PORT=3000
```

## Usage Examples

### Example 1: Small Private Server

**Scenario**: Running a private server for friends (10-50 players)

```cfg
# server.cfg
sv_hostname "Private GGMP Server"
sv_maxclients 50

set onesync on
set sv_customLicenseKey "GGMP-1234-5678-90AB-CDEF-1234"
set sv_authEndpoint "http://localhost:3000/validate"
```

```bash
# Generate tokens for friends
node scripts/generate-keymaster.js --count 1
cd docs/examples
node auth-server-simple.js
```

### Example 2: Large Community Server

**Scenario**: Public/community server with 100-500 players

```cfg
# server.cfg
sv_hostname "GGMP Community Server"
sv_maxclients 500

set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

set sv_customLicenseKey "GGMP-ABCD-EFGH-IJKL-MNOP-QRST"
set sv_authEndpoint "https://auth.myserver.com/validate"

# Larger pools
set sv_poolSizesIncrease "{\"entities\": 30000, \"props\": 15000}"
```

```bash
# Use JWT auth with database
cd docs/examples
JWT_SECRET=production-secret npm run start:jwt
```

### Example 3: Massive Roleplay Server

**Scenario**: Large roleplay server with 500-2048 players

```cfg
# server.cfg
sv_hostname "GGMP Roleplay Mega Server"
sv_maxclients 2048

set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

set sv_customLicenseKey "GGMP-RP01-MEGA-SERV-2048-PLAY"
set sv_authEndpoint "https://auth.myserver.com/validate"

# Maximum pools
set sv_poolSizesIncrease "{\"entities\": 50000, \"props\": 25000, \"vehicles\": 10000}"

# Performance tuning
set sv_scriptHookAllowed 0
set sv_endpointprivacy true
```

## Best Practices

### Performance Optimization

1. **Start Small**: Begin with 256 players, scale up gradually
2. **Monitor Resources**: Use server monitoring tools
3. **Optimize Scripts**: Review resource scripts for performance
4. **Database Tuning**: Optimize database queries for high player counts
5. **Network**: Use dedicated server with high bandwidth

### Security Considerations

1. **Change Default Keys**: Always generate new license keys
2. **Use HTTPS**: Enable SSL for authentication endpoints
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Input Validation**: Validate all user inputs
5. **Regular Updates**: Keep GGMP and dependencies updated

### Scaling Guidelines

| Players | Recommended Specs | Network |
|---------|------------------|---------|
| 0-100 | 4 CPU, 8GB RAM | 100Mbps |
| 100-500 | 8 CPU, 16GB RAM | 500Mbps |
| 500-1000 | 16 CPU, 32GB RAM | 1Gbps |
| 1000-2048 | 32 CPU, 64GB RAM | 10Gbps |

## Troubleshooting

### Common Issues

#### Build Fails
**Problem**: Visual Studio build fails
**Solution**: 
```cmd
prebuild
fxd gen -game five
# Reopen Visual Studio
```

#### Server Crashes with Many Players
**Problem**: Server crashes at 100+ players
**Solution**:
- Enable OneSync
- Increase pool sizes
- Check system resources
- Review resource scripts

#### Authentication Not Working
**Problem**: Players can't connect
**Solution**:
- Verify auth server is running
- Check endpoint URL in server.cfg
- Test auth endpoint with curl
- Review auth server logs

#### Streaming Issues
**Problem**: Assets not loading properly
**Solution**:
- Verify 18MB streaming patch applied
- Check asset sizes
- Review streaming manifest
- Test with fewer assets first

## Advanced Topics

### Custom Authentication Integration

#### Integrating with Discord
```javascript
const { Client } = require('discord.js');

async function verifyDiscordMember(discordId) {
    const guild = client.guilds.cache.get('YOUR_GUILD_ID');
    const member = await guild.members.fetch(discordId);
    return member && member.roles.cache.has('ROLE_ID');
}
```

#### Database Integration
```javascript
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function validateToken(token) {
    const result = await pool.query(
        'SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()',
        [token]
    );
    return result.rows[0];
}
```

### Extending the Build

#### Adding Custom Features
1. Modify source code in `code/components/`
2. Update build configuration
3. Rebuild project
4. Test changes thoroughly

#### Creating Custom Resources
1. Use GGMP's enhanced capabilities
2. Design for high player counts
3. Optimize for performance
4. Test at scale

## Community & Support

### Getting Help

1. **Documentation**: Start with the docs
2. **Examples**: Review example configurations
3. **Issues**: Check GitHub issues
4. **Community**: Join FiveM forums

### Contributing

Contributions are welcome! Please:
1. Read the documentation
2. Check existing issues
3. Follow coding standards
4. Update documentation
5. Test thoroughly
6. Submit pull request

### Reporting Issues

When reporting issues, include:
- GGMP version
- System information
- Configuration files
- Error messages
- Steps to reproduce
- Expected vs. actual behavior

## Legal & Licensing

### License

GGMP is based on Cfx.re (FiveM) and maintains the same license terms. See [code/LICENSE](../code/LICENSE) for details.

### Usage Terms

GGMP is designed for:
- ✅ Local network testing
- ✅ Private/whitelisted servers
- ✅ Development environments
- ✅ Educational purposes

NOT recommended for:
- ❌ Public servers (without security review)
- ❌ Commercial services (without proper licensing)
- ❌ Servers accessible to untrusted users

### Disclaimer

GGMP removes limitations from FiveM for legitimate local/private use. Users are responsible for compliance with:
- Cfx.re terms of service
- Rockstar Games terms
- Local laws and regulations
- Server hosting agreements

## Roadmap

### Planned Features

- [ ] Enhanced admin tools
- [ ] Built-in monitoring dashboard
- [ ] Automatic scaling helpers
- [ ] Advanced security features
- [ ] Performance profiling tools
- [ ] Docker container support

### Version History

**Version 1.0.0** (Current)
- 2048 player support
- 18MB streaming memory
- Custom authentication system
- Custom keymaster
- All premium features unlocked
- Complete documentation
- Example configurations
- Build automation

## Additional Resources

### Documentation
- [Main Documentation](../CUSTOM_BUILD.md)
- [Quick Start Guide](quick-start-guide.md)
- [Custom Modifications](custom-modifications.md)
- [Technical Details](MODIFICATIONS.md)
- [Architecture](ARCHITECTURE.md)

### Tools
- [Keymaster Generator](../scripts/generate-keymaster.js)
- [Auth Server Examples](examples/)
- [Build Scripts](../.github/workflows/)

### External Resources
- [FiveM Documentation](https://docs.fivem.net/)
- [FiveM Forums](https://forum.cfx.re/)
- [OneSync Documentation](https://docs.fivem.net/docs/scripting-manual/onesync/)
- [Native Reference](https://docs.fivem.net/natives/)

---

**GGMP - Game Global Multiplayer Platform**  
*Empowering server owners with unlimited possibilities*

For questions, issues, or contributions, visit: https://github.com/Snozxyx/fivem
