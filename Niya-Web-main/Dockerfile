FROM node:14.21.3

WORKDIR /opt/

RUN node --version && npm --version

COPY package*.json /opt/

# RUN npm install -g serve

RUN npm install

COPY . /opt/

RUN npm run build

# Confirm the working directory

RUN ls -ltr 

EXPOSE 3000

CMD ["/bin/sh", "-c", "npm start --allowed-hosts all"]
