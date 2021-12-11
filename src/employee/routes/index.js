var express = require("express");
var router = express.Router();

const {
  getAllEmployees,
  addEmployee,
  getEmployeesByStatus,
  getEmployeesByDepartment,
  getEmployeesByManager,
  getEmployeeByNum,
  updateEmployee,
  deleteEmployeeById,
} = require("../service");

const {
  getDepartments
} = require("../../department/service");

router.get("/employees", function (req, res) {
  if (Object.keys(req.query).length !== 0) {
    if ("status" in req.query) {
      var { status } = req.query;
      getEmployeesByStatus(status)
        .then((response) => {
          res.status(200).render("employees", { data: response });
        })
        .catch((err) => res.json(err));
    }

    if ("department" in req.query) {
      var { department } = req.query;
      getEmployeesByDepartment(department)
        .then((response) =>
          res.status(200).render("employees", { data: response })
        )
        .catch((err) => res.json(err));
    }

    if ("manager" in req.query) {
      var { manager } = req.query;
      getEmployeesByManager(manager)
        .then((response) =>
          res.status(200).render("employees", { data: response })
        )
        .catch((err) => res.json(err));
    }
  } else {
    getAllEmployees()
      .then((response) =>
        res.status(200).render("employees", { data: response.data })
      )
      // .then(response => res.json(response.data))
      .catch((err) =>
        res.status(400).render("employees", { message: "No employees found" })
      );
  }
});

router.get("/employees/add", function (req, res) {
  getDepartments()
    .then((response) => {
      res.render("addEmployee", { departments: response.data });
    })
    .catch((err) => res.render("addEmployee", { departments: [] }));
});



router.get("/employee/:empNum", function (req, res) {
  // getEmployeeByNum(req.params["employeeNum"])
  //   .then((response) =>
  //     res.status(200).render("employee", { employee: response })
  //   )
  //   .catch((err) =>
  //     res.status(400).render("employee", { message: "no results" })
  //   );
  // initialize an empty object to store the values
  let viewData = {};
  getEmployeeByNum(req.params.empNum)
    .then((data) => {
      if (data) {
        viewData.employee = data; //store employee data in the "viewData" object as "employee"
      } else {
        viewData.employee = null; // set employee to null if none were returned
      }
    })
    .catch(() => {
      viewData.employee = null; // set employee to null if there was an error
    })
    .then(getDepartments)
    .then((data) => {
      viewData.departments = data["data"]; // store department data in the "viewData" object as "departments"
      // loop through viewData.departments and once we have found the departmentId that matches
      // the employee's "department" value, add a "selected" property to the matching
      // viewData.departments object
      for (let i = 0; i < viewData.departments.length; i++) {
        if (
          viewData.departments[i].departmentId == viewData.employee.department
        ) {
          viewData.departments[i].selected = true;
        }
      }
    })
    .catch(() => {
      viewData.departments = []; // set departments to empty if there was an error
    })
    .then(() => {
      if (viewData.employee == null) {
        // if no employee - return an error
        res.status(404).send("Employee Not Found");
      } else {
        res.render("employee", {
          employee: viewData["employee"][0],
          departments: viewData["departments"],
        }); // render the "employee" view
      }
    });
});

router.post("/employees/add", function (req, res) {
  addEmployee(req.body)
    .then((data) => res.redirect("/employees"))
    .catch((err) => console.log(err));
});


router.post("/employee/update", function (req, res) {
  console.log(123, req.body);
  updateEmployee(req.body)
    .then((response) => res.redirect("/employees"))
    .catch((err) => console.error(err));
});

router.get("/employees/delete/:empNum", function (req, res) {
  const { empNum } = req.params;

  deleteEmployeeById(empNum)
    .then((response) => res.status(200).redirect("/employees"))
    .catch((err) => console.log("ERROR: " + err));
  // .catch(err => res.status(400).redirect("/employees"))
});

module.exports = router;
