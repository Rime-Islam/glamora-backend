FROM node:20-bullseye

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npx", "nodemon", "--legacy-watch", "src/server.ts"]