// 3 required packages to run this application
const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();


// arrays created for my department and roles
const departments = [];
const roles = [];


// connection to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
},
console.log(`Connected to the employees_db database.`)
);


// places existing departments into the specified array
db.query("SELECT name FROM department", function (err, res) {
    if (err) throw err;

    res.forEach(department => {
        departments.push(department.name);
    });
});


// places existing roles into the specified array
db.query("SELECT title FROM role", function (err, res) {
    if (err) throw err;

    res.forEach(role => {
        roles.push(role.title);
    });
});


// my created arrays/questions for the user's input
function questions() {
    inquirer.prompt([{
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


// function is called when VIEW DEPARTMENT is chosen
function viewDepartments() {
    db.query('SELECT department.id AS Department_ID, department.name AS Department_Name FROM department', (err, res) => {
        if (err) {
            throw err
        } else {
            console.table(res)
            questions();
        }
    })
};


// function is called when VIEW ROLES is chosen
function viewRoles() {
    db.query('SELECT role.id AS Role_ID, role.title AS Role_Title, role.salary AS Salary, department.name AS Department_Name FROM role JOIN department ON role.department_id = department.id', (err, res) => {
        if (err) {
            throw err
        } else {
            console.table(res)
            questions();
        }

    })
};


// function is called when VIEW EMPLOYEES is chosen
function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(e2.first_name, ' ', e2.last_name) AS manager FROM employee LEFT JOIN employee as e2 ON e2.id = employee.manager_id JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;`, (err, res) => {
        if (err) {
            throw err
        } else {
            console.table(res)
            questions();
        }
    })
};


// function is called when ADD DEPARTMENT is chosen
function addDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the department",
        name: "department"
    }]).then(({
        department
    }) => {
        db.query('INSERT INTO department SET ?', {
                name: department
            },
            function (err) {
                if (err) throw err;
                console.log(`The department "${department}" has been added.`);
                departments.push(department);

                questions();
            }
        );
    });
}


// function is called when ADD ROLE is chosen
function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "What is the title for this role?",
        name: "title"
    }, {
        type: "number",
        message: "What is the salary for this role?",
        name: "salary"
    }, {
        type: "list",
        message: "What department is this role a part of?",
        choices: departments,
        name: "department"
    }]).then(role => {
        db.query(`SELECT id FROM department WHERE (department.name= "${role.department}")`, function (err, res) {
            if (err) throw err;

            db.query("INSERT INTO role SET ?", {
                    title: role.title,
                    salary: role.salary,
                    department_id: res[0].id
                },
                function (err) {
                    if (err) throw err;
                    console.log(`The role "${role.title}" has been added to the department of "${role.department}" with a salary of "${role.salary}"`);

                    roles.push(role.title);

                    questions();
                });

        });
    });
}


// function is called when ADD EMPLOYEE is chosen
function addEmployee() {
    inquirer.prompt([{
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName"
        }, {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName"
        }, {
            type: "list",
            message: "What is the employee's role?",
            choices: roles,
            name: "role"
        }, {
            type: "list",
            message: "Who is their manager?",
            choices: ["null"],
            name: "manager"
        }

    ]).then(answer => {
        employeeFirstName = answer.firstName;
        employeeLastName = answer.lastName;

        db.query("INSERT INTO employee SET ?", {
                employeeFirstName: employee.first_name,
                employeeLastName: employee.last_name,
                role_id: res[0].id
            },
            function (err) {
                if (err) throw err;
                console.log("the employee added");


            })
        questions();
    });

};


// function is called when UPDATE EMPLOYEE is chosen
function updateEmployee() {
    let employeesList

    db.query(`SELECT first_name, last_name FROM employee`, function (err, res) {
        if (err) throw err;
        console.log(res);
        employeesList = res.map(employee => {
            return `${employee.first_name} ${employee.last_name}`
        })
        console.log(employeesList);
        inquirer.prompt([{
            type: "list",
            message: "Who's role would you like to update?",
            choices: employeesList,
            name: "employees"
        }, {
            type: "list",
            message: "What do you want to assign?",
            choices: roles,
            name: "role"
        }]).then(response => {});
    });


};


questions();