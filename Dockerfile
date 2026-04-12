# 1. Base image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# 4. Copy project files
COPY . .

# 5. Build Next.js app
RUN npm run build

# -----------------------------

# 6. Production image
FROM node:18-alpine AS runner

WORKDIR /app

# 7. Copy only necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# 8. Expose port
EXPOSE 3000

# 9. Start app
CMD ["npm", "start"]