FROM mhart/alpine-node:10

RUN mkdir /app
COPY . /app/

WORKDIR /app
RUN npm install
RUN npm run build

RUN npm install http-server -g
EXPOSE 3000
CMD ["http-server", "/app/dist", "-p", "3000"]