# Custom FiveM Build - Architecture Overview

This document provides a high-level architectural overview of the custom FiveM build modifications.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FiveM Client                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐   │
│  │  Game Engine │  │   Streaming  │  │  Network Layer    │   │
│  │              │  │   (18MB Pool)│  │  (Auth Token)     │   │
│  └──────────────┘  └──────────────┘  └────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ Connection Request
                                │ + Auth Token
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FiveM Server                               │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Connection Handler (NetLibrary)                       │    │
│  │  • Intercepts auth requests                            │    │
│  │  • OnInterceptConnectionForAuth event                  │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                        │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Custom Auth Handler                                   │    │
│  │  • Validates token via HTTP                            │    │
│  │  • Returns user info                                   │    │
│  └──────────────────────┬─────────────────────────────────┘    │
│                         │                                        │
│                         │ HTTP POST /validate                    │
│                         ▼                                        │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Client Registry (2048 slots)                          │    │
│  │  • Manages up to 2048 concurrent clients               │    │
│  │  • Slot assignment and tracking                        │    │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Game State Management                                  │    │
│  │  • ServerGameState (2048 client bitsets)               │    │
│  │  • Entity synchronization                              │    │
│  │  • OneSync integration                                 │    │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
                           │ Token Validation
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Custom Auth Server                             │
│                   (Node.js/Express)                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Authentication Endpoint                                │    │
│  │  POST /validate                                         │    │
│  │  • Validates JWT or simple tokens                      │    │
│  │  • Returns user metadata                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  User Management                                        │    │
│  │  • User database (or in-memory)                        │    │
│  │  • Token generation                                    │    │
│  │  • Session management                                  │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

## Component Interaction Flow

### 1. Player Connection Flow

```
Player          FiveM Client    FiveM Server    Auth Server
  │                  │                │              │
  │  Launch Game     │                │              │
  ├─────────────────►│                │              │
  │                  │                │              │
  │  Connect to      │                │              │
  │  Server          │                │              │
  ├─────────────────►│                │              │
  │                  │                │              │
  │                  │  Connection    │              │
  │                  │  Request       │              │
  │                  │  + Auth Token  │              │
  │                  ├───────────────►│              │
  │                  │                │              │
  │                  │                │  Validate    │
  │                  │                │  Token       │
  │                  │                ├─────────────►│
  │                  │                │              │
  │                  │                │  User Info   │
  │                  │                │◄─────────────┤
  │                  │                │              │
  │                  │  Connection    │              │
  │                  │  Accepted      │              │
  │                  │◄───────────────┤              │
  │                  │                │              │
  │  In Game         │                │              │
  │◄─────────────────┤                │              │
  │                  │                │              │
```

### 2. Streaming Memory Management

```
Game Request           Streaming System         Memory Pool
     │                       │                       │
     │  Load Asset           │                       │
     ├──────────────────────►│                       │
     │                       │                       │
     │                       │  Check Available      │
     │                       │  Memory (18MB Pool)   │
     │                       ├──────────────────────►│
     │                       │                       │
     │                       │  Allocate (18MB)      │
     │                       │◄──────────────────────┤
     │                       │                       │
     │  Asset Loaded         │                       │
     │◄──────────────────────┤                       │
     │                       │                       │
```

### 3. Multi-Client State Management

```
                    Server Game State
                  (2048 Client Tracking)
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Client 1 │    │ Client 2 │    │Client 2048│
    │ Bitset   │    │ Bitset   │    │ Bitset   │
    │          │    │          │    │          │
    │ Relevant │    │ Relevant │    │ Relevant │
    │ Entities │    │ Entities │    │ Entities │
    └──────────┘    └──────────┘    └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                    Entity Pool
                 (20,000+ entities)
```

## Data Structures

### Client Pool Structure

```cpp
// Size: 512 * MAX_CLIENTS objects
object_pool<Client, 512 * 2049> clientPool;

Client {
    uint16_t netId;           // Network ID (0-2048)
    uint16_t slotId;          // Slot ID (0-2048)
    std::string name;         // Player name
    NetAddress address;       // Network address
    // ... more fields
}
```

### Server Game State Structure

