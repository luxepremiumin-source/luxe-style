#! /bin/bash
# Configure Convex Auth environment variables for LUXE PREMIUM.
#
# Usage:
#   ./set-convex-jwt-env.sh                        # production (default)
#   ./set-convex-jwt-env.sh http://localhost:5173  # local dev
#
# Requires an authenticated Convex session, or CONVEX_DEPLOY_KEY targeting the
# deployment you want to configure.
#
# FIXED - this script could not run at all before. Two verified defects:
#
#   1. KEY GENERATION. It called `jwt-keygen` as a bare command, but that is
#      not on PATH, and it is NOT a subcommand of the installed Convex CLI
#      either: `npx convex jwt-keygen` exits 1 with no output on v1.46.0.
#      Key generation is now delegated to the @convex-dev/auth CLI that ships
#      with this project (node_modules/.bin/auth), which creates JWT_PRIVATE_KEY
#      and JWKS and writes them to the target deployment.
#
#   2. SITE_URL. It was hardcoded to http://localhost:5173, so tokens were
#      minted for localhost and email-OTP login failed on the real domain.
#      It now defaults to the production domain and accepts an override.

set -e

SITE_URL="${1:-https://luxepremium.in}"

# Generates JWT_PRIVATE_KEY + JWKS and sets them on the target deployment.
# NOTE: this tool may also add or adjust auth source files. If you only wanted
# the environment variables changed, review your working tree afterwards.
npx auth --skip-git-check

npx convex env set SITE_URL "$SITE_URL"

echo "Auth env configured. SITE_URL=$SITE_URL"
