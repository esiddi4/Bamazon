var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;

	// display all of the items available for sale
	var query = "SELECT * FROM products";
	connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log("ID: " + res[i].id + " || Product: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price ($): " + res[i].price);
		}

		// run the start function after the connection is made, and all items are displayed, to prompt the user
		start();
	});

});

function start() {
	inquirer
    .prompt({
      name: "ID",
      type: "input",
      message: "Provide the ID of the item would you like to buy."
    })
    .then(function(product) {
    	var id = product.ID;

	    inquirer
	    .prompt({
	      name: "units",
	      type: "input",
	      message: "How many units would you like to buy?"
	    })
	    .then(function(response) {
	    	var units = response.units;

		   	connection.query("SELECT * FROM products WHERE id=?", [id], function(err, res) {

			    if (err) throw err;

			    var newQuantity = res[0].stock_quantity - units;
			    var totalCost = units * res[0].price;

			    // check if your store has enough of the product to meet the customer's request
			    if (units > res[0].stock_quantity) {
			    	console.log("Insufficient quantity!");
			    } else {
			    	updateStock(newQuantity, id, totalCost);
			    }

			    connection.end();
		  	});
	    });

    });
}



function updateStock(newQuantity, id, totalCost) {

var cost = totalCost;

  connection.query("UPDATE products SET ? WHERE ?",
    [
    {
      quantity: newQuantity
    },
    {
      id: id
    }
    ],
    function(err, res) {
      console.log("Your total purchase was " + cost + ".");
    }
    )
}





