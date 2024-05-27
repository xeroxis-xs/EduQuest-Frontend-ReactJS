#!/bin/sh
test -n "$NEXT_PUBLIC_AZURE_CLIENT_ID"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_AZURE_CLIENT_ID#$NEXT_PUBLIC_AZURE_CLIENT_ID#g"
exec "$@"