const { User, Profile, Category, Course } = require("../models");
const { Op } = require("sequelize");
const { categoryAbbrev } = require("../helper/helpers");
const bcrypt = require("bcryptjs");
const greet = require("greet-by-time");

class Controller {
  static redirectLogin(req, res) {
    res.redirect("/users/login");
  }

  // login
  static renderLogin(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }
  static submitLogin(req, res) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((data) => {
        if (data) {
          const isValid = bcrypt.compareSync(password, data.password);
          if (isValid) {
            //sesion
            req.session.role = data.role;
            // end session
            if (data.role === "admin") {
              res.redirect("/admin");
            } else {
              res.redirect(`/users`);
            }
          } else {
            const msg = "Invalid password, try again!";
            res.redirect(`/users/login?error=${msg}`);
          }
        } else {
          const msg = `Invalid email, try again!`;
          res.redirect(`/users/login?error=${msg}`);
        }
      })
      .catch((err) => res.send(err));
  }
  //end login

  // register
  static renderRegister(req, res) {
    const { error } = req.query;
    res.render("register", { error });
  }
  static submitRegister(req, res) {
    const { username, email, password, last_education } = req.body;
    User.create({
      email,
      password,
    })
      .then((data) => {
        return Profile.create({
          username,
          UserId: data.id,
          last_education,
        });
      })
      .then(() => {
        res.redirect("/users/login");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          let error = err.errors.map((item) => {
            return item.message;
          });
          res.redirect(`/users/register?error=${error}`);
        }
      });
  }
  // end register

  static renderHomeAdmin(req, res) {
    let courseData;
    Course.findAll({
      include: Category,
    })
      .then((data) => {
        courseData = data;
        return Category.findAll();
      })
      .then((data) => {
        res.render("adminhomepage", {
          courses: courseData,
          categories: data,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static renderAddCourse(req, res) {
    Category.findAll()
      .then((data) => {
        res.render("addcourse", { categories: data });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleAddCourse(req, res) {
    const { course_name, description, course_imageUrl, CategoryId } = req.body;
    Course.create({
      course_name,
      description,
      course_imageUrl,
      CategoryId,
    })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static renderAddCategory(req, res) {
    res.render("addcategory");
  }
  static handleAddCategory(req, res) {
    let { category_name } = req.body;
    Category.create({ category_name })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static renderEditCourse(req, res) {
    const id = req.params.id;
    let courseData;

    Course.findByPk(id)
      .then((data) => {
        courseData = data;
        return Category.findAll();
      })
      .then((data) => {
        res.render("editcourse", {
          course: courseData,
          categories: data,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleEditCourse(req, res) {
    const id = req.params.id;
    const { course_name, description, course_imageUrl, CategoryId } = req.body;

    Course.update(
      {
        course_name,
        description,
        course_imageUrl,
        CategoryId,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleDeleteCourse(req, res) {
    const id = req.params.id;
    Course.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static renderEditCategory(req, res) {
    const id = req.params.id;

    Category.findByPk(id)
      .then((data) => {
        res.render("editcategory", { category: data });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleEditCategory(req, res) {
    const id = req.params.id;
    const { category_name } = req.body;

    Category.update(
      { category_name },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleDeleteCategory(req, res) {
    const id = req.params.id;
    Category.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        res.redirect("/admin");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static handleLogout(req, res) {
    req.session.destroy();
    res.redirect("/users/login");
  }
  static renderHomeUser(req, res) {
    const hour = new Date().getHours();

    let courseData;
    let { search } = req.query;

    let option = {};

    if (search) {
      option = {
        course_name: { [Op.iLike]: `%${search}%` },
      };
    }

    Course.findAll({
      include: Category,
      where: option,
    })
      .then((data) => {
        courseData = data;
        return Profile.findAll();
      })
      .then((pData) => {
        let greeting = greet("Bro!", hour);
        res.render("userhomepage", {
          courses: courseData,
          profiles: pData,
          categoryAbbrev,
          greeting,
        });
      })
      .catch((err) => {
        res.send(err);
      });
  }
}

module.exports = Controller;
