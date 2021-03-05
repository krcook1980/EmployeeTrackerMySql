const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { registerPrompt } = require('inquirer');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'WeeRiden1!',
    database: 'employeetrackerdb',
});

const newEmp = () => {
    inquirer
     .prompt([
     {
        name: 'first_name',
        type: 'input',
        message: 'New employee first name?',
     },
     {
        name: 'last_name',
        type: 'input',
        message: 'New employee last name?',
     },
     {
        name: 'role',
        type: 'list',
        message: 'New employee title?',
        choices: ['Sales Manager', 'Sales Associate', 'CFO', 'Accountant', 'COO', 'Marketing', 'Contract Coordinator']
     },
     {
        name: 'manager',
        type: 'input',
        message: 'Manager for new employee?',
     },
     {
        name: 'salary',
        type: 'input',
        message: 'New employee salary',
     },
    ]).then((response) => {
        let role;
        let department;
         console.log(response)
        console.log('Inserting New Employee Information\n');
            if(response.role === "Sales Manager"){
                role = 1
                department = 1
            }
            else if(response.role === "Sales Associate"){
                role = 2
                department = 1
            }
            else if(response.role === "CFO"){
                role = 3
                department = 2
            }
            else if(response.role === "Accountant"){
                role = 4
                department = 2
            }
            else if(response.role === "COO"){
                role = 5
                department = 3
            }
            else if(response.role === "Marketing"){
                role = 6
                department = 3
            }
            else if(response.role === "Contract Coordinator"){
                role = 7
                department = 3
            }
            //search manager name and return manager empID
        connection.query(
           
            'INSERT INTO employee SET ?',
            {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: role,
                
            },
            (err,res)=> {
                if (err) throw err;
                console.log(`${res.affectedRows} product inserted!\n`)
            }
        )
       
        start();
     })
}

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
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
                allEmp();
            }
            else if (response.action === 'Enter new employee'){
                //sql query and display table
                newEmp();
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
    connection.query('SELECT first_name,last_name,manager_id,title,salary,name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;', (err, res) => {
        if (err) throw err;
        
        console.table('Current Employees', res);
        start();
    });

};

// const empByDep = () => {
//     connection.query('SELECT first_name,last_name,manager_id,title,salary,name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;', (err, res) => {
//         if (err) throw err;
        
//         console.table('Current Employees', res);
//         start();
//     });
// }



