require('console.table');
const mysql = require('mysql2');
const {
    prompt
} = require('inquirer');


const departments = [];
const roles = [];



const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);


db.query("SELECT name FROM department", function (err, res) {
    if (err) throw err;

    res.forEach(department => {
        departments.push(department.name);
    });
});


db.query("SELECT title FROM role", function (err, res) {
    if (err) throw err;

    res.forEach(role => {
        roles.push(role.title);
    });
});




function questions() {

    prompt([{
        type: 'list',
        message: 'What would you like to do',
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add A Department", "Add A Role", "Add An Employee", "Update An Employee Role"],
        name: 'viewAll',
    }]).then((data) => {
        if (data.viewAll === 'View All Departments') {
            viewDepartments();
        } else if (data.viewAll === 'View All Roles') {
            viewRoles();
        } else if (data.viewAll === 'View All Employees') {
            viewEmployees();
        } else if (data.viewAll === "Add A Department") {
            addDepartment();
        } else if (data.viewAll === "Add A Role") {
            addRole();
        } else if (data.viewAll === "Add An Employee") {
            addEmployee();
        } else if (data.viewAll === "Update An Employee Role") {
            updateEmployee();
        } else if (data.viewAll === "Exit") {
            console.log("Exiting")
            db.end();
        }

    })

};
