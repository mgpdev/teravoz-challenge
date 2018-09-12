FROM mhart/alpine-node:10

RUN mkdir /app
COPY . /app/

WORKDIR /app
RUN npm install

ENV PORT 3001
EXPOSE 3001
CMD [ "npm", "run", "start" ]