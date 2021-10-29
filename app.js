const express = require("express");
const db = require("./db");

const app = express();

// app.use('/test', (req, res) => {
//   res.send('TESTING 123')
// })

app.use(require("./middleware/headers"));

const controllers = require("./controllers");

app.use(express.json());

app.use("/user", controllers.usercontroller);

db.authenticate()
  .then(() => db.sync()) // => {force: true}
  .then(() => {
    app.listen(3001, () =>
      console.log(`[Server: ] App is listening on Port ${3001}`)
    );
  })
  .catch((err) => {
    console.log("[Server: ] Server Crashed");
    console.error(err);
  });
