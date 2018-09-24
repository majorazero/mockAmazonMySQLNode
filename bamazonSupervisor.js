const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require("chalk");
const Table = require("cli-table");

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
  mainMenu();
});

function mainMenu(){
  inquirer.prompt({
    type: "list",
    choices: ["View Product Sales by Department", "Create New Department"],
    name: "action",
    message: "Hey boss! What you gonna do today?"
  }).then(function(action){
    switch(action.action){
      case "View Product Sales by Department":
        console.log("Let's view performance by department!");
        departmentPerform();
        break;
      default:
        console.log("Oooh, let's make a new department!");
        addDepartment();
    }
  });
}

function departmentPerform(){
  connection.query("SELECT * FROM products RIGHT JOIN departments ON departments.department_name = products.department_name ORDER BY departments.department_id",function(err,res){
    let table = new Table({
      head: [chalk.hex("#719dba")("Department ID"),chalk.hex("#719dba")("Department Name"),chalk.hex("#719dba")("Over Head Costs($)"), chalk.hex("#719dba")("Product Sales($)"), chalk.hex("#719dba")("Total Profit($)")]
    });
    let currDepId;
    let currDepInfo = {};
    for(let i = 0; i < res.length; i++){
      if (res[i].department_id !== currDepId){
        if(currDepId !== undefined){
          table.push([currDepId,
                        currDepInfo.departmentName,
                        currDepInfo.overHeadCost,
                        currDepInfo.product_sales,
                        currDepInfo.product_sales-currDepInfo.overHeadCost]);
        }
        //if the current dep id is not equal to the current department id, we set it to the new one
        currDepId = res[i].department_id;
        currDepInfo = {};
        currDepInfo.overHeadCost = res[i].over_head_costs;
        currDepInfo.departmentName = res[i].department_name;
        if(res[i].product_sales === null){
          currDepInfo.product_sales = 0;
        }
        else {
          currDepInfo.product_sales = res[i].product_sales;
        }
        if(i === res.length-1){
          table.push([currDepId,
                        currDepInfo.departmentName,
                        currDepInfo.overHeadCost,
                        currDepInfo.product_sales,
                        currDepInfo.product_sales-currDepInfo.overHeadCost]);
        }
      }
      else {
        if(res[i].product_sales === null){
          currDepInfo.product_sales = 0;
        }
        else {
          currDepInfo.product_sales += res[i].product_sales;
        }
      }
    }
  console.log(table.toString());
  mainMenu();
  });
}

function addDepartment(){
  inquirer.prompt({
    message: "What's the name of the new department?",
    type: "input",
    name: "input"
  }).then(function(input){
    connection.query("SELECT department_name FROM departments WHERE department_name = ?",[input.input], function(err,response){
      if(response.length === 0){
        inquirer.prompt({
          message: "What's the overhead?",
          type: "input",
          name:"input"
        }).then(function(overhead){
          connection.query("INSERT INTO departments SET ?",{
            department_name: input.input,
            over_head_costs: overhead.input
          },function(err,re){
            console.log("New department created!");
            mainMenu();
          });
        });
      }
      else {
        console.log("This department already exists!");
        mainMenu();
      }
    });
  });
}
