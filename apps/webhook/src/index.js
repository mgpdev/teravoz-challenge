const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const routes = require("./routes");
const webSocket = require("./services/web-socket");
const handleQueues = require("./services/handle-queues");

const app = express();

const router = express.Router();

let port = process.env.PORT || 3001;

/** set routes */
routes(router);

/** set middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(router);

app.get("/", (req, res, next) => {
  res.sendStatus(200);
  next();
});

const server = require("http").Server(app);

webSocket.setServer(server);

handleQueues.load();

/** start server */
server.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});
