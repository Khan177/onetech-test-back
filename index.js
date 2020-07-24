const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://khanter:ebash@cluster0.eqpta.mongodb.net/onetech?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
  }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("onetech");
    const itemsCollection = db.collection("items");
    const categoriesCollection = db.collection("categories");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      next();
    });
    app.get("/item", (req, res) => {
      console.log("hello");
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          console.log(result);
          let max = 0;
          result.forEach((value, ind) => {
            console.log(value);
            if (value.id > max) {
              max = value.id;
            }
          });
          max++;
          console.log(result);
          res.json(max);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    app.get("/categories", (req, res) => {
      db.collection("categories")
        .find()
        .toArray()
        .then((result) => {
          result = [...new Set(result.map((category) => category.category))];
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
    app.post("/categories", (req, res) => {
      categoriesCollection.insertOne(req.body).then((res) => {
        console.log("success");
        res.status = 200;
      });
    });
    app.get("/", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          res.json(result);
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
