#pragma once

/**
 * GGMP (Game Global Multiplayer Platform) Configuration
 * Redirects CFX.re endpoints to local GGMP services
 */

#ifndef GGMP_CONFIG_H
#define GGMP_CONFIG_H

// Enable GGMP mode
#define GGMP_ENABLED 1

// GGMP Service Endpoints
#ifndef GGMP_KEYMASTER_URL
#define GGMP_KEYMASTER_URL "http://localhost:3001"
#endif

#ifndef GGMP_POLICY_URL
#define GGMP_POLICY_URL "http://localhost:3002"
#endif

#ifndef GGMP_NUCLEUS_URL
#define GGMP_NUCLEUS_URL "http://localhost:3003"
#endif

// Override CFX.re endpoints with GGMP services
#ifdef GGMP_ENABLED
    #undef POLICY_LIVE_ENDPOINT
    #define POLICY_LIVE_ENDPOINT GGMP_POLICY_URL "/"
    
    #define CFX_KEYMASTER_URL GGMP_KEYMASTER_URL
    #define CFX_NUCLEUS_URL GGMP_NUCLEUS_URL
    #define CFX_POLICY_URL GGMP_POLICY_URL
#endif

// GGMP Platform Info
#define GGMP_VERSION "1.0.0"
#define GGMP_PLATFORM_NAME "GGMP"
#define GGMP_FULL_NAME "Game Global Multiplayer Platform"

// GGMP Features
#define GGMP_MAX_PLAYERS 2048
#define GGMP_STREAMING_MEMORY 0x1200000 // 18MB
#define GGMP_PREMIUM_ENABLED 1

#endif // GGMP_CONFIG_H
