# Stage 1: Build the frontend
FROM node:22-slim AS frontend

WORKDIR /var/www/
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the final image
FROM node:22-slim AS production

WORKDIR /var/www/

# Copy the built files from the previous stage
COPY --from=frontend /var/www/dist ./dist

# Install only production dependencies (if needed)
COPY package*.json ./
RUN npm install --only=production

EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview"]
