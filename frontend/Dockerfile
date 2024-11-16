# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV=development

# Start the Next.js development server
CMD ["npm", "run", "dev"]
