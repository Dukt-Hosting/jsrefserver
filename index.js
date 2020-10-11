const express = require('express')
const app = express()
var path = require('path');
var fs = require('fs');
const bodyParser = require('body-parser');
var config = require('./db.json');
const { json } = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const reflist = config.reflist

reflist.forEach(function (file) {
    var ref = file.ref
    var url = file.url
    if (ref == 'index'){
        return
    };
    app.get(`/${ref}`, function (req, res) {
        res.redirect(url)
        //res.sendFile(__dirname + `/views/${ref}.html`)
    })
});
app.post('/testpost', function(req, res) {
    console.log(req.body)
    res.end()
});
app.post('/shorten', function(req, res){
    var jsonstr = req.body
    console.log(req.body);
    console.log(jsonstr);
    if (jsonstr.url.startsWith("http") === false){
        res.sendStatus(223)
       res.end()
       return
    };
    if(config.tooken.includes(jsonstr.ref) === true){
        console.log('Received request to shorten a already tooken page stopping...')
        res.sendStatus(222)
        res.end()
        return
    };
    config.tooken.push(jsonstr.ref);
    config.reflist.push({"ref": jsonstr.ref, "url": jsonstr.url})
    fs.writeFile('./db.json', JSON.stringify(config, null, 4), function (err) {
        if (err) return console.log(err);
    });
    res.end(); // end the response
});
//starts the express server on the specified port
app.listen(8766, function(){
    console.log('Express listening on port', this.address().port)
});
