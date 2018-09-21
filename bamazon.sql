CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2),
    stock_quantity INT NOT NULL
);

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ("Can of Beans","Food",0.50,2000),
("Frodo's Foot","Cosmetics",35.99,2),
("Kangaroo 'Meat'","Food",30.50,350),
("Holy Grail","Cosmetics",20000.50,100),
("Tooth Fairy","Food",14.50,3000),
("T-1000","Electronics",205.05,100),
("Hal","Electronics",1000.50,5),
("The Box from Se7en","Home $ Kitchen",100.50,1),
("Necronomicon","Books & Audibles",7.77,42),
("Sentient Chew Toy","Pet Supplies",0.50,200000);
