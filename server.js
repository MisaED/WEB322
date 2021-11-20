/*********************************************************************************
 * WEB322 – Assignment 02
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Misato Endo      Student ID: 158516195     Date: 2021/10/10
 *
 * Online (Heroku) URL: https://aqueous-refuge-30289.herokuapp.com/
 *
 ********************************************************************************/

global.employees = [];
global.departments = [];
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
var multer = require("multer");
var fs = require("fs");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

hbs_config = {
  extname: ".hbs",
  // defaultLayout: "main",
  // layoutsDir: path.join(__dirname, 'views/layouts'),
  // partialsDir: path.join(__dirname, 'views/partials')

  helpers: {
    navLink: function (url, options) {
      // console.log("@@this: ", this)
      return `<li class="${
        url === app.locals.activeRoute ? "active" : ""
      }"><a href='${url}'>${options.fn(this)}</a></li>`;
    },
    equal: (lvalue, rvalue, options) => {
      if (arguments.length < 3) {
        throw new Error("Handlebars helper equal needs 2 parameters");
      }
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
    departmentTableRow: function (obj, options) {
      const { departmentId, departmentName } = obj;

      return `
              <tr>
                <td>
                  <a href="/employees?department=${departmentId}">
                    ${departmentId}
                  </a>
                </td>
                <td>
                  <a href="/department/${departmentId}">
                    ${departmentName}
                  </a>
                </td>
                <td>
                  <a href="/departments/delete/${departmentId}" class="btn btn-danger">
                    remove
                  </a> 
                </td>
              </tr>`;
    },
    employeesTableRow: function(obj, options) {

      const {
        employeeNum, 
        firstName, 
        lastName, 
        email,
        addressStreet,
        addressCity,
        addressState, 
        addressPostal,
        employeeManagerNum,
        status,
        department,
        hireDate,
      } = obj;

      return `
            <tr>
              <td>${employeeNum}</td>
              <td>
                <a href="/employee/${employeeNum}">
                  ${firstName} ${lastName}
                </a>
              </td>
              
              <td>
                <a href="mailto:${email}">${email}</a>
              </td>

              <td>${addressStreet == null ? "" : addressStreet}
                ${addressCity == null ? "" : addressCity}
                ${addressState == null ? "" : addressState}
                ${addressPostal == null ? "" : addressPostal}
              </td>

              <td>
                <a href="/employees?manager=${employeeManagerNum}">
                  ${employeeManagerNum == null ? "" : employeeManagerNum}
                </a>
              </td>

              <td>
                <a href="/employees?status=${status}">${status == null ? "" : status}</a>
              </td>
              
              <td>
                <a href="/employees?department=${department}">${department == null ? "" : department}</a>
              </td>

              <td>${hireDate == null ? "" : hireDate}</td>

              <td>
                <a href="/employees/delete/${employeeNum}" class="btn btn-danger">
                  remove
                </a>
              </td>
            </tr>
      `;
    },
    departmentSelectOption: function(obj, options) {
      const {departmentId, departmentName} = obj;
      return `<option value=${departmentId}>${departmentName}</option>`;
    },
    employeeUpdateFormValue: function(obj, field, options) {
      return obj[field];
    },
    employeeJobStatus: function(obj, status, options) {
      if(obj['status'] == status) {
        return "checked";
      } else {
        return "";
      }
    },
    employeeIsManager: function(obj, options) {
      if(obj['isManager'] == false || obj['isManager'] == 'off') {
        return "";
      }

      if(obj['isManager'] == "on" || obj["isManager"] == true) {
        return "checked"
      }
    }
  },
};

// app.set("views", "./views"); // no need since the folder is already called views
app.engine(".hbs", exphbs(hbs_config));
app.set("view engine", ".hbs");

app.use(express.static("public"));
const {
  initialize,
  getAllEmployees,
  getDepartments,
  getManagers,
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
} = require("./data-server");

// multer
var PHOTODIRECTORY = "./public/images/uploaded";
var storage = multer.diskStorage({
  destination: PHOTODIRECTORY,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// used in hbs custom helper
app.use(function (req, res, next) {
  var route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.post("/departments/add", function (req, res) {
  const { departmentName } = req.body;
  addDepartment(departmentName)
    .then(() => res.redirect("/departments"))
    .catch((err) => console.error(err));
});

app.get("/envs", function (req, res) {
  res.status(200).json(process.env);
});

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/employees", function (req, res) {
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

app.get("/employees/add", function (req, res) {
  getDepartments()
    .then((response) => {
      res.render("addEmployee", { departments: response.data });
    })
    .catch((err) => res.render("addEmployee", { departments: [] }));
});

app.get("/employee/:empNum", function (req, res) {
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

app.get("/managers", function (req, res) {
  getManagers()
    .then((response) => res.json(response.data))
    .catch((err) => res.json(err));
});

app.get("/departments", function (req, res) {
  getDepartments()
    .then(
      (response) =>
        // res.status(200).render("departments", { data: response.data })
        res
          .status(200)
          .render("departments", {
            target: JSON.stringify(response.data),
            data: response.data,
          })
      // res.status(200).json({data: response.data})
    )
    .catch((err) => res.json(err));
});

app.post("/employees/add", function (req, res) {
  addEmployee(req.body)
    .then((data) => res.redirect("/employees"))
    .catch((err) => console.log(err));
});

app.get("/images/add", function (req, res) {
  res.render("addImage");
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});

app.get("/images", function (req, res) {
  fs.readdir(PHOTODIRECTORY, function (err, items) {
    if (err) {
      res.status(400).json({ ERROR: "something went wrong" });
    }

    // res.status(200).json({ "images": items })
    res.status(200).render("images", { items });
  });
});

app.post("/employee/update", function (req, res) {
  console.log(123, req.body)
  updateEmployee(req.body)
    .then((response) => res.redirect("/employees"))
    .catch((err) => console.error(err));
});

app.get("/departments/delete/:departmentId", function (req, res) {
  const { departmentId } = req.params;

  deleteDepartmentById(departmentId)
    .then((response) => res.status(200).redirect("/departments"))
    .catch((err) => console.error(err));
});

app.get("/departments/add", function (req, res) {
  res.status(200).render("addDepartment");
});

app.post("/department/update", function (req, res) {
  const { departmentId, departmentName } = req.body;
  updateDepartment({ departmentId, departmentName })
    .then((response) => res.status(200).redirect("/departments"))
    .catch((err) => res.status(400).send("departments failed to be udpated"));
});

app.get("/department/:departmentId", function (req, res) {
  const { departmentId } = req.params;
  getDepartmentById(departmentId)
    .then((response) =>
      res.status(200).render("updateDepartment", { departmentData: response })
    )
    .catch((err) => res.status(400).render("updateDepartment"));
});

app.get("/employees/delete/:empNum", function (req, res) {
  const { empNum } = req.params;

  deleteEmployeeById(empNum)
    .then((response) => res.status(200).redirect("/employees"))
    .catch((err) => console.log("ERROR: " + err));
  // .catch(err => res.status(400).redirect("/employees"))
});

initialize()
  .then((msg) => {
    app.listen(PORT, () => console.log("app running"));
  })
  .catch((err) => console.log(err));
