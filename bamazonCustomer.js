const mysql = require("mysql");
const inquirer = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(error){
  if(error) throw error;
  console.log("connected as id " + connection.threadId + "\n");
  displayData();
});
/**
* This will display all the initial data.
*/
function displayData(){
  connection.query("SELECT * FROM products",function(err,res){
    if(err){
      console.log(err);
    }
    else{
      console.log("These are following items we have in stock...");
      for(let i = 0; i < res.length; i++){
        console.log(">>>>>>>>>>>>>>");
        console.log("Item: "+res[i].product_name+"\nPrice: $"+res[i].price+
                  "\nStoreID: "+res[i].item_id);
      }
      //inquirer purchase prompt begins
      purchaseInq();
    }
  });
}
/**
* This will handle the purchasing actions and updating the database.
*/
function purchaseInq(){
  inquirer.prompt({
    message: "What's the StoreID of the product you'd like to buy?",
    type: "input",
    name: "input"
  }).then(function(product){
    inquirer.prompt({
      message: "How many items would you like to buy?",
      type: "input",
      name: "input"
    }).then(function(stock){
      //we'll check the database
      connection.query("SELECT stock_quantity, price, product_sales FROM products WHERE item_id = ?",[product.input],function(err,res){
        if(err){
          console.log(err);
        }
        else {
          if(stock.input > res[0].stock_quantity){
            console.log("Insufficient quantity!");
          }
          else {
            console.log("Fulfilling!");
            connection.query("UPDATE products SET ? WHERE item_id = ?",
          [{stock_quantity: res[0].stock_quantity-stock.input,
            product_sales: res[0].product_sales+stock.input*res[0].price},product.input],function(err,upRes){
            console.log("Fulfilled! You spent $"+stock.input*res[0].price);
          });
          }
          displayData();
        }
      })
    });
  });
}
