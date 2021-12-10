const utils = require("./utils");
const xss = require("xss");

module.exports = async (app) => {
  app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  });

  app.use((req, res, next) => {
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] == "string")
          req.body[key] = xss(req.body[key]);
      }
    }
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        if (typeof req.body[key] == "string")
          req.query[key] = xss(req.query[key]);
      }
    }
    for (const key in req.params) {
      if (Object.hasOwnProperty.call(req.params, key)) {
        if (typeof req.body[key] == "string")
          req.params[key] = xss(req.params[key]);
      }
    }
    next();
  });

  app.use("/user/:id", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to view your User Profile!"
          )
      );
    }
    next();
  });

  app.use("/products/get", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to view Product Pages!")
      );
    }
    next();
  });

  app.use("/products/new", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to add a product!")
      );
    }
    next();
  });

  app.use("/products/edit", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to update a product!")
      );
    }
    next();
  });

  app.use("/products/remove", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to remove a product!")
      );
    }
    next();
  });

  app.use("/products/post", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to email a user!")
      );
    }
    next();
  });

  app.use("/comments/add", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to add a comment!")
      );
    }
    next();
  });

  app.use("/comments/getall", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to view comments!")
      );
    }
    next();
  });

  app.use("/comments/delete", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to delete comments!")
      );
    }
    next();
  });

  app.use("/users/delete", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to delete a user profile!"
          )
      );
    }
    next();
  });

  app.use("/user", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to view your user profile!"
          )
      );
    }
    next();
  });

  app.use("/users/favourite", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to favourite a product!")
      );
    }
    next();
  });

  app.use("/users/removefavourite", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent(
            "You need to be logged in to remove a product from your favourites list!"
          )
      );
    }
    next();
  });

  app.use("/users/rate", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to rate a user!")
      );
    }
    next();
  });

  app.use("/chat", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to chat!")
      );
    }
    next();
  });

  app.use("/statistics", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res.redirect(
        "/login?error=" +
          encodeURIComponent("You need to be logged in to view statistics!")
      );
    }
    next();
  });
};
