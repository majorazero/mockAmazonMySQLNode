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
        viewLowInv();
        break;
      case "Add to Inventory":
        console.log("Oh! Let me grab the company credit card!");
        addInven();
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
function viewLowInv(){
  connection.query("SELECT * FROM products WHERE stock_quantity < ?",[5],function(err,res){
    for(let i = 0; i < res.length; i++){
      console.log(">>>>>>>>>>>>>>");
      console.log("Item: "+res[i].product_name+"\nPrice: $"+res[i].price+
                "\nStoreID: "+res[i].item_id+"\nQuantity: "+res[i].stock_quantity);
    }
    mainMenu();
  });
}
function addInven(){
  connection.query("SELECT product_name, item_id,stock_quantity FROM products",function(err,res){
    let choicesList = [];
    for(let i = 0; i < res.length; i++){
      choicesList.push("Item: "+res[i].product_name+" Qty: "+res[i].stock_quantity+" StoreId: "+res[i].item_id);
    }
    inquirer.prompt({
      message: "What item you wanna add more inventory of?",
      type: "list",
      choices: choicesList,
      name: "itemChoice"
    }).then(function(inqRes){
      let productId = parseInt(inqRes.itemChoice.substring(inqRes.itemChoice.lastIndexOf(":")+2));
      //update product
      inquirer.prompt({
        message: "How much?",
        type: "input",
        name: "amount"
      }).then(function(qtyAmt){
        console.log("Adding!");
        connection.query("SELECT stock_quantity FROM products WHERE item_id = ?",[productId],function(err,respso){
          connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[parseInt(qtyAmt.amount)+parseInt(respso[0].stock_quantity),productId],function(err,respo){
            console.log("Added!");
            mainMenu();
          });
        });
      });
    });
  });
}