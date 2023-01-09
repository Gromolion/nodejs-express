const express = require('express');
const fs = require('fs');
const path = require("path");
const bodyParser = require("body-parser");

const urlencodedParser = bodyParser.urlencoded({extended: false});

const app = express();
// app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));
app.use(urlencodedParser);
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.post('/', (req, res) => {
    let title = req.body.title;
    let ext = req.body.ext;
    let content = req.body.content;

    fs.writeFile(`uploaded/${title}.${ext}`, content, (err) => {
        if (err) throw err;
    });

    res.render('add.ejs');
});
app.get('/get', (req, res) => {
    let files = fs.readdirSync('./uploaded', {withFileTypes: true});

    res.render('get.ejs', {files: files});
});
app.post('/file', (req, res) => {
    let content = fs.readFileSync(`uploaded/${req.body.title}`);
    res.render('file.ejs', {
        fileName: req.body.title,
        fileContent: content
    });
});
app.post('/update-form', (req, res) => {
    let content = fs.readFileSync(`uploaded/${req.body.name}`);
    let ext = path.extname(req.body.name);
    let title = path.basename(req.body.name, ext);

    res.render('update-form.ejs', {
        title: title,
        content: content,
        ext: ext.replace('.', '')
    });
});
app.post('/update', (req, res) => {
    fs.unlinkSync(`uploaded/${req.body.oldTitle}.${req.body.oldExt}`);
    fs.writeFile(`uploaded/${req.body.title}.${req.body.ext}`, req.body.content, function (err) {
        if (err) throw err;
    });

    res.render('update.ejs');
});
app.post('/delete', (req, res) => {
    fs.unlinkSync(`uploaded/${req.body.title}`);

    res.render('delete.ejs');
});

app.listen(8000);