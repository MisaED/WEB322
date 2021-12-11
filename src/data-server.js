const Sequelize = require("sequelize");
require("dotenv").config();

const { NODE_ENV } = process.env;

const Host = NODE_ENV !== "production" ? "localhost" : process.env.Host;
const Database = NODE_ENV !== "production" ? "emps" : process.env.Database;
const User = NODE_ENV !== "production" ? "postgres" : process.env.User;
const Password = NODE_ENV !== "production" ? "password" : process.env.Password;
const Port = NODE_ENV !== "production" ? 5432 : process.env.Port;

var sequelize;

if (NODE_ENV !== "production") {
  sequelize = new Sequelize(Database, User, Password, {
    host: Host,
    dialect: "postgres",
    port: Port,
    dialectOptions: {
      // ssl: { rejectUnauthorized: false }
    },
    query: { raw: true },
  });
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
}

var Employee = sequelize.define(
  "Employee",
  {
    employeeNum: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

var Department = sequelize.define(
  "Department",
  {
    departmentId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentName: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Department.hasMany(Employee, { foreignKey: "department" });

function initialize() {
  return new Promise(async function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve();
      })
      .catch((err) => reject("unable to sync the database", err));
  });
}

function getManagers() {
  return new Promise(function (resolve, reject) {
    if (employees && employees.length == 0) {
      reject("EXCEPTION: no employees returned");
    }

    resolve({
      status: "success",
      code: 200,
      data: employees.filter((e) => e.isManager && e),
    });
  });
}

module.exports = {
  initialize,
  getManagers,
  Employee,
  Department
};
