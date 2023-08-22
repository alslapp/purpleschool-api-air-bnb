FROM node:16-alpine
WORKDIR /opt/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build telegram \
    && npm prune --production \
    && rm -rf ./src/ \
    && rm -rf ./apps/ \
    && rm -rf ./libs/ \
    && rm -rf nest-cli.json \
    && rm -rf tsconfig.build.json \
    && rm -rf tsconfig.json \
    && rm -rf package-lock.json \
    && rm -rf package.json
CMD ["node", "./dist/apps/telegram/main"]