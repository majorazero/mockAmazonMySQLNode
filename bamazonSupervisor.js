const mysql = require("mysql");
const inquirer = require("inquirer");
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

function departmentPerform(){
  connection.query("SELECT department_name FROM departments",function(err,response){
    let table = new Table({
      head: ["department_id","department_name","Product Sales","Total Profits","Over Head Costs"],
      colWidths: [15,20,18,18,18]
    });
    console.log(response);

    // for(let i = 0; i < response.length; i++){
    //
    // }
    //console.log(table.toString());
  });
}
