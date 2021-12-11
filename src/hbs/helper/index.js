module.exports.helpers = {
  navLink: (url, options) => {
    return `<li class="${url === app.locals.activeRoute ? "active" : ""
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
  employeesTableRow: function (obj, options) {
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
              <a href="/employees?status=${status}">${status == null ? "" : status
      }</a>
            </td>
            
            <td>
              <a href="/employees?department=${department}">${department == null ? "" : department
      }</a>
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
  departmentSelectOption: function (obj, options) {
    const { departmentId, departmentName } = obj;
    return `<option value=${departmentId}>${departmentName}</option>`;
  },
  employeeUpdateFormValue: function (obj, field, options) {
    return obj[field];
  },
  employeeJobStatus: function (obj, status, options) {
    if (obj["status"] == status) {
      return "checked";
    } else {
      return "";
    }
  },
  employeeIsManager: function (obj, options) {
    if (obj["isManager"] == false || obj["isManager"] == "off") {
      return "";
    }

    if (obj["isManager"] == "on" || obj["isManager"] == true) {
      return "checked";
    }
  },
}