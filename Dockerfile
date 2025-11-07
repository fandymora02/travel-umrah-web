# Gunakan base image Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke dalam container
COPY . .

# Expose port sesuai server kamu (misal 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "server.js"]
