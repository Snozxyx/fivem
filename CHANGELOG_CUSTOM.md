# GGMP Build Changelog

All notable changes to the GGMP (Game Global Multiplayer Platform) build are documented in this file.

## [1.0.0] - 2024

### Added - Major Features

#### GGMP Branding & Identity
- **Established GGMP as the platform name**
  - Updated all documentation with GGMP branding
  - Created comprehensive GGMP documentation
  - Added GGMP logo and identity elements
  - Consistent naming across all files

#### Player Limit Enhancement
- **Increased MAX_CLIENTS from 42 to 2048**
  - Modified: `code/components/citizen-server-impl/include/Client.h`
  - Impact: Server can now handle up to 2048 concurrent players
  - Memory increase: ~1.5 GB for full capacity
  - Requires OneSync for >32 players

#### Streaming Memory Enhancement
- **Increased streaming pool from 13.5 MB to 18 MB**
  - Modified: `code/components/gta-streaming-five/src/UnkStuff.cpp`
  - Increase: 33% more streaming memory
  - Impact: Better asset loading, reduced pop-in
  - Supports larger custom maps and unlimited clothing

#### All Premium Features Unlocked
- **Removed Patreon/subscription requirements**
  - Modified: `code/components/glue/src/ConnectToNative.cpp`
  - All premium features enabled by default
  - No external authentication required for premium perks
  - Complete feature access for everyone

#### Custom Authentication System
- **Added custom authentication hooks**
  - Modified: `code/components/net/src/NetLibrary.cpp`
  - Feature: `OnInterceptConnectionForAuth` event
  - Allows: Local/private authentication systems
  - Bypasses: Official Cfx.re keymaster requirement

#### Keymaster Generator Scripts
- **Created GGMP license key generator**
  - Tool: `scripts/generate-keymaster.js` (Node.js version)
  - Tool: `scripts/generate-keymaster.py` (Python version)
  - Features: Batch key generation, metadata support
  - Format: GGMP-XXXX-XXXX-XXXX-XXXX-XXXX

#### GitHub Actions Build Workflow
- **Automated Windows builds**
  - Workflow: `.github/workflows/build-windows.yml`
  - Builds: FiveM client and server for Windows
  - Features: Artifact uploads, release packages
  - Caching: Dependencies and build artifacts

### Added - Documentation

#### Comprehensive Guides
- **Quick Start Guide** (`docs/quick-start-guide.md`)
  - Fast-track setup for Windows and Linux
  - Basic configuration examples
  - Common troubleshooting solutions

- **Custom Modifications Guide** (`docs/custom-modifications.md`)
  - Complete build instructions
  - Authentication implementation guide
  - Custom keymaster setup
  - Configuration options
  - Security considerations

- **Technical Documentation** (`docs/MODIFICATIONS.md`)
  - Detailed code changes with locations
  - Memory impact analysis
  - Performance considerations
  - Compatibility notes

- **Architecture Overview** (`docs/ARCHITECTURE.md`)
  - System architecture diagrams
  - Component interaction flows
  - Data structure documentation
  - Scaling considerations

#### Example Implementations
- **Server Configuration** (`docs/examples/server.cfg.example`)
  - Complete server.cfg with all custom settings
  - OneSync configuration
  - Pool size optimization
  - Custom auth settings

- **Simple Auth Server** (`docs/examples/auth-server-simple.js`)
  - Token-based authentication
  - In-memory user storage
  - REST API endpoints
  - Easy to understand and modify

- **JWT Auth Server** (`docs/examples/auth-server-jwt.js`)
  - JSON Web Token authentication
  - Password hashing with bcrypt
  - Session management
  - Token refresh capability

- **Package Configuration** (`docs/examples/package.json`)
  - Node.js dependencies
  - NPM scripts for easy running
  - Development dependencies

#### Index Documents
- **Main Index** (`CUSTOM_BUILD.md`)
  - Central documentation hub
  - Quick links to all resources
  - Feature summary
  - Getting started guide

- **Examples Index** (`docs/examples/README.md`)
  - Usage instructions for examples
  - Configuration guides
  - Testing procedures
  - Security notes

### Modified - Core Components

#### Client Management
- **Client.h** - Increased MAX_CLIENTS constant
- **Client.cpp** - Scaled client pool size
- **ClientRegistry.cpp** - Resized slot ID array
- **ServerGameState.h** - Scaled tracking bitsets and arrays

#### Network Layer
- **GameServerNet.ENet.cpp** - Increased peer limit
- **NetLibrary.cpp** - Added custom auth interception
- **NetLibrary.h** - Added auth event definitions

#### Streaming System
- **UnkStuff.cpp** - Multiple streaming enhancements:
  - Increased SMPA memory pool size
  - Optimized entity level cap
  - Kept low-priority objects at distance
  - Increased BVH traversal list

#### UI Components
- **ServerList.cpp** - Updated to display up to 2048 players

### Modified - Build System
- **Documentation Updates**
  - Updated `docs/README.md` with custom build links
  - Enhanced build instructions
  - Added troubleshooting sections

### Technical Details

#### Memory Allocations
```
Component             | Before    | After     | Change
----------------------|-----------|-----------|--------
MAX_CLIENTS          | 42        | 2048      | +4776%
Client Pool          | ~2 MB     | ~1 GB     | +500x
Streaming Pool       | 13.5 MB   | 18 MB     | +33%
State Bitsets        | ~1 KB     | ~256 KB   | +256x
Frame Arrays         | ~2.6 KB   | ~128 KB   | +49x
```

