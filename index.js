const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { registerPrompt } = require('inquirer');
const depts = [];
const roles = [];
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'WeeRiden1!',
    database: 'employeetrackerdb',
});



//make connection to mysql and start questions
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    connection.query('SELECT name FROM department', (err, res) => {

        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            depts.push(res[i].name)
        }
        console.log(depts)
        connection.query('SELECT title FROM role', (err, res) => {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                roles.push(res[i].title)

            }
            console.log(res)
            start();
        })

    });

})
//First question and how to move to next step
const start = () => {

    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View current employees', 'View current employees by department', 'View current employees by role', 'View current employees by manager', 'Enter new employee', 'Remove current employee', 'Update current employee role', 'Update current employee manager', 'Add new department', 'Add new role', 'I am finished']
        }).then((response) => {

            if (response.action === 'View current employees') {
                allEmp();
            }
            else if (response.action === 'View current employees by department') {
                //sql query and display table

                inquirer
                    .prompt({
                        name: 'action',
                        type: 'list',
                        message: 'Which department?',
                        choices: depts
                    }).then((response) => {
                        let dept = response.action;
                        empByDep(response);
                    })
            }
            else if (response.action === 'View current employees by role') {
                //sql query and display table
                //call current roles list

                inquirer
                    .prompt({
                        name: 'action',
                        type: 'list',
                        message: 'Which role?',
                        choices: roles
                    }).then((response) => {
                        let role = response.action;
                        empByRole(response);
                    })
            }
            else if (response.action === 'View current employees by manager') {
                empByMgr();
            }
            else if (response.action === 'Enter new employee') {
                //ask info to fill in employee info sql create function
                newEmp();
            }
            else if (response.action === 'Remove current employee') {
                //get employee and delete from sql
                findEmp();
            }
            else if (response.action === 'Update current employee role') {
                //get employee and update sql role
                findEmpRole();

            }
            else if (response.action === 'Update current employee manager') {
                //get employee and update sql manager
                findEmpMgr();
            }
            else if (response.action === 'Add new department') {
                addDep();
            }
            else if (response.action === 'Add new role') {
                addRole();
            }
            else {
                console.log('Thank you')

            }

        });
};

//***  FUNCTIONS TO VIEW CURRENT DATA ***

//function to display all employees ***get manager name instead of id...
const allEmp = () => {
    connection.query(`
    SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee,title,salary,name,CONCAT(A.first_name, " ",A.last_name) AS ManagerName 
    FROM employee e 
    LEFT JOIN role R 
    on e.role_id = R.id 
    LEFT JOIN department D 
    on r.department_id = D.id 
    LEFT JOIN employee A 
    on e.manager_id = a.id`, (err, res) => {
        if (err) throw err;

        console.table('Current Employees', res);
        start();
    });

};

//function to display employees by role
const empByRole = (response) => {
    let empRole = response.action;
    connection.query(`
            SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee,title,salary,name AS Department,CONCAT(A.first_name, " ",A.last_name) AS ManagerName 
            FROM employee e 
            LEFT JOIN role r
            on e.role_id = r.id
            LEFT JOIN employee A 
            on e.manager_id = a.id 
            LEFT JOIN department d 
            on r.department_id = d.id 
            where r.title = '${empRole}'`, (err, res) => {
        if (err) throw err;
        console.log(res)
        console.table('Current Employees by role', res);
        start();
    });
}


//function to display employees by department ***get manager name instead of id...
const empByDep = (response) => {
    let dept = response.action;
    connection.query(`
    SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee,title,salary,name,CONCAT(A.first_name, " ",A.last_name) AS ManagerName 
    FROM employee e 
    LEFT JOIN role r
    on e.role_id = r.id
    LEFT JOIN employee A 
    on e.manager_id = a.id 
    LEFT JOIN department d 
    on r.department_id = d.id 
    where d.name = '${dept}'`, (err, res) => {
        if (err) throw err;

        console.table('Current Employees by department', res);
        start();
    });
}

//function to display employees by manager 
const empByMgr = () => {

    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the managers first name?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the managers last name?'
            }
        ]).then((response) => {
            let mgrF = response.first_name;
            let mgrL = response.last_name;

            connection.query(`
            SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee,title,salary,name,CONCAT(A.first_name, " ",A.last_name) AS ManagerName 
            FROM employee e 
            LEFT JOIN role r
            on e.role_id = r.id
            LEFT JOIN employee A 
            on e.manager_id = a.id 
            LEFT JOIN department d 
            on r.department_id = d.id
            Where e.manager_id 
            IN (SELECT e.id from employee e where first_name = '${mgrF}' and last_name = '${mgrL}')`, (err, res) => {
                if (err) throw err;

                console.table('Current Employees by Manager', res);
                start();
            });


        })
}


