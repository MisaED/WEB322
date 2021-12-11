const { Department } = require("../../data-server");

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

module.exports = {
  getDepartments,
  deleteDepartmentById,
  addDepartment,
  updateDepartment,
  getDepartmentById,
};
