const { buildSchema } = require('graphql');
const Student = require('../model/StudentModel');
const schema = buildSchema(`
type Student {
    roll_no: String
    name: String
    parentId: String
}


  type Query {
    students: [Student]
    student_search(search_query: String): [Student]
    student(roll_number: String): Student
    parent(roll_number: String): Student
    sibling(roll_number: String): [Student]
    children(roll_number: String): [Student]
  }
  
`);

const root = {
    students: async () => {

        return await Student.find();
    },
    student: async ({ roll_number }) => {
        try {
            const student = await Student.findOne({ roll_no: roll_number });
            return student;
        } catch (err) {
            throw new Error("Error retrieving user");

        }
    },
    parent: async ({ roll_number }) => {
        try{
            const student = await Student.findOne({ roll_no: roll_number });
            const parent = await Student.findOne({ roll_no: student.parentId });
            return parent;  
            
        }catch(err){
            throw new Error("Error retrieving user");
        }
    },
    children: async ({ roll_number }) => {
        try{
         const children= await Student.find({ parentId: roll_number });
         return children;
        }catch(err){
            throw new Error("Error retrieving user");
        }
    },
    sibling: async ({ roll_number }) => {
        try{
            const student= await Student.findOne({ roll_no: roll_number });
            const sibling = await Student.find({ parentId: student.parentId });
         return sibling ;
        }catch(err){
            throw new Error("Error retrieving user");
        }
    },
    student_search: async ({ search_query }) => {
        try{
            const students = await Student.find({
                $or: [
                    { roll_no: search_query },
                    { name: search_query }
                ]
            });
            return students;

        }catch(err){
            throw new Error("Error retrieving user");
        }
    },
     
    
  
};



module.exports = { schema, root }