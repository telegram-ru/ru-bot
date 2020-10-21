# ---- Base Node ----
FROM node:erbium-alpine as base
# set working directory
WORKDIR /root/app
# Set entrypoint
ENTRYPOINT [ "npm", "run" ]
# copy project file
COPY package.json package-lock.json .sequelizerc ./

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0 && npm install --only=production

#
# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /root/app/node_modules ./node_modules
# copy app sources
COPY src src
# expose port and define CMD
EXPOSE 3000
CMD ["start"]
