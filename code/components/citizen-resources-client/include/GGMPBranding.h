#pragma once

/**
 * GGMP Branding Definitions
 * Replaces FiveM/CitizenFX branding with GGMP
 */

#ifndef GGMP_BRANDING_H
#define GGMP_BRANDING_H

// GGMP Product Names
#define GGMP_PRODUCT_NAME "GGMP"
#define GGMP_PRODUCT_FULL_NAME "Game Global Multiplayer Platform"
#define GGMP_PRODUCT_VERSION "1.0.0"

// Window Titles
#define GGMP_WINDOW_TITLE "GGMP - Game Global Multiplayer Platform"
#define GGMP_SERVER_TITLE "GGMP Server"
#define GGMP_CLIENT_TITLE "GGMP Client"

// URLs and Links
#define GGMP_WEBSITE_URL "https://github.com/Snozxyx/fivem"
#define GGMP_DOCUMENTATION_URL "https://github.com/Snozxyx/fivem/blob/master/docs/GGMP.md"
#define GGMP_SUPPORT_URL "https://github.com/Snozxyx/fivem/issues"

// Replace FiveM references
#ifdef GGMP_ENABLED
    #undef PRODUCT_NAME
    #define PRODUCT_NAME "GGMP"
#endif

#endif // GGMP_BRANDING_H
