var express = require('express');
var router = express.Router();
var JsonDB = require('node-json-db');

//The third argument is to ask JsonDB to save the database in an human readable format. (default false) 
var db = new JsonDB("storage/db", true, true);

router.get("/", function (req, res) {
    res.redirect("api/links");
});

/* "/links" url : access to all links */
// GET
router.get("/links", function (req, res) {
    var data;
    try {
        data = db.getData("/links");
    } catch (error) {
        data = [];
    }
    res.send({
        links: data
    });
});

// POST
router.post("/links", function (req, res) {
    const link = {
        name: req.body.name,
        title: req.body.title,
        link: req.body.link
    };
    db.push("/links[]", link, true);
    res.redirect("/api/links");
});

// DELETE
router.delete("/links", function (req, res) {
    db.delete("/links");
    res.redirect("/api/links");
});

/* "/links/:id" url : access to a specific link */

module.exports = router;