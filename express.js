const express = require("express");
const bodyParser = require("body-parser");

// routes
const commentingRoute = require("./routes/commenting.route");
const commentRoute = require("./routes/comment.route");

const app = express();

// body parse
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// public
app.use(express.static(`${__dirname}/public`));

// register routes
app.use("/api/commenting", commentingRoute);
app.use("/api/comment", commentRoute);

const server = app.listen(3001, () => {
  console.log("server is running on port", server.address().port);
});
