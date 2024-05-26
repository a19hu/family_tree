import graphene
from graphene_django import DjangoObjectType
from student.models import Student
from django.db.models import Q


class StudentType(DjangoObjectType):
    class Meta:
        model= Student
        fields = "__all__"

class TreeType(DjangoObjectType):
    class Meta:
        model= Student
        fields = ('roll_no','name')


class Query(graphene.ObjectType):
    students=graphene.List(StudentType)
    student_search= graphene.List(StudentType, search_query=graphene.String())
    all_tree_nodes = graphene.List(TreeType)
    student = graphene.Field(StudentType, roll_number=graphene.String())
    parent = graphene.Field(StudentType, roll_number=graphene.String())
    sibling = graphene.List(StudentType, roll_number=graphene.String())
    children = graphene.List(StudentType, roll_number=graphene.String())
   
    

    def resolve_student(self, info, roll_number):
        student = Student.objects.get(roll_no=roll_number)
       
        return student

    def resolve_parent(self, info, roll_number):
        student = Student.objects.get(roll_no=roll_number)
        parent = None

        if student.parentId:
            parent = Student.objects.get(roll_no=student.parentId)

        return parent
    def resolve_children(self, info, roll_number):
        student = Student.objects.get(roll_no=roll_number)
        children = None
        children = list(Student.objects.filter(parentId=student.roll_no))
        
        return children
    def resolve_sibling(self, info, roll_number):
        student = Student.objects.get(roll_no=roll_number)
        siblings = None

        if student.parentId:
            siblings = list(Student.objects.filter(parentId=student.parentId).exclude(roll_no=student.roll_no))

        
        return siblings
    def resolve_all_tree_nodes(self, info):
      students = Student.objects.all()
      student_dict = {student.roll_no: {'name': student, 'roll_no': student.roll_no, 'children': []} for student in students}
      root_nodes = []
      for student_id, student_data in student_dict.items():
        if student_data['name'].parentId:
            parent_id = student_data['name'].parentId
            student_dict[parent_id]['children'].append(student_data)
        else:
            root_nodes.append(student_data)

      def build_tree(node):
        serialized_node = {'name': node['name'], 'roll_no': node['roll_no'], 'children': []}
        for child in node['children']:
            serialized_child = build_tree(child)
            serialized_node['children'].append(serialized_child)
        return serialized_node          


      tree_data = [build_tree(root_node) for root_node in root_nodes]
    #   print(tree_data)
      return tree_data
    
  
    def resolve_student_node(root,info,roll):
        return Student.objects.get(roll_no=roll)

    def resolve_students(root,info):
        return Student.objects.all()



    def resolve_student_search(root,info, search_query):
        return Student.objects.filter(Q(name__icontains=search_query) | Q(roll_no__icontains= search_query))[0:8]

schema=graphene.Schema(query=Query)