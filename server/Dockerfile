# Stage 1 building the code
FROM node:12.13.0 AS builder

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./
COPY tsconfig*.json ./

# Install production dependencies.
RUN npm install

COPY . .

# Build
RUN npm run build

# Stage 2
FROM node:12.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY --from=builder ./app/build ./build

ARG PORT
ARG MONGO_URL
ARG FCM_SERVER_KEY
ARG AWS_ACCESS_KEY
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG JWT_SECRET_KEY

ENV PORT=$PORT
ENV MONGO_URL=$MONGO_URL
ENV FCM_SERVER_KEY=$FCM_SERVER_KEY
ENV AWS_ACCESS_KEY=$AWS_ACCESS_KEY
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV JWT_SECRET_KEY=$JWT_SECRET_KEY

# Run the web service on container startup.
CMD ["sh","-c","cd build && node server.js"]