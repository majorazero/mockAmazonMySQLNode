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
        addNewProd();
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
        if(typeof qtyAmt.amount !== "number"){
          console.log("Gotta put in a number there bud, why did we hire you again?");
          mainMenu();
          return;
        }
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

function addNewProd(){
  connection.query("SELECT * FROM products",function(err,response){
    inquirer.prompt({
      message: "What is the item name of what you want to add?",
      type: "input",
      name: "name"
    }).then(function(name){
      for(let i = 0; i < response.length; i++){
        if(name.name === response[i].product_name){
          console.log("This item already exists!");
          mainMenu();
          return;
        }
      }
      //sets department
      inquirer.prompt({
        message: "What department does this belong to?",
        type: "input",
        name: "department"
      }).then(function(dept){
        //add price
        inquirer.prompt({
          message:"What price you want to set this at?",
          type: "input",
          name: "price"
        }).then(function(price){
          if(typeof price.price !== "number"){
            console.log("Gotta put in a number there bud, why did we hire you again?");
            mainMenu();
            return;
          }
          connection.query("INSERT INTO products SET ?",{
            product_name: name.name,
            department_name: dept.department,
            price: price.price,
            stock_quantity: 0
          },function(err,resp){
            if(err){
              console.log(err);
            }
            else {
              console.log("Product Added!");
            }
            mainMenu();
          });
        });
      });
    });
  });
}
