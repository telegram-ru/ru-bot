FROM node:fermium-alpine as base
WORKDIR /root/app
ENTRYPOINT [ "npm", "run" ]
COPY . .

RUN npm install && npm run build

FROM base AS release
COPY --from=base /root/app/dist ./dist
RUN npm install --only=prod
EXPOSE 3000
CMD ["start"]
