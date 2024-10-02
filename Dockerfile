# Building layer
FROM node:18-alpine as development

WORKDIR /app

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN npm install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN npm run build

#USER node

# Runtime (production) layer
FROM node:18-alpine as production

ENV NODE_ENV production

WORKDIR /app

# Copy production build
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY  --chown=node:node --from=development /app/dist/ ./dist/

# Expose application port
EXPOSE 3000

# Start application
CMD [ "npm", "run", "start:prod" ]