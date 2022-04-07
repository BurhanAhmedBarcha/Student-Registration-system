const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 4000

const router = express.Router()
let Crud = require('./crud.model')

//using packages 
app.use(cors());
app.use(bodyParser.json())

mongoose.connect(
    'mongodb+srv://Burhan:barcha123@schoolapp.ch02l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    )
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));

    router.route('/').get((req, res) => {
        Crud.find((err, results) => {
            if(err) console.log(err);
            else res.json(results)
        })
    });

    router.route('/:id').get((req, res) => {
        let id = req.params.id;
        Crud.findById(id, (err, result) =>{
            if(err) console.log(err);
            else res.json(result)
        });
    });

    router.route('/add').post((req, res)=> {
        let list = new Crud(req.body);
        list.save().then(list => {
            res.status(200).json({'list': 'Student added sucessfully'});
        }).catch(err => {
            res.status(400).send('Adding Failed')
        })
    });

    // update the student id
    router.route('/updates/:id').post((req, res)=> {
        Crud.findById(req.params.id, (err, data) => {
            if(!data) res.status(404).send('Student not found');
            else{
                data.student_name = req.body.student_name;
                data.student_address = req.body.student_address;
                data.student_number = req.body.student_number;
                data.student_entry = req.body.student_entry;
                data.student_year = req.body.student_year;
                data.student_verification = req.body.student_verification;
                
                data.save().then(data =>{
                res.json('Data student is uploaded!')
                }).catch(err => {
                    res.status(400).send('update is not possible')
                });
            };
        });
    })  

    router.route('/delete/:id').delete((req, res) => {
        Crud.findByIdAndRemove(req.params.id, (err, data)=> {
            if(err) return res.status(500).send("There was a problem delete the user.");
            res.status(200).send(`Student ${data.student_name} was deleted`);

        }); 
    });
    app.use('/all_students', router);

app.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT);
})