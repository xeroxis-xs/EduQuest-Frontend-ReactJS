#!/bin/sh

echo "Starting entrypoint script..."

# Check environment variables
echo "Checking environment variables..."
[ -z "$NEXT_PUBLIC_AZURE_CLIENT_ID" ] && echo "NEXT_PUBLIC_AZURE_CLIENT_ID is not set" && exit 1
[ -z "$NEXT_PUBLIC_AZURE_REDIRECT_URI" ] && echo "NEXT_PUBLIC_AZURE_REDIRECT_URI is not set" && exit 1
[ -z "$NEXT_PUBLIC_SITE_URL" ] && echo "NEXT_PUBLIC_SITE_URL is not set" && exit 1
[ -z "$NEXT_PUBLIC_BACKEND_URL" ] && echo "NEXT_PUBLIC_BACKEND_URL is not set" && exit 1
[ -z "$NEXT_PUBLIC_MICROSERVICE_URL" ] && echo "NEXT_PUBLIC_MICROSERVICE_URL is not set" && exit 1
[ -z "$NEXT_PUBLIC_LOGIN_REQUEST_SCOPE" ] && echo "NEXT_PUBLIC_LOGIN_REQUEST_SCOPE is not set" && exit 1

echo "All required environment variables are set."

# Replace placeholders in .next files
echo "Replacing placeholders in .next files..."
# Add your placeholder replacement logic here

# Execute the main command
echo "Executing command: npm start"
exec npm start
