
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.



var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

// ASK MANAGER WHAT HE/SHE WOULD LIKE TO DO
function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;
      }
    });
}


// VIEW ALL PRODUCTS
function viewProducts() {

    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price ($): " + res[i].price + " || Inventory: " + res[i].stock_quantity);
		}
		connection.end();
    });

}


// VIEW ALL PRODUCTS WITH AN INVENTORY COUNT LOWER THAN FIVE
function viewLowInventory() {

	var query = "SELECT * FROM products WHERE stock_quantity < 5";
	connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
		  console.log("Product: " + res[i].product_name + " || Inventory: " + res[i].stock_quantity);
		}
		connection.end();
	});

}


// ADD STOCK TO INVENTORY
function addToInventory() {

	connection.query("SELECT * FROM products", function(err, results) {
	    if (err) throw err;
	    inquirer
	      .prompt([
	        {
	          name: "product",
	          type: "list",
	          choices: function() {
	            var choiceArray = [];
	            for (var i = 0; i < results.length; i++) {
	              choiceArray.push(results[i].product_name);
	            }
	            return choiceArray;
	          },
	          message: "What item are you adding inventory to?"
	        },
	        {
	          name: "units",
	          type: "input",
	          message: "How many units are being added?",
	          validate: function(value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
	      		}
	        }
	      ])
	      .then(function(answer) {

	      	var product = answer.product;
	      	var quantity = parseInt(answer.units);
	  		updateInventory(product, quantity);

		  });
	});

}

// Update inventory / MySQL Database
function updateInventory(product, quantity){
	// var product = product;
  	connection.query("SELECT * FROM products WHERE product_name = ?", [product] , function(err, results) {
  		var updatedStock = results[0].stock_quantity + quantity;
		connection.query('UPDATE products SET ? WHERE ?',
		[{
			stock_quantity: updatedStock
		},
		{
			product_name: product
		}],
		function(err, res){
			console.log("Inventory updated: " + quantity + " units were successfully added to " + product + ".");
		});

		connection.end();
	});
}


// ADD NEW PRODUCT
function addNewProduct() {
// prompt for info about the product being added
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the product to be added?"
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to add this product to?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price per unit of this product?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stockQty",
        type: "input",
        message: "How many units are this product are being added to inventory?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.stockQty
        },
        function(err) {
          if (err) throw err;
          console.log(answer.product + " was successfully added!");
        }
      );

      connection.end();
    });

}