const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const PORT = process.env.PORT;

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
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          let max = 0;
          result.forEach((value, ind) => {
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
      categoriesCollection.update(
        { category: "Без названия" },
        { $set: { category: "Без названия" } },
        { upsert: true }
      );
      db.collection("categories")
        .find()
        .toArray()
        .then((result) => {
          result = [...new Set(result.map((category) => category.category))];
          res.json(result);
        });
    });
    app.get("/category", (req, res) => {
      db.collection("items")
        .find()
        .toArray()
        .then((result) => {
          result = result.filter(
            (item) => item.category === req.query.category
          );
          res.json(result);
          res.status = 200;
        })
        .catch((err) => (res.status = 401));
    });
    app.post("/categories", (req, res) => {
      categoriesCollection.insertOne(req.body).then((result) => {
        console.log("success");
        res.json(result);
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
              name: req.body.name,
              category: req.body.category,
              buyPrice: req.body.buyPrice,
              price: req.body.price,
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
    app.delete("/categories", (req, res) => {
      itemsCollection.updateMany(
        {
          category: req.body.category,
        },
        {
          $set: { category: "Без названия" },
        }
      );
      categoriesCollection.deleteOne({ category: req.body.category });
      categoriesCollection
        .update(
          { category: "Без названия" },
          { $set: { category: "Без названия" } },
          { upsert: true }
        )
        .then((result) => res.json(result));
    });
  })
  .catch((error) => console.error(error));

app.listen(PORT);
