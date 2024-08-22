const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const routes = require("./routes");
const PORT = process.env.PORT || 11800;

app.use(express.json());
app.use(bodyParser.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Excelerate API");
});

app.listen(PORT, () => {
  console.log("Excelerate API started on port " + PORT);
});
