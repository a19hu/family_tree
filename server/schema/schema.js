const { buildSchema } = require('graphql');
// const students = require('../model/StudentModel');
const schema = buildSchema(`
type Student {
    roll_no: String
    name: String
    parentId: String
}

type TreeNode {
    name: Student
    roll_no: String
    children: [TreeNode]
}
  type Query {
    hello: String
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]

    students: [Student]
    student_search(search_query: String): [Student]
    all_tree_nodes: [TreeNode]
    student(roll_number: String): Student
    parent(roll_number: String): Student
    sibling(roll_number: String): [Student]
    children(roll_number: String): [Student]
  }
  
`);


const students = [
    { roll_no: '1', name: 'John Doe', parentId: null },
    { roll_no: '2', name: 'Jane Doe', parentId: '1' },
    { roll_no: '3', name: 'Jim Doe', parentId: '1' },
];



const root = {
    hello: () => {
        return 'Hello world!';
    },
    quoteOfTheDay() {
        return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
    },
    random() {
        return Math.random()
    },
    rollThreeDice() {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6))
    },

    students: () => students,
    student_search: ({ search_query }) => {
        return students.filter(student =>
            student.name.includes(search_query) || student.roll_no.includes(search_query)
        );
    },
    all_tree_nodes: () => {
        const studentDict = students.reduce((acc, student) => {
            acc[student.roll_no] = { ...student, children: [] };
            return acc;
        }, {});

        const rootNodes = [];
        students.forEach(student => {
            if (student.parentId) {
                studentDict[student.parentId].children.push(studentDict[student.roll_no]);
            } else {
                rootNodes.push(studentDict[student.roll_no]);
            }
        });

        const buildTree = node => ({
            name: node,
            roll_no: node.roll_no,
            children: node.children.map(buildTree),
        });

        return rootNodes.map(buildTree);
    },
    student: ({ roll_number }) => students.find(student => student.roll_no === roll_number),
    parent: ({ roll_number }) => {
        const student = students.find(student => student.roll_no === roll_number);
        return student ? students.find(parent => parent.roll_no === student.parentId) : null;
    },
    sibling: ({ roll_number }) => {
        const student = students.find(student => student.roll_no === roll_number);
        return student ? students.filter(sibling => sibling.parentId === student.parentId && sibling.roll_no !== roll_number) : [];
    },
    children: ({ roll_number }) => students.filter(student => student.parentId === roll_number),
};



module.exports = { schema, root }