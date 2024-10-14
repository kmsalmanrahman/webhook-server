# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application’s code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3080

# Define the command to run your app
CMD [ "npm", "start" ]
