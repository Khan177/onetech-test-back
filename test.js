const axios = require("axios");
const mongo = require("mongodb");
ObjectID = mongo.ObjectID;

axios
  .get("http://localhost:3030/categories", {
    params: {
      category: "first",
    },
  })
  .then((res) => console.log(res.data))
  .catch((err) => console.log(err));
