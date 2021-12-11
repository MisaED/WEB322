const { Employee } = require("../../data-server");

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

function updateEmployee(employeeData) {
  return new Promise(function (resolve, reject) {
    const data = { ...employeeData };

    for (const [key, value] of Object.entries(data)) {
      console.log(`${key}: ${value}`);
      data[key] = value === "" ? null : value;
    }

    if (!("isManager" in data)) {
      data["isManager"] = "off";
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
};

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

module.exports = {
  getAllEmployees,
  addEmployee,
  getEmployeesByStatus,
  getEmployeesByDepartment,
  getEmployeesByManager,
  getEmployeeByNum,
  updateEmployee,
  deleteEmployeeById,
};
