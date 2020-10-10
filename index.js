const express = require('express')
const app = express()
var path = require('path');
var fs = require('fs');
var config = require('./db.json')

//<meta http-equiv="refresh" content="time; URL=new_url" />

const reflist = config.reflist

reflist.forEach(function (file) {
    var ref = file.ref
    var url = file.url
    fs.writeFile(path.join(__dirname + `/views/${ref}.html`), `<meta http-equiv="refresh" content="0; URL=${url}" />`, function (err) {
        if (err) return console.log(err);
      });
});

fs.readdir('./views', function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach

    console.log(files)

    files.forEach(function (file) {
        // Do whatever you want to do with the file
        file = file.replace('.html', '')
        app.get(`/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname + `/views/${file}.html`))
          })
        console.log(`Served ref link ${file}`); 
    });
});

app.listen(3000)