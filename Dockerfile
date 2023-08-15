FROM node:16-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npm prune --production
RUN rm -rf ./src/ \
    && rm -rf package-lock.json \
    && rm -rf nest-cli.json \
    && rm -rf tsconfig.build.json \
    && rm -rf tsconfig.json
CMD ["node", "./dist/main.js"]