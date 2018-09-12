FROM mhart/alpine-node:10

RUN mkdir /app
COPY . /app/

WORKDIR /app
RUN npm install

ENV PORT 3002
EXPOSE 3002
CMD [ "npm", "run", "start" ]