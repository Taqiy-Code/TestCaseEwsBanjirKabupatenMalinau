FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

RUN chmod +x entrypoint.sh
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]