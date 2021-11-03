const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

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
const partialsPath = path.join(__dirname, "./templates/partials");
app.use(express.urlencoded({ extended: false }));

app.set("views", templatePath);
app.engine("handlebars", exphbs.create({ defaultLayout: "index" }).engine);
app.set("view engine", "handlebars");
app.use("/public", express.static(__dirname + "/public"));
hbs.registerPartials(partialsPath);

configRoutes(app);
app.listen(3000, () => {
	console.log("Server started");
});