```cpp
ServerGameState {
    // Per-client tracking (2048 bits each)
    eastl::bitset<2049> relevantTo;      // Entities relevant to client
    eastl::bitset<2049> deletedFor;      // Entities deleted for client
    eastl::bitset<2049> outOfScopeFor;   // Entities out of scope
    
    // Frame tracking (2048 entries)
    std::array<uint64_t, 2049> lastFramesSent;
    
    // Grid state (2048 entries)
    WorldGridState state[2049];
}
```

### Streaming Memory Pool

```cpp
// Original size: 0xD00000 (13,631,488 bytes)
// Modified size: 0x1200000 (18,874,368 bytes)

StreamingPool {
    void* baseAddress;     // Pool base address
    size_t size;           // 18,874,368 bytes
    size_t used;           // Currently used
    size_t available;      // Available space
    
    // Asset tracking
    std::vector<Asset*> loadedAssets;
}
```

## Memory Layout

### Server Memory Distribution (2048 Players)

```
Total Server Memory: ~16-32 GB
├─ Client Objects: ~1 GB
│  ├─ Client pool (512 * 2049 objects)
│  └─ Client metadata
│
├─ Game State: ~4 GB
│  ├─ Entity tracking bitsets (2049 * 256 bytes each)
│  ├─ Frame tracking (2049 * 8 bytes)
│  └─ World grid state (2049 * varies)
│
├─ Network Buffers: ~2 GB
│  ├─ Receive buffers (per client)
│  └─ Send buffers (per client)
│
├─ Entity Pool: ~8 GB
│  ├─ 20,000+ entities
│  ├─ Props (10,000+)
│  ├─ Vehicles (5,000+)
│  └─ Peds (5,000+)
│
└─ Other: ~4 GB
   ├─ Resource scripts
   ├─ Streaming cache
   └─ System overhead
```

### Client Memory (Per Instance)

```
Total Client Memory: ~4-8 GB
├─ Streaming Pool: 18 MB (increased)
│  └─ Asset cache
│
├─ Game Engine: ~3 GB
│  ├─ Textures
│  ├─ Models
│  └─ Scripts
│
├─ Network: ~50 MB
│  └─ Buffers
│
└─ Other: ~1 GB
   ├─ UI
   ├─ Audio
   └─ Resources
```

## Authentication Flow Detail

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication System                      │
└──────────────────────────────────────────────────────────────┘

1. Client Connection Initiation
   │
   ├─► NetLibrary::ConnectToServer()
   │   │
   │   ├─► Prepare connection data
   │   │   ├─ GUID
   │   │   ├─ Game build
   │   │   └─ Auth token (custom)
   │   │
   │   └─► Fire OnInterceptConnectionForAuth event
   │
   ▼

2. Custom Auth Handler
   │
   ├─► Intercept auth event
   │   │
   │   ├─► Extract token from request
   │   │
   │   └─► HTTP POST to auth server
   │       URL: sv_authEndpoint
   │       Body: { "customAuthToken": "..." }
   │
   ▼

3. Auth Server Processing
   │
   ├─► Receive validation request
   │   │
   │   ├─► Validate token
   │   │   ├─ Simple: Check in token list
   │   │   └─ JWT: Verify signature + expiration
   │   │
   │   └─► Return user data
   │       {
   │         "success": true/false,
   │         "userId": "...",
   │         "username": "...",
   │         "roles": [...]
   │       }
   │
   ▼

4. Connection Completion
   │
   ├─► Server receives auth result
   │   │
   │   ├─► If success:
   │   │   ├─ Allocate client slot (from 2048 pool)
   │   │   ├─ Initialize client object
   │   │   └─ Send connection OK
   │   │
   │   └─► If failure:
   │       └─ Reject connection with error
   │
   ▼

5. Client In-Game
    │
    └─► Player active
        ├─ State synchronized
        ├─ Entity streaming
        └─ Resource execution
```

## Network Architecture

### Connection Management

```
ENet Network Layer
├─ Host Configuration
│  ├─ Max peers: 2048 + 32 = 2080
│  ├─ Channel count: 2
│  └─ Bandwidth: Unlimited (0)
│
├─ Per-Client Channels
│  ├─ Channel 0: Reliable (game state)
│  └─ Channel 1: Unreliable (position updates)
│
└─ Packet Processing
   ├─ Receive queue (per client)
   ├─ Send queue (per client)
   └─ Rate limiting (configurable)
