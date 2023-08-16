FROM node:16-alpine
WORKDIR /opt/app
ADD package*.json ./
RUN npm install
ADD . .
RUN npm run build \
    && npm prune --production \
    && rm -rf ./src/ \
    && rm -rf nest-cli.json \
    && rm -rf tsconfig.build.json \
    && rm -rf tsconfig.json \
	&& rm -rf package-lock.json \
	&& rm -rf package.json
CMD ["node", "./dist/main.js"]