# Stage 1: Build the Next.js app
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all files and build the project
COPY . .
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:20-alpine

WORKDIR /app

# Install necessary dependencies
RUN apk add --no-cache libc6-compat

# Copy the built files from the previous stage
COPY --from=build /app ./

# Expose the port the app runs on
EXPOSE 80

# Start the Next.js app
CMD ["npm", "start"]
