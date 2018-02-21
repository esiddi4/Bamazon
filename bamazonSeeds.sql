DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("The Alchemist", "Books", 10, 150),
("Queen Mattress", "Furniture", 200, 50),
("Desk", "Furniture", 100, 25),
("Eat Pray Love", "Books", 10, 200),
("Raincoat", "Clothing", 75, 100),
("DSLR Camera", "Electronics", 700, 125),
("Cardigan", "Clothing", 25, 250),
("Basketball", "Sports", 50, 200),
("Television", "Electronics", 1000, 50),
("Cards Against Humanity", "Toys/Games", 25, 350);