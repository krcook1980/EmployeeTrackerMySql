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

//function for entering new employee in to the system
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

//make connection to mysql and start questions
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});

//First question and how to move to next step
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
            else if (response.action === 'View current employees by department'){
                //sql query and display table
                inquirer
                  .prompt({
                    name: 'action',
                    type: 'list',
                    message: 'Which department?',
                    choices: ['Sales Manager', 'Sales Associate', 'CFO', 'Accountant', 'COO', 'Marketing', 'Contract Coordinator']
                  }).then((response) => {
                    let dept = response.action; 
                    empByRole(response);
                  })
            }
            else if (response.action === 'View current employees by role'){
                //sql query and display table
                inquirer
                  .prompt({
                    name: 'action',
                    type: 'list',
                    message: 'Which department?',
                    choices: ['Sales Manager', 'Sales Associate', 'CFO', 'Accountant', 'COOAdministration']
                  }).then((response) => {
                    let dept = response.action; 
                    empByDep(response);
                  })
            }
            else if (response.action === 'Enter new employee'){
                //ask info to fill in employee info sql create function
                newEmp();
            }   
            else if (response.action === 'Remove current employee'){
                //get employee and delete from sql
                findEmp();                
            }
            else if (response.action === 'Update current employee role'){
                //get employee and update sql role
                findEmpRole();

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

//function to display all employees ***get manager name instead of id...
const allEmp = () => {
    connection.query('SELECT first_name,last_name,manager_id,title,salary,name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;', (err, res) => {
        if (err) throw err;
        
        console.table('Current Employees', res);
        start();
    });

};

//function to display employees by department ***get manager name instead of id...
const empByDep = (response) => {
    let empRole = response.action;
    connection.query(`SELECT first_name,last_name,manager_id,title,salary,name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id where role.title = '${empRole}'`, (err, res) => {
        if (err) throw err;
        
        console.table('Current Employees by Role', res);
        start();
    });
}

//function to display employees by role
const empByRole = (response) => {
    let dept = response.action;
    connection.query(`SELECT first_name,last_name,manager_id,title,salary,name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id where department.name = '${dept}'`, (err, res) => {
        if (err) throw err;
        
        console.table('Current Employees by Department', res);
        start();
    });
}

//function to delete employees
//get employee
const findEmp = (response => {
    inquirer
        .prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the the first name?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the last name?'
        }
    ]).then((response) => {
            let first_name = response.first_name;
            let last_name = response.last_name;

            connection.query(`SELECT employee.id, first_name, last_name, title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE employee.first_name = '${first_name}'  AND employee.last_name = '${last_name}'`, (err, res) => {
                if (err) throw err;

                console.table('Matching Employees', res);
                delEmp();
            })
            
        })
})

//delete employee
const delEmp = () => {
    inquirer
        .prompt ([
            {
            name: 'id',
            type: 'number',
            message: 'In the above list, what is the employee id?'
        }
    ]).then((response) => {
            let id = response.id;
            connection.query(`DELETE FROM employee WHERE employee.id = ${id}`, (err, res) => {
                if (err) throw err;
                console.log('This employee has been removed');
                start();
            })
        })
}

//update employee role
const findEmpRole = (response) => {
    inquirer
        .prompt([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the the first name?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the last name?'
        }
    ]).then((response) => {
            let first_name = response.first_name;
            let last_name = response.last_name;

            connection.query(`SELECT employee.id, first_name, last_name, title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE employee.first_name = '${first_name}'  AND employee.last_name = '${last_name}'`, (err, res) => {
                if (err) throw err;

                console.table('Matching Employees', res);
                updateEmp();
            })
            
        })
}

//Update selection
const updateEmp = () => {
    inquirer
        .prompt ([
            {
            name: 'id',
            type: 'number',
            message: 'In the above list, what is the employee id?'
        },
        {
            name: 'role',
            type: 'list',
            message: 'New employee title?',
            choices: ['Sales Manager', 'Sales Associate', 'CFO', 'Accountant', 'COO', 'Marketing', 'Contract Coordinator']
         },
    ]).then((response) => {
        let id = response.id;
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
            connection.query(`UPDATE employee SET role_id = ${role} WHERE employee.id = ${id} `, (err, res) => {
                if (err) throw err;
                console.log('This employee information has been updated');
                start();
            })
        })
}