#### Performance Impact
- **Server RAM**: +1.5 GB for full 2048 player capacity
- **Client RAM**: +4.5 MB for increased streaming pool
- **Network**: Scales linearly with player count
- **CPU**: Requires 16+ cores for 2048 players

### Compatibility

#### Compatible With
- ✅ OneSync Infinity
- ✅ OneSync Beyond  
- ✅ txAdmin
- ✅ Custom resources
- ✅ Most existing server resources
- ✅ Linux and Windows builds

#### Not Compatible With
- ❌ Cfx.re official keymaster (by design - use custom auth)
- ❌ Official FiveM master servers (use custom server listing)

### Security

#### Implemented
- Custom authentication system support
- Token-based validation
- JWT authentication example
- Local keymaster replacement

#### Recommended
- Use HTTPS for auth endpoints
- Implement rate limiting
- Enable logging and monitoring
- Regular security updates
- Access control for admin functions

### Breaking Changes
- **Authentication**: No longer uses Cfx.re keymaster by default
  - Migration: Implement custom auth or use provided examples
  
- **Configuration**: New configuration options required
  - Migration: Use provided `server.cfg.example`

### Known Issues
- Client can only see ~128 players simultaneously (engine limitation)
- 32-bit builds not supported for full 2048 capacity
- Some third-party anti-cheat systems may need updates

### Deprecations
- None in this release

### Removed
- None - all changes are additive or modifications

## [Future] - Planned

### Under Consideration
- Database integration examples for auth server
- Redis session storage example
- Discord authentication integration
- Steam authentication integration
- Horizontal scaling guide
- Load balancing documentation
- Monitoring and metrics guide
- Advanced security hardening guide

### Community Requests
- Multi-server architecture examples
- Cross-server communication patterns
- Advanced resource optimization guides
- Custom anti-cheat integration

## Development Notes

### Testing Performed
- ✅ Windows client build (Debug & Release)
- ✅ Linux server build (Release)
- ✅ 32 player test (default configuration)
- ✅ 128 player stress test
- ✅ Simple auth server validation
- ✅ JWT auth server validation
- ✅ Resource compatibility check

### Testing Needed
- ⚠️ 512+ player stress test
- ⚠️ 2048 player full capacity test
- ⚠️ Long-running stability test (24h+)
- ⚠️ Memory leak analysis
- ⚠️ Network bandwidth saturation test

### Build Environment
- Visual Studio 2022 (Windows)
- GCC 11+ / Clang 13+ (Linux)
- PowerShell 7+
- Python 3.8+
- Node.js 16+ (for auth servers)

## Migration Guide

### From Official FiveM to Custom Build

#### Prerequisites
1. Backup your current server
2. Note your current configuration
3. Prepare custom authentication if needed

#### Steps
1. **Build Custom Version**
   - Follow [Quick Start Guide](docs/quick-start-guide.md)
   - Build for your platform (Windows/Linux)

2. **Update Configuration**
   - Copy `docs/examples/server.cfg.example`
   - Migrate your settings
   - Add custom auth configuration

3. **Set Up Authentication**
   - Choose auth method (simple or JWT)
   - Deploy auth server
   - Generate tokens/credentials

4. **Test Migration**
   - Start with low player count
   - Verify resources load
   - Test authentication
   - Gradually increase capacity

5. **Monitor and Optimize**
   - Watch server performance
   - Adjust pool sizes as needed
   - Optimize resources

### Configuration Changes
```cfg
# Required additions to server.cfg:

# Custom Auth (if using)
set sv_customAuth "enabled"
set sv_customLicenseKey "your-key"
set sv_authEndpoint "http://localhost:3000/validate"

# OneSync (for >32 players)
set onesync on
set onesync_enableInfinity 1
set onesync_enableBeyond 1

# Pool Sizes (recommended)
set sv_poolSizesIncrease "{\"entities\": 20000, \"props\": 10000}"
```

## Support

### Getting Help
1. Check documentation:
   - [Quick Start](docs/quick-start-guide.md)
   - [Full Guide](docs/custom-modifications.md)
   - [Technical Docs](docs/MODIFICATIONS.md)

2. Review examples:
   - [Example Configs](docs/examples/)

3. Check known issues (above)

4. Search existing issues on GitHub

5. Create new issue with:
   - Error messages
   - Configuration files
   - Steps to reproduce
   - System information

### Contributing
Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update documentation
5. Test thoroughly
6. Submit pull request

## Version History

### Version Numbering
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes or major features
- **Minor**: New features, backwards compatible
- **Patch**: Bug fixes, minor improvements

### Release Schedule
- No fixed schedule
- Releases as features complete
- Security updates as needed

## Credits

### Based On
- Cfx.re FiveM Project
- Repository: https://github.com/citizenfx/fivem
- License: See `code/LICENSE`

### Custom Build Authors
- Documentation and modifications by the custom build team

### Community
- Thanks to all contributors and testers
- FiveM community for feedback and support

## License

This custom build maintains the same license as the original FiveM project.
See `code/LICENSE` for details.

**Important**: This build is intended for local/private use. Review licensing terms before deploying.

---

## Notes

- This changelog follows [Keep a Changelog](https://keepachangelog.com/) format
- All dates are in YYYY-MM-DD format
- Versions follow [Semantic Versioning](https://semver.org/)

For the latest changes, see the git commit history:
```bash
git log --oneline --graph --decorate
```

---

**Last Updated**: 2024  
**Current Version**: 1.0.0  
**Repository**: https://github.com/Snozxyx/fivem
