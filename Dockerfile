FROM node:gallium-alpine as base
WORKDIR /root/app
ENTRYPOINT [ "npm", "run" ]

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM base AS release
COPY --from=base /root/app/dist ./dist
RUN npm ci --omit=dev

CMD ["start"]
