USE employeeTrackerDB;
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE department (
    id INT,
    name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    PRIMARY KEY (id)
);

INSERT INTO department (id, name)
VALUES (1, 'Sales'), (2, 'Accounting'), (3, 'Administration');

INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Sales Manager', '100000', 1), (2, 'Sales Associate', '40000', 1), (3, 'CFO', '100000', 2), (4 'Acountant', '60000', 2), (5, 'COO', '200000', 3), (6, 'Marketing', '70000', 3), (7, 'Contract Coordinator', '60000', 3);
