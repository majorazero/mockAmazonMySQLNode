let mysql = require("mysql");
let inquirer = require("inquirer");

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

mainMenu();

function mainMenu(){
  inquirer.prompt({
    message: "Hey hey, it's the manager, what you wanna do today?",
    type: "list",
    name: "action",
    choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]
  }).then(function(response){
    switch(response.action){
      case "View Products for Sale":
        console.log("Ok let's view some products!");
        listItems();
        break;
      case "View Low Inventory":
        console.log("Ok let's view some products we're running out of!");
        break;
      case "Add to Inventory":
        console.log("Oh! Let me grab the company credit card!");
        break;
      default:
        console.log("Ohh, exciting!");
    }
  });
}

function listItems(){
  connection.query("SELECT * FROM products",function(err,res){
    for(let i = 0; i < res.length; i++){
      console.log(">>>>>>>>>>>>>>");
      console.log("Item: "+res[i].product_name+"\nPrice: $"+res[i].price+
                "\nStoreID: "+res[i].item_id+"\nQuantity: "+res[i].stock_quantity);
    }
    mainMenu();
  });
}
