let {Student} = require('../model/schemas');

function getAll(req, res) {
    Student.find().then((students) => {
        res.send(students);
    }).catch((err) => {
        res.send(err);
    });
}


function create(req, res) {
    let student = new Student();
    student.firstName = req.body.firstName;
    student.lastName = req.body.lastName;

    // let students = req.body.students;
    // if (students && students.length > 0) {
    //     // insertion multiple
    //     for(let i=0; i<students.length; i++) {
    //         let s = new Student();
    //         s.firstName = students[i].firstName;
    //         s.lastName = students[i].lastName;
    //         s.save();
    //     }
    //     return;
    // }

    student.save()
        .then((student) => {
                res.json({message: `student saved with id ${student.id}!`});
            }
        ).catch((err) => {
        res.send('cant post student ', err);
    });
}

module.exports = {getAll, create};
