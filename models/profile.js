"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
    }
  }
  Profile.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "USERNAME TIDAK BOLEH KOSONG" },
          notNull: { msg: "USERNAME TIDAK BOLEH KOSONG" },
        },
      },
      profil_picture: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
      last_education: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "LAST EDUCATION TIDAK BOLEH KOSONG" },
          notNull: { msg: "LAST EDUCATION TIDAK BOLEH KOSONG" },
        },
      },
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  Profile.beforeCreate((profile) => {
    profile.profil_picture = `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png`;
  });
  return Profile;
};
