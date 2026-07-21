FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
ARG NEXT_PUBLIC_PSA_API_URL
ENV NEXT_PUBLIC_PSA_API_URL=$NEXT_PUBLIC_PSA_API_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.openai ./.openai
ENV NODE_ENV=production PORT=3001
EXPOSE 3001
CMD ["./node_modules/.bin/vinext", "start", "--host", "0.0.0.0", "--port", "3001"]
