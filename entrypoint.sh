#!/bin/sh

until nc -z db 5432; do
  sleep 1
done

npx prisma db push

npx prisma db seed

npm run start