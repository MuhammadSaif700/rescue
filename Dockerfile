# ===== Stage 1: Build the React Client =====
# We use a specific Node.js version as a temporary 'builder' environment
FROM node:18-alpine AS build

# Set the working directory inside the container for the client app
WORKDIR /app/client

# Copy only the package.json files first to leverage Docker's caching
# This way, 'npm install' only runs again if dependencies change
COPY client/package.json client/package-lock.json* ./
RUN npm install

# Copy the rest of the client source code
COPY client/ ./

# Run the build script from client/package.json to create the 'dist' folder
RUN npm run build


# ===== Stage 2: Create the Final Production Image =====
# Start from a fresh, lightweight Node.js image
FROM node:18-alpine

# Set the working directory for the server
WORKDIR /app

# Copy server's package.json files
COPY server/package.json server/package-lock.json* ./
# Install only the production dependencies for the server to keep the image small
RUN npm install --only=production

# Copy the server's source code
COPY server/ ./

# --- This is the key step ---
# Copy the built client files from the 'build' stage (Stage 1)
# into a 'public' folder inside our final server directory
COPY --from=build /app/client/dist ./public

# Tell Docker that the container will listen on this port
EXPOSE 5000

# The command to run when the container starts
CMD ["node", "index.js"]