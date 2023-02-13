FROM node:18-alpine As build

# Add necessary build tools
RUN apk update
RUN apk add --no-cache make gcc g++

# Change working directory
WORKDIR /application

# Add the project files
ADD . .

# Install dependencies
RUN npm install -g @nestjs/cli
RUN npm install --only=production
RUN npm run build

# Expose port
EXPOSE 3000


FROM node:18-alpine As production

CMD ["node", "/dist/main"]