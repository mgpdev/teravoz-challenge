# Teravoz Challenge

This is an implementation of the [Terravoz Challenge](https://github.com/teravoz/challenge/tree/master/full-stack/README.md).

## Requirements and Solutions

- Listen to events emitted by Teravoz at `/webhook` endpoint. Events are and come in the following order: `call.new`, `call.standby`, `call.waiting`, `actor.entered`, `call.ongoing`, `actor.left`, `call.finished`. Those are life cycle events of a call:

  - S1: A Node.js application ([teravoz-api](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/teravoz-api)) was created to simulate random calls and emit events in the correct life cycle.
  - S2: Another Node.js application ([webhook](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/webhook)) was created to listen for Teravoz events at [`/webhook`](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/webhook/src/routes/webhook.js#L4) endpoint, handling the events, calls, customers and queues.

- When an event of type _call.standby_ arrives, you need to **delegate** that call based on the given criteria above, by POSTing to Teravoz API's `/actions` endpoint:

  - S3: When an event of type _call.standby_ arrives the [webhook](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/webhook) application **delegates** the call after checking if the customer exists based on the phone number. This application manage three queues of calls: Active calls of new customers ([900](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/webhook/src/services/handle-queues.js#L5)), Active calls of returning customers ([901](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/webhook/src/services/handle-queues.js#L6)) and Last finished Calls ([999](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/webhook/src/services/handle-queues.js#L7)).

- When app is restarted, it needs to work as if it hasn't at all - returning customers will always be returning customers:

  - S4: The applications [teravoz-api](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/teravoz-api) and [webhook](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/webhook) are using [Redis](https://github.com/mgpdev/teravoz-challenge/blob/master/docker-compose.yml#L35) to persist calls, customers and queues.

- Use of Docker containers:

  - S5: A [docker-compose](https://github.com/mgpdev/teravoz-challenge/blob/master/docker-compose.yml) was defined to run multi-container services. Each application has a Dockerfile: [teravoz-api](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/teravoz-api/Dockerfile), [webhook](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/webhook/Dockerfile) and [dashboard](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/dashboard/Dockerfile)

- A little dashboard in React or other library, showing current active calls:

  - S6: A simple React application ([dashboard](https://github.com/mgpdev/teravoz-challenge/tree/master/apps/dashboard)) was created to list the `Active calls of new customers`, `Active calls of returning customers` and `Last finished calls`.

The high-level architecture shown below summarize the solution described above.

![alt Architecture](teravoz-challenge-architecture.png)

## How to run?

### With Docker

The simplest way to run all applications is using [`docker-compose`](https://docs.docker.com/compose/):

```bash
docker-compose build
docker-compose up
```

### Standalone

To run each application as standalone service (needs Redis), just run:

```bash
cd ./apps/<service>
npm run install
npm run start
```

## How to test?

To run the tests using [Jest](https://jestjs.io/) and [Enzyme](http://airbnb.io/enzyme/) in the case of the [dashboard](https://github.com/mgpdev/teravoz-challenge/blob/master/apps/dashboard/package.json#L38):

```bash
cd ./apps/<service>
npm run install
npm run test
```

## How to access?

```bash
# Redis service
redis://localhost:6379

# Teravoz API
http://localhost:3002

# Webhook API and WebSocket
http://localhost:3001

# Dashboard
http://localhost:3000
```

## Possible improvements

- [ ] Implement a message broker to guarantee that all events emitted will be handled.
- [ ] Store the customers and calls in a database like MongoDb to have more flexible data.
