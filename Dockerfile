## Stage 1: Build the Next.js app
#FROM node:20-alpine AS build
#
#WORKDIR /app
#
## Install dependencies
#COPY package.json package-lock.json ./
#RUN npm install
#
## Copy all files and build the project
#COPY . .
#
##ARG NEXT_PUBLIC_SITE_URL
##ARG NEXT_PUBLIC_AZURE_CLIENT_ID
##ARG NEXT_PUBLIC_AZURE_REDIRECT_URI
##ARG NEXT_PUBLIC_BACKEND_URL
##ARG NEXT_PUBLIC_MICROSERVICE_URL
##ARG NEXT_PUBLIC_LOGIN_REQUEST_SCOPE
##
##ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
##    NEXT_PUBLIC_AZURE_CLIENT_ID=$NEXT_PUBLIC_AZURE_CLIENT_ID \
##    NEXT_PUBLIC_AZURE_REDIRECT_URI=$NEXT_PUBLIC_AZURE_REDIRECT_URI \
##    NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL \
##    NEXT_PUBLIC_MICROSERVICE_URL=$NEXT_PUBLIC_MICROSERVICE_URL \
##    NEXT_PUBLIC_LOGIN_REQUEST_SCOPE=$NEXT_PUBLIC_LOGIN_REQUEST_SCOPE
#
## Temporary set the env variables and Build the project
#RUN npm run build
## Stage 2: Run the Next.js app
#FROM node:20-alpine
#
#WORKDIR /app
#
## Install necessary dependencies
#RUN apk add --no-cache libc6-compat
#
## Copy the built files from the previous stage
#COPY --from=build /app ./
#
## Expose the port the app runs on
#EXPOSE 80
#
##COPY --chown=nextjs:nodejs entrypoint.sh /entrypoint.sh
##RUN chmod +x /entrypoint.sh
##ENTRYPOINT ["/entrypoint.sh"]
#
## Start the Next.js app
#CMD ["npm", "start"]



## Stage 1: Build the Next.js app
#FROM node:20-alpine AS build
#
#WORKDIR /app
#
## Install dependencies
#COPY package.json package-lock.json ./
#RUN npm install
#
## Copy all files and build the project
#COPY . .
#
## Temporary set the env variables and Build the project
#RUN NEXT_PUBLIC_AZURE_CLIENT_ID=PLACEHOLDER_NEXT_PUBLIC_AZURE_CLIENT_ID NEXT_PUBLIC_AZURE_REDIRECT_URI=PLACEHOLDER_NEXT_PUBLIC_AZURE_REDIRECT_URI NEXT_PUBLIC_SITE_URL=PLACEHOLDER_NEXT_PUBLIC_SITE_URL NEXT_PUBLIC_BACKEND_URL=PLACEHOLDER_NEXT_PUBLIC_BACKEND_URL NEXT_PUBLIC_MICROSERVICE_URL=PLACEHOLDER_NEXT_PUBLIC_MICROSERVICE_URL NEXT_PUBLIC_LOGIN_REQUEST_SCOPE=PLACEHOLDER_NEXT_PUBLIC_LOGIN_REQUEST_SCOPE npm run build
#
## Stage 2: Run the Next.js app
#FROM node:20-alpine
#
#WORKDIR /app
#
## Install necessary dependencies
#RUN apk add --no-cache libc6-compat
#
## Copy the built files from the previous stage
#COPY --from=build /app ./
#
#ENV PORT=80
#
## Expose the port the app runs on
#EXPOSE 80
#
#COPY --chown=nextjs:nodejs entrypoint.sh /entrypoint.sh
#RUN chmod +x /entrypoint.sh
##ENTRYPOINT ["/entrypoint.sh"]
#
## Start the Next.js app
#CMD ["npm", "start"]


FROM node:20-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /home/app
COPY package.json ./
COPY package-lock.json ./
RUN npm i

FROM node:20-alpine AS builder
WORKDIR /home/app
COPY --from=dependencies /home/app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
RUN npm run build

FROM node:18-slim AS runner

WORKDIR /home/app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
COPY --from=builder /home/app/.next/standalone ./standalone
COPY --from=builder /home/app/public /home/app/standalone/public
COPY --from=builder /home/app/.next/static /home/app/standalone/.next/static
COPY --from=builder /home/app/entrypoint.sh ./scripts/entrypoint.sh
COPY --from=builder /home/app/.env.production ./.env.production

ENV PORT=80
EXPOSE 80
ENV HOSTNAME="0.0.0.0"

RUN chmod +x ./scripts/entrypoint.sh

ENTRYPOINT [ "./scripts/entrypoint.sh" ]

CMD ["node", "./standalone/server.js"]
