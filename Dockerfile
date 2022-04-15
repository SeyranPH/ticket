FROM node:14
WORKDIR "/var/www/tickets"
COPY ./package.json ./package.json
RUN npm install
COPY . .
ENTRYPOINT ["npm", "start"]
