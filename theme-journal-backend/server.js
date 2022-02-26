import express from "express";
import mongoose from "mongoose";
import Themes from "./DatabaseModels/themeSchema.js";
import Journals from "./DatabaseModels/journalSchema.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//app config
const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next();
});

app.get("/", (req, res) => res.status(200).send("hello World"));

app.get("/v2/themes/:id", (req, res) => {
  Themes.find({ user_id: req.params.id }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      //200 -> because it's downloading data
      console.log(data);
      res.status(200).send(data);
    }
  });
});

//listen
app.listen(port, (req, res) => console.log(`listening on localhost: ${port}`));
