const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const routes = require("./routes");
const webhook = require("./services/webhook");
const CallSimulator = require("./services/call-simulator");

const app = express();
const router = express.Router();

let port = process.env.PORT || 3002;

/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

app.use(router);

app.get("/", (req, res, next) => {
  res.sendStatus(200);
  next();
});

new CallSimulator({ webhookService: webhook }).start(10000); // Send a new call after (60000) 1 min

/** start server */
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
