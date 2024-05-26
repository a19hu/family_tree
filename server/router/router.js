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

router.get('/alltree', async (req, res) => {
    try {
        const students = await Student.find();
        const studentDict={};
        const rootNodes=[];

        students.forEach(student => {
            studentDict[student.roll_no] = { name: student, roll_no: student.roll_no, children: [] };
        })
        Object.values(studentDict).forEach(studentData => {
            if (studentData.name.parentId) {
                const parentId = studentData.name.parentId;
                studentDict[parentId].children.push(studentData);
            } else {
                rootNodes.push(studentData);
            }
        });
        const buildTree = (node) => {
            const serializedNode = {
                rollNo: node.name.roll_no,
                name: node.name.name,
                parentId: node.name.parentId,
                children: node.children.map(buildTree)
            };
            return serializedNode;
        };
        const treeData = rootNodes.map(buildTree);

        console.log(studentDict)
        res.status(200).json(treeData);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router