var repl = require("repl");
var db = require("./models/index.js")

var newREPL = repl.start("Hello P> ");

newREPL.context.db = db;