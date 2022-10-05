INSERT INTO department (name)
VALUES
    ('Executive'),
    ('Development'),
    ('Design'),
    ('Sales');


INSERT INTO role (title, salary, department_id)
VALUES
    ('CEO', 500000, 1),
    ('President', 400000, 1),

    ('Director', 250000, 2),
    ('Practice Lead', 150000, 2),
    ('Account Manager', 135000, 2),

    ('Account Recruiting Manager', 125000, 3),
    ('On Premise Manager', 100000, 3),

    ('Recruiter', 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Ted',  'Moneymaker',     1, NULL),
    ('Jedi',  'Master',     2, NULL),
    ('John',  'Doe',        3, 2),
    ('Willie',  'Baker',    4, 3),
    ('Christopher',  'Lee',   5, 3),
    ('Tony',  'Tran',      6, 2),
    ('Monica',  'Ford',   7, 6),
    ('Herbert',  'Williams',    8, NULL);