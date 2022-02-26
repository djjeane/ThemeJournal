import express from "Express";
import mongoose from "mongoose";
import Themes from "./DatabaseModels/themeSchema.js";
import Journals from "./DatabaseModels/journalSchema.js";

mongoose.connect(
  "mongodb+srv://ThemeAdmin:Xf9m5hv3geGx@cluster0.axn3b.mongodb.net/Theme?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
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
  console.log("get request for themes");
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

app.post("/v2/themes", (req, res) => {
  const theme = req.body;
  Themes.create(theme, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/v2/journals", (req, res) => {
  console.log("get request for journals");
  Journals.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      //200 -> because it's downloading data
      res.status(200).send(data);
    }
  });
});

app.post("/v2/journals", (req, res) => {
  const journal = req.body;

  Journals.create(journal, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//listen
app.listen(port, (req, res) => console.log(`listening on localhost: ${port}`));
