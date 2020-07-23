const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const connectionString = require("connection-string").key;

MongoClient.connect(connectionString, {
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("onetech");
    const itemsCollection = db.collection("items");
    const categoriesCollection = db.collection("categories");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.get("/categories", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          result = [...new Set(result.map((item) => item.category))];
          res.json(result);
        });
    });
    app.get("/:category", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          result = result.filter(
            (item) => item.category === req.params.category
          );
          console.log(result);
          res.json(result);
          res.status = 200;
        })
        .catch((err) => (res.status = 401));
    });
    app.put("/:category", (req, res) => {
      itemsCollection.updateMany(
        {
          category: req.params.category,
        },
        {
          $set: { category: null },
        }
      );
    });
    app.get("/", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          res.json(result);
          console.log(items);
          res.status = 200;
        })
        .catch((err) => {
          res.status = 401;
        });
    });
    app.post("/items", (req, res) => {
      itemsCollection
        .insertOne(req.body)
        .then((result) => {
          res.json("Success");
          res.status = 200;
        })
        .catch((err) => {
          res.json("Error");
          res.status = 401;
        });
    });
    app.put("/items", (req, res) => {
      itemsCollection
        .findOneAndUpdate(
          { id: req.body.id },
          {
            $set: {
              ...req.body,
            },
          },
          { upsert: true }
        )
        .then((result) => {
          res.json("Success");
          res.status = 200;
        })
        .catch((err) => {
          res.json("Error");
          res.status = 401;
        });
    });
    app.delete("/items", (req, res) => {
      itemsCollection
        .deleteOne({ id: req.body.id })
        .then((result) => {
          console.log(req.body);
          res.json("Success");
          res.status = 200;
        })
        .catch((err) => {
          res.json("Error");
          res.status = 401;
        });
    });
  })
  .catch((error) => console.error(error));

app.listen(3030);
