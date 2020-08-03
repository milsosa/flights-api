FROM node:12 as BUILD

# Create app directory
WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install --production

# Copy all not ignored folders and files
COPY . ./

# Move folders, files and environment config (.env file) from ./dist to WORKDIR
# and then remove ./dist folder since it is not needed anymore
RUN mv ./dist/* ./ && mv ./dist/.env ./  && rm -rf ./dist

# Final image
FROM node:12-slim

# Trailing slash is needed because of the COPY command below
WORKDIR /usr/app/

# Copy source code and its dependencies from the intermediate BUILD image
COPY --from=BUILD /usr/app .

EXPOSE 8000
CMD ["npm","start"]

