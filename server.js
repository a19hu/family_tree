// https://github.com/bradtraversy/project-mgmt-graphql/blob/main/.env.example
const express = require('express');
require('dotenv').config();
var { createHandler } = require("graphql-http/lib/use/express")
const { schema, root } = require('./schema/schema');
const ConnectDB = require('./config/db');
const port = process.env.PORT || 8000;
const cors = require('cors');
const router = require('./router/router');
const multer = require('multer');
const path = require('path');
const csvtojson = require('csvtojson')
const Student = require('./model/StudentModel');
var excelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data');     
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
var excelUploads = multer({ storage: excelStorage });

const app = express();
ConnectDB();




app.use(cors(
    {
        origin: ['http://localhost:3000','https://demo-frontend-gamma.vercel.app','https://demo-frontend-gamma.vercel.app/'],
        methods:['POST','GET'],
        credentials: true
    }
));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://drive.google.com"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json());
app.use('/api',router)
app.use('/graphql', createHandler({
    schema: schema,
    rootValue: root,
    graphiql: true, 
}));

app.get('/data', (req, res) => {
    res.render('index.ejs');

});

app.post('/uploadExcelFile', excelUploads.single("uploadfile"), (req, res) => {
    importFile('./data/' + req.file.filename)
        .then(() => {
            res.status(200).json({
                message: 'Student inserted successfully'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message + 'also new student added'
            });
        });
});

async function importFile(filePath) {
    const arrayToInsert = [];
    const source = await csvtojson().fromFile(filePath);
    for (const record of source) {
        const singleRow = {
            roll_no: record["roll_no"].toUpperCase(),
            name: record["name"],
            year: record["year"],
            linkedIn: record["linkedIn"],
            parentId: record["parentId"].toUpperCase(),
            picture: record["picture"]
        };
        arrayToInsert.push(singleRow);
    }
    await Student.create(arrayToInsert);
}

// app.get('/', (req, res) => {
//     app.use(express.static(path.join(__dirname, 'frontend','build')));
//     res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
// })

app.listen(port, () => {
    console.log('Running a GraphQL API server at http://localhost:8000/graphql');
});