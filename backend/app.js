const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/user");
const restRoute = require("./routes/restaurant");
const menuRoute = require("./routes/menu-item");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const database = require("./initDB");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/user", userRoute);
app.use("/api/restaurant", restRoute);
app.use("/api/menu", menuRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

app.use((req, res) => {
  console.log("invalid route");
  res.status(404).json("not found");
});

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || "server Error";
  const data = err.data;
  res.status(status).json({ message, data });
});

const PORT = process.env.PORT || 3000;

database(() => {
  app.listen(PORT, () => {
    // TODO: add socket.io
    console.log("Server started on port " + PORT + "...");
  });
});
