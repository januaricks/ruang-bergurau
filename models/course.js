"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
      this.belongsTo(models.Category);
    }
  }
  Course.init(
    {
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Course cannot be empty`,
          },
          notNull: {
            msg: `Course a required`,
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `description cannot be empty`,
          },
          notNull: {
            msg: `description a required`,
          },
        },
      },
      course_imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `imageUrl cannot be empty`,
          },
          notNull: {
            msg: `imageUrl a required`,
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
