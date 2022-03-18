const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middlewares/authMiddleware");
require("dotenv").config();

//create app
const app = express();

//start MongoDB connection and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => {
    app.listen(process.env.PORT, () =>
      console.log(`server is running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));

//middlewares
app.use(express.json());
app.use(cookieParser());

//serve static files
app.use(express.static("public"));

//set view template engine
app.set("view engine", "ejs");

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(require("./routes/auth"));