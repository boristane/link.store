var express = require('express');
var router = express.Router();
var JsonDB = require('node-json-db');

//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("storage/db", true, true);


module.exports = router;