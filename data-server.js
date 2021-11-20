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

function getAllEmployees() {
  return new Promise(function (resolve, reject) {
    Employee.findAll()
      .then((res) =>
        resolve({
          status: "success",
          code: 200,
          data: res,
        })
      )
      .catch(() => reject("no results retutned"));
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

function getDepartments() {
  return new Promise(async function (resolve, reject) {
    Department.findAll()
      .then((res) =>
        resolve({
          status: "success",
          code: 200,
          data: res,
        })
      )
      .catch(() => reject("no results returned"));
  });
}

function addEmployee(employeeData) {
  return new Promise(function (resolve, reject) {
    emp = {};
    emp["isManager"] = employeeData["isManager"] === "on";
    for (const [key, value] of Object.entries(employeeData)) {
      emp[key] = value === "" ? null : value;
    }
    console.log({ emp });
    Employee.create(emp)
      .then((res) => resolve(res))
      .catch((err) => reject("unable to create employee" + err));
  });
}

function getEmployeesByStatus(status) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        status: status,
      },
    })
      .then((res) => resolve(res))
      .catch(() => reject("no results returned"));
    // if (employees.length === 0) {
    //   reject("no results returned");
    // }

    // if (status === "full time") {
    //   resolve(employees.filter((emp) => emp.status === "Full Time"));
    // }

    // if (status === "part time") {
    //   resolve(employees.filter((emp) => emp.status === "Part Time"));
    // }
  });
}

function getEmployeesByDepartment(departmentId) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        department: departmentId,
      },
    })
      .then((res) => resolve(res))
      .catch(() => reject(123, "no results returned"));
    // if (employees.length === 0) {
    //   reject("no results returned");
    // }
    // resolve(employees.filter((emp) => emp.department === Number(departmentId)));
  });
}

function getEmployeesByManager(managerId) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeManagerNum: managerId,
      },
    })
      .then((res) => resolve(res))
      .catch(() => reject("no results returned"));
    // if (employees.length === 0) {
    //   reject("no results returned");
    // }
    // resolve(
    //   employees.filter((emp) => emp.employeeManagerNum === Number(managerId))
    // );
  });
}

function getEmployeeByNum(employeeId) {
  return new Promise(function (resolve, reject) {
    Employee.findAll({
      where: {
        employeeNum: employeeId,
      },
    })
      .then((res) => resolve(res))
      .catch(() => reject("no results returned"));
    // if (employees.length === 0) {
    //   reject("no results returned");
    // }

    // resolve(employees.find((emp) => emp.employeeNum === Number(employeeId)));
  });
}

function updateEmployee(employeeData) {
  return new Promise(function (resolve, reject) {
    const data = { ...employeeData };

    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      data[key] = value === "" ? null : value;
    }

    if(!('isManager' in data)) {
      data['isManager'] = 'off';
    }

    Employee.update(
      { ...data }, // update everythings
      {
        where: {
          employeeNum: data.employeeNum,
        },
      }
    )
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function deleteDepartmentById(departmentId) {
  return new Promise(function (resolve, reject) {
    Department.destroy({
      where: {
        departmentId,
      },
    })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function addDepartment(departmentName) {
  return new Promise(function (resolve, reject) {
    Department.create({
      departmentName,
    })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

function updateDepartment(departmentData) {
  return new Promise(function (resolve, reject) {
    Department.update(
      { departmentName: departmentData.departmentName },
      {
        where: {
          departmentId: departmentData.departmentId,
        },
      }
    )
      .then(() => resolve())
      .catch((err) => reject());
  });
}

function getDepartmentById(departmentId) {
  return new Promise(function (resolve, reject) {
    Department.findByPk(departmentId)
      .then((response) => resolve(response))
      .catch((err) => reject());
  });
}

function deleteEmployeeById(empId) {
  return new Promise(function (resolve, reject) {
    Employee.destroy({
      where: {
        employeeNum: empId,
      },
    })
      .then(() => resolve())
      .catch((err) => reject());
  });
}

module.exports = {
  initialize,
  getAllEmployees,
  getManagers,
  getDepartments,
  addEmployee,
  getEmployeesByStatus,
  getEmployeesByDepartment,
  getEmployeesByManager,
  getEmployeeByNum,
  updateEmployee,
  deleteDepartmentById,
  addDepartment,
  updateDepartment,
  getDepartmentById,
  deleteEmployeeById,
};
