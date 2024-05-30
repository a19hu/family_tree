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
    importFile('./data/'+req.file.filename);
    function importFile(filePath){
        var arrayToInsert = [];
        csvtojson().fromFile(filePath).then(source => {
            for (var i = 0; i < source.length; i++) {
                var singleRow = {
                    roll_no: source[i]["roll_no"].toUpperCase(),
                    name: source[i]["name"],
                    year: source[i]["year"],
                    linkedIn: source[i]["linkedIn"],
                    parentId: source[i]["parentId"].toUpperCase(),
                    picture: source[i]["picture"],

                };
                arrayToInsert.push(singleRow);
            }
            console.log(arrayToInsert)
            const result = Student.create(arrayToInsert);
            res.status(200).json({
                message: 'Student inserted successfully',
                insertedStudent: result
                
            });

        }).catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
    }
    
    // res.redirect('/')
})

// app.get('/', (req, res) => {
//     app.use(express.static(path.join(__dirname, 'frontend','build')));
//     res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
// })

app.listen(port, () => {
    console.log('Running a GraphQL API server at http://localhost:8000/graphql');
});