```

### OneSync Integration

```
OneSync System (Required for >32 players)
├─ Server-Authoritative
│  ├─ Entity ownership tracking
│  ├─ State synchronization
│  └─ Physics simulation
│
├─ Infinity Mode
│  ├─ Dynamic entity streaming
│  ├─ Distance-based culling
│  └─ Priority queuing
│
└─ Beyond Mode
   ├─ Extended range
   ├─ More simultaneous entities
   └─ Enhanced performance
```

## Build System Architecture

```
Build Process
├─ Windows (Visual Studio)
│  ├─ premake5 gmake2 --game=five
│  ├─ VS Solution generation
│  └─ MSBuild compilation
│
├─ Linux (Make)
│  ├─ premake5 gmake2 --game=server
│  ├─ Makefile generation
│  └─ GCC/Clang compilation
│
└─ Output
   ├─ FiveM.exe (Windows client)
   ├─ FXServer (Linux server)
   └─ Component DLLs/SOs
```

## Scaling Considerations

### Vertical Scaling (Single Server)

```
Player Count  │ CPU Cores │ RAM   │ Network    │ Notes
──────────────┼───────────┼───────┼────────────┼──────────────
32 players    │ 2-4       │ 2 GB  │ 10 Mbps    │ Baseline
128 players   │ 4-6       │ 4 GB  │ 40 Mbps    │ Recommended OneSync
512 players   │ 8-12      │ 8 GB  │ 160 Mbps   │ Requires optimization
2048 players  │ 16-32     │ 16 GB │ 640 Mbps   │ High-end hardware
```

### Horizontal Scaling (Multiple Servers)

```
Not directly supported - FiveM servers are independent instances.
For multi-server setups:
├─ Use separate server instances per game mode/world
├─ Implement custom cross-server communication
└─ Shared authentication database
```

## Performance Optimization Points

### 1. Client Pool
- Pre-allocated: O(1) slot assignment
- Lock-free reads where possible
- Write-once client data structures

### 2. Entity Synchronization
- Bitset operations: O(1) relevancy checks
- Spatial indexing: O(log n) entity queries
- Distance culling: Reduces sync overhead

### 3. Network
- Packet batching: Reduces overhead
- Compression: Saves bandwidth
- Priority queues: Critical data first

### 4. Streaming
- Increased pool: Fewer reloads
- Predictive loading: Reduces hitches
- LRU caching: Efficient memory use

## Extension Points

### Custom Authentication
```cpp
// Hook: OnInterceptConnectionForAuth
NetLibrary::OnInterceptConnectionForAuth.Connect([](
    const std::string& url,
    const std::string& token,
    std::function<void(bool, std::map<std::string, std::string>&)> callback)
{
    // Custom validation logic
    // Return via callback
});
```

### Custom Commands
```cpp
// Register server command
fx::ScriptEngine::RegisterNativeHandler("CUSTOM_COMMAND", [](fx::ScriptContext& ctx)
{
    // Command implementation
});
```

### Resource Hooks
```lua
-- Server-side Lua
AddEventHandler('playerConnecting', function(name, setKickReason, deferrals)
    -- Custom connection logic
end)
```

## Security Architecture

```
Security Layers
├─ Network Layer
│  ├─ Connection throttling
│  ├─ DDoS protection
│  └─ Rate limiting
│
├─ Authentication Layer
│  ├─ Token validation
│  ├─ Session management
│  └─ Permission checks
│
├─ Application Layer
│  ├─ Input validation
│  ├─ Resource sandboxing
│  └─ Anti-cheat integration
│
└─ System Layer
   ├─ Process isolation
   ├─ File system access control
   └─ Network firewall
```

## Monitoring Points

```
Key Metrics to Monitor
├─ Server Metrics
│  ├─ Active clients: 0-2048
│  ├─ CPU usage: Target <80%
│  ├─ Memory usage: Target <80%
│  └─ Network bandwidth: Monitor saturation
│
├─ Game State Metrics
│  ├─ Entity count: Monitor pool usage
│  ├─ Sync latency: Target <50ms
│  └─ Frame time: Target <16ms
│
└─ Auth Metrics
   ├─ Validation time: Target <100ms
   ├─ Success rate: Target >95%
   └─ Error rate: Monitor failures
```

---

**For more details, see:**
- [Technical Modifications](MODIFICATIONS.md)
- [Custom Build Guide](custom-modifications.md)
- [Quick Start](quick-start-guide.md)
