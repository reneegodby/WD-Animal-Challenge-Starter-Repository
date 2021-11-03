require("dotenv").config();
const express = require("express");
const db = require("./db");
const app = express();
const controllers = require("./controllers");

app.use(require("./middleware/headers"));

app.use(express.json());

app.use("/user", controllers.usercontroller);
 //bronze challenge 1 //http://localhost:3000/user
app.use(require("./middleware/validate-jwt"));
app.use("/animal", controllers.animalcontroller);

db.authenticate()
  .then(() => db.sync()) // => {force: true}
  .then(() => {
    app.listen(3002, () =>
      console.log(`[Server: ] App is listening on Port ${3002}`)
    );
  })
  .catch((err) => {
    console.log("[Server: ] Server Crashed");
    console.error(err);
  });
