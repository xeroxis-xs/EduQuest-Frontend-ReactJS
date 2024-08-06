#!/bin/sh
test -n "$NEXT_PUBLIC_AZURE_CLIENT_ID"
test -n "$NEXT_PUBLIC_AZURE_REDIRECT_URI"
test -n "$NEXT_PUBLIC_SITE_URL"
test -n "$NEXT_PUBLIC_BACKEND_URL"
test -n "$NEXT_PUBLIC_MICROSERVICE_URL"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_AZURE_CLIENT_ID#$NEXT_PUBLIC_AZURE_CLIENT_ID#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_AZURE_REDIRECT_URI#$NEXT_PUBLIC_AZURE_REDIRECT_URI#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_SITE_URL#$NEXT_PUBLIC_SITE_URL#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_BACKEND_URL#$NEXT_PUBLIC_BACKEND_URL#g"
find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#PLACEHOLDER_NEXT_PUBLIC_MICROSERVICE_URL#$NEXT_PUBLIC_MICROSERVICE_URL#g"
exec "$@"
