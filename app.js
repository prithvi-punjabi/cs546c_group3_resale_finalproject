const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");
const configMiddlewares = require("./helper/middlewares");
const session = require("express-session");

app.use(
  session({
    name: "AuthCookie",
    secret: "Shhhh...",
    saveUninitialized: true,
    resave: false,
  })
);
app.use(express.json());
app.use(
  "/css",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "./node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "./node_modules/jquery/dist"))
);

const templatePath = path.join(__dirname, "./templates/views");
app.use(express.urlencoded({ extended: false }));

app.set("views", templatePath);

var hbs = exphbs.create({
  defaultLayout: "index",
  partialsDir: "templates/partials",
});
hbs.handlebars.registerHelper(
  "ifContains",
  function (category, categories, options) {
    return categories != null && categories.includes(category)
      ? options.fn(this)
      : options.inverse(this);
  }
);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use("/public", express.static(__dirname + "/public"));

configMiddlewares(app);
configRoutes(app);
app.listen(3000, () => {
  console.log("Server started");
});
