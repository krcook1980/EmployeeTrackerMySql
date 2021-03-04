const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employeeTrackerDB',
});

const start = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View current employees', 'View current employees by department', 'View current employees by role', 'Enter new employee', 'Remove current employee', 'Update current employee role', 'Update current employee manager','I am finished']
        }).then((response) => {
            if(response.action === 'View current employees'){
                //sql query and display table
            }
            else if (response.action === 'View current employees by department'){
                //sql query and display table
            }
            else if (response.action === 'View current employees by role'){
                //sql query and display table
            }
            else if (response.action === 'Enter new employee'){
                //ask info to fill in employee info sql create function
            }   
            else if (response.action === 'Remove current employee'){
                //get employee and delete from sql
            }
            else if (response.action === 'Update current employee role'){
                //get employee and update sql role
            }
            else if (response.action === 'Update current employee manager'){
                //get employee and update sql manager
            }
            else{
                console.log('Thank you') 
                //connection.end()?
            }

        });
};

//function to display all employees
const allEmp = () => {
    connection.query('SELECT * FROM employee JOIN role on employee.role_id = role.id JOIN role on role.department_id = department.id', (err, res) => {
        if (err) throw err;
        console.table(res);
        // console.table('Current Employees', [
        //     {
        //       name: 'foo',
        //       age: 10
        //     }, {
        //       name: 'bar',
        //       age: 20
        //     }
        //   ]);
    });

};

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});

