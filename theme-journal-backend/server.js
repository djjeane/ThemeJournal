import express from "express";
import mongoose from "mongoose";
import Themes from "./DatabaseModels/themeSchema.js";
import Journals from "./DatabaseModels/journalSchema.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//app config
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use((req, res, next) => {
  console.log(
    `${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`
  );
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  }

  if (res.data) {
    res.data.headers["Content-Type"];
  }

  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => res.status(200).send("hello World"));

//Themes
app.get("/v2/themes/:id", (req, res) => {
  try {
    Themes.find({ user_id: req.params.id }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        //200 -> because it's downloading data
        res.status(200).send(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/v2/themes", (req, res) => {
  const newTheme = req.body;
  Themes.create(newTheme, (err, data) => {
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

app.patch("/v2/themes", (req, res) => {
  console.log(req.body.user_id);
  const updatedTheme = req.body;
  Themes.findOneAndUpdate(
    { user_id: updatedTheme.user_id },
    updatedTheme,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);

        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

//Journals
app.get("/v2/journals/:id", (req, res) => {
  try {
    Journals.find({ user_id: req.params.id }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        //200 -> because it's downloading data
        res.status(200).send(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/v2/journals/:id/:date", (req, res) => {
  try {
    Journals.find(
      { user_id: req.params.id, date: req.params.date },
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          //200 -> because it's downloading data
          res.status(200).send(data);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});

app.post("/v2/journals", (req, res) => {
  const newJournal = req.body;
  Journals.create(newJournal, (err, data) => {
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

app.patch("/v2/journals", (req, res) => {
  const updatedJournal = req.body;
  Journals.findOneAndUpdate(
    { user_id: updatedJournal.user_id, date: updatedJournal.date },
    updatedJournal,
    { new: true },
    (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

//listen
app.listen(port, (req, res) => console.log(`listening on port: ${port}`));
