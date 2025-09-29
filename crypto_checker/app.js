import express from "express";
import path from "path";
import expressLayouts from "express-ejs-layouts";       // middleware for layout support
import priceRouter from "./routes/price.js";            // import price route to hanlde POST /price
import "dotenv/config";                                 // load API key from .env file

// express instance
const app = express();

// view engine
app.set("view engine", "ejs");                          // render .ejs files
app.set("views", path.join(process.cwd(), "views"));    // path to views folder
app.use(expressLayouts);                                // enable layouts middleware
app.set("layout", "layout");                            // default layout file is views/layout.ejs

// middleware
app.use(express.urlencoded({ extended: true }));        // parse form data in req.body
app.use(express.static("public"));                      // serve static files from public/

// routes
app.get("/", (req, res) => res.render("index"));        // render index.ejs
app.use("/price", priceRouter);                         // use priceRouter for all /price routes

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