//*** FUNCTIONS TO EDIT EMPLOYEES ***

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
                choices: roles
            },
            {
                name: 'managerF',
                type: 'input',
                message: 'Manager first name for new employee?',
            },
            {
                name: 'managerL',
                type: 'input',
                message: 'Manager last name for new employee?',
            }

        ]).then((response) => {
            console.log('Inserting New Employee Information\n');
            let role = response.role;
            let mgrF = response.managerF;
            let mgrL = response.managerL;
            let roleID = "";
            let mgrID = "";

            connection.query(`SELECT employee.id, first_name, last_name, title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE employee.first_name = '${mgrF}'  AND employee.last_name = '${mgrL}'`, (err, res) => {

                if (err) throw err;
                mgrID = res[0].id
                connection.query(`SELECT id FROM role WHERE title = '${role}'`, (err, res) => {
                    if (err) throw err;
                    roleID = res[0].id;

                    connection.query(
                        'INSERT INTO employee SET ?',
                        {
                            first_name: response.first_name,
                            last_name: response.last_name,
                            role_id: roleID,
                            manager_id: mgrID

                        },

                        (err, res) => {
                            if (err) throw err;
                            console.log(`${res.affectedRows} employee added !\n`)
                            start();
                        }
                    )
                })
            })

        })
}

//get employee to remove
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
        .prompt([
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
                message: 'What is the first name?'
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
        .prompt([
            {
                name: 'id',
                type: 'number',
                message: 'In the above list, what is the employee id?'
            },
            {
                name: 'role',
                type: 'list',
                message: 'New employee title?',
                choices: roles
            },
        ]).then((response) => {
            let id = response.id;
            let role = response.role;
            let roleID = "";
            
            console.log(response)
            console.log('Inserting New Employee Information\n');
            
            connection.query(`SELECT id FROM role WHERE title = '${role}'`, (err, response)=> {
                roleID = response[0].id;
                console.log(response)
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE employee.id = ${id} `, (err, res) => {
                    if (err) throw err;
                    console.log('This employee information has been updated');
                    start();  
            })

            })
        })
}

//update manager finder
const findEmpMgr = (response) => {
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the employee first name?'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'What is the employee last name?'
            }
        ]).then((response) => {
            let first_name = response.first_name;
            let last_name = response.last_name;

            connection.query(`SELECT employee.id, first_name, last_name, title FROM employee LEFT JOIN role on employee.role_id = role.id WHERE employee.first_name = '${first_name}'  AND employee.last_name = '${last_name}'`, (err, res) => {
                if (err) throw err;

                console.table('Matching Employees', res);
                updateMgr();
            })

        })
}


//Update Manager
const updateMgr = () => {
    inquirer
        .prompt([
            {
                name: 'id',
                type: 'number',
                message: 'In the above list, what is the employee id?'
            },

        ]).then((response) => {
            let id = response.id;
            connection.query('SELECT employee.id, first_name, last_name, title, name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id;', (err, res) => {
                if (err) throw err;

                console.table('Current Employees', res);
                inquirer
                    .prompt([
                        {
                            name: 'mgr_id',
                            type: 'number',
                            message: 'In the above list, what is the new manager id?'
                        }
                    ]).then((response) => {
                        const mgrId = response.mgr_id;
                        connection.query(`UPDATE employee SET manager_id = ${mgrId} WHERE employee.id = ${id} `, (err, res) => {
                            if (err) throw err;
                            console.log('This employee information has been updated');
                            start();
                        })
                    })
            });

        })

}


//*** FUNCTIONS TO ADD DEPARTMENTS AND ROLES ***
// Add Department
const addDep = () => {
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the department?'
            },

        ]).then((response) => {

            connection.query(`INSERT INTO department (name) VALUES ('${response.department}') `, (err, res) => {
                if (err) throw err;
                console.log('This department has been added');
                start();

            })

        })
}

//Add Role
const addRole = () => {
    inquirer
        .prompt([
            {
                name: 'role',
                type: 'input',
                message: 'What is the title of the new role?'
            },
            {
                name: 'salary',
                type: 'integer',
                message: 'What is the annual salary?'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for this new role:',
                choices: depts
            }

        ]).then((response) => {
            let deptID = "";
            connection.query(`SELECT id FROM department WHERE name = '${response.department_id}'`, (err, res) => {
                deptID = res[0].id;
               
                connection.query('INSERT INTO role SET ?',
                    {
                        title: response.role,
                        salary: response.salary,
                        department_id: deptID

                    },

                    (err, res) => {
                        if (err) throw err;
                        console.log(`${res.affectedRows} employee added !\n`)
                        start();
                    }


                )
            })
        })
}