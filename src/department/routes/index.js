var express = require("express");
var router = express.Router();

const {
  getDepartments,
  deleteDepartmentById,
  addDepartment,
  updateDepartment,
  getDepartmentById,
} = require("../service");

router.post("/departments/add", function (req, res) {
  const { departmentName } = req.body;
  addDepartment(departmentName)
    .then(() => res.redirect("/departments"))
    .catch((err) => console.error(err));
});

router.get("/departments", function (req, res) {
  getDepartments()
    .then(
      (response) =>
        // res.status(200).render("departments", { data: response.data })
        res.status(200).render("departments", {
          target: JSON.stringify(response.data),
          data: response.data,
        })
      // res.status(200).json({data: response.data})
    )
    .catch((err) => res.json(err));
});

router.get("/departments/delete/:departmentId", function (req, res) {
  const { departmentId } = req.params;

  deleteDepartmentById(departmentId)
    .then((response) => res.status(200).redirect("/departments"))
    .catch((err) => console.error(err));
});

router.get("/departments/add", function (req, res) {
  res.status(200).render("addDepartment");
});

router.post("/department/update", function (req, res) {
  const { departmentId, departmentName } = req.body;
  updateDepartment({ departmentId, departmentName })
    .then((response) => res.status(200).redirect("/departments"))
    .catch((err) => res.status(400).send("departments failed to be udpated"));
});

router.get("/department/:departmentId", function (req, res) {
  const { departmentId } = req.params;
  getDepartmentById(departmentId)
    .then((response) =>
      res.status(200).render("updateDepartment", { departmentData: response })
    )
    .catch((err) => res.status(400).render("updateDepartment"));
});


module.exports = router;