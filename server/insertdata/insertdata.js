const express = require('express');
const Student = require('../model/StudentModel');
const router = express.Router();

router.post('/insertdata', async (req, res) => {
    const { roll_no, name, year, linkedIn, parentId, picture } = req.body;

    try {
        const student = new Student({ roll_no, name, year, linkedIn, parentId, picture });
        const result = await student.save();

        res.status(201).json({
            message: 'Student created successfully',
            createdStudent: result
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});



module.exports = router