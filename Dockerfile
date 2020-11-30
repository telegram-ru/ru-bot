# ---- Base Node ----
FROM node:fermium-alpine as base
# set working directory
WORKDIR /root/app
# Set entrypoint
ENTRYPOINT [ "npm", "run" ]
# copy project file
COPY . .

# install node packages
RUN npm install && npm run build

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=base /root/app/dist ./dist
RUN npm install
# expose port and define CMD
EXPOSE 3000
CMD ["start"]
