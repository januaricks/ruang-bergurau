const express = require("express");
const Controller = require("../controller/controller");
const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.role || req.session.role !== "admin") {
    res.redirect("/users/login");
  } else {
    next();
  }
});

router.get("/", Controller.renderHomeAdmin);

router.get("/add-course", Controller.renderAddCourse)
router.post("/add-course", Controller.handleAddCourse)

router.get('/add-category', Controller.renderAddCategory)
router.post('/add-category', Controller.handleAddCategory)

router.get('/:id/edit/course', Controller.renderEditCourse)
router.post('/:id/edit/course', Controller.handleEditCourse)

router.get('/:id/delete/course', Controller.handleDeleteCourse)

router.get('/:id/edit/category', Controller.renderEditCategory)
router.post('/:id/edit/category', Controller.handleEditCategory)

router.get('/:id/delete/category', Controller.handleDeleteCategory)

router.get('/logout', Controller.handleLogout)

module.exports = router;
