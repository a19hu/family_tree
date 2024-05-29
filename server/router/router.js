const express = require('express');
const Student = require('../model/StudentModel');
const router = express.Router();


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
                if (studentDict[parentId]) {
                    studentDict[parentId].children.push(studentData);
                } else {
                    console.error(`Parent with ID ${parentId} not found for student with ID ${studentData.roll_no}`);
                }
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
         console.log(treeData)
        res.status(200).json(treeData);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router