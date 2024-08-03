import express from "express";
import morgan from "morgan";

const app = express();
const address = "http://localhost";
const port = 8888;

// Log all requests to the console, optional.
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at ${address}:${port}/`);
});
