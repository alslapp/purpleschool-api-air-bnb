FROM node:16-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
ADD package*.json ./
RUN npm install --only=production
COPY  . .
COPY --from=development /usr/src/app/dist ./dist
RUN npm run build \
    && npm prune --production \
    && rm -rf ./src/ \
    && rm -rf nest-cli.json \
    && rm -rf tsconfig.build.json \
    && rm -rf tsconfig.json \
	&& rm -rf package-lock.json \
	&& rm -rf package.json
CMD ["node", "./dist/apps/app/main"]