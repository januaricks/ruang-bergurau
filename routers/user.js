const express = require("express");
const Controller = require("../controller/controller");
const router = express.Router();

const isLogin = (req, res, next) => {
  if (req.session.role) {
    res.redirect("/users");
  } else {
    next();
  }
};

router.get("/register", isLogin, Controller.renderRegister);
router.post("/register", Controller.submitRegister);
router.get("/login", isLogin, Controller.renderLogin);
router.post("/login", Controller.submitLogin);

router.use((req, res, next) => {
  if (!req.session.role) {
    res.redirect("/users/login");
  } else {
    next();
  }
});

router.use((req, res, next) => {
  if (req.session.role !== "user") {
    res.redirect("/admin");
  } else {
    next();
  }
});

router.get("/", Controller.renderHomeUser);

router.get("/logout", Controller.handleLogout)

module.exports = router;
