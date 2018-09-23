CREATE TABLE departments(
	department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NOT NULL
);

INSERT INTO departments
(department_name, over_head_costs)
VALUE ("Cosmetics", 35000),("Food",5000),("Home & Kitchen",15230),
("Books & Audibles",10000),("Pet Supplies",700),("Entertainment",600000);
