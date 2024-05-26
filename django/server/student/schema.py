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

# def tree_for_batch(root,info,batch):
#     tree_for_batch=[]
#     for student in batch:
#         roll= student.roll_no
#         pathObjects=[]
#         while(Student.objects.get(roll_no=roll).parentId!=None):
#             student=Student.objects.get(roll_no=roll)
#             pathObjects.append(student)
#             roll= student.parentId
#         pathObjects.append(Student.objects.get(roll_no=roll))
#         tree_for_batch.append(pathObjects)
#     return tree_for_batch
# def _build_tree(self, node):
#      children = Student.objects.filter(parentId=node)
#      return {
#         'node': node,
#         'children': [self._build_tree(child) for child in children]
#      }

class Query(graphene.ObjectType):
    students=graphene.List(StudentType)
    # childrens=graphene.List(StudentType, parentId=graphene.String())
    # student_path= graphene.List(StudentType, roll=graphene.String())
    # student_sibling= graphene.List(StudentType)
    student_search= graphene.List(StudentType, search_query=graphene.String())
    # student_batch= graphene.List(graphene.List(StudentType), roll=graphene.String())
    # student_node= graphene.Field(StudentType, roll=graphene.String())
    all_tree_nodes = graphene.List(TreeType)
    # tree_data = graphene.Field(TreeNodeType)
    student = graphene.Field(StudentType, roll_number=graphene.String())
    parent = graphene.Field(StudentType, roll_number=graphene.String())
    sibling = graphene.List(StudentType, roll_number=graphene.String())
    children = graphene.List(StudentType, roll_number=graphene.String())
    # tree_nodes = graphene.Field(TreeNodeType)
    # tree_data_student = graphene.Field(StudentType)

    # def resolve_tree_nodes(self, info):
    #     return TreeNode.objects.filter(parent=None)
    

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
    # def resolve_tree_data(self, info):
    #     root_nodes= TreeNode.objects.filter(parent__isnull=True)
    #     # return [self._build_tree(node) for node in root_nodes]
    #     for node in root_nodes:
    #         # children= TreeNode.objects.filter(parent=node)
    #         self._build_tree(node)
    #         # print(node)
    #         # print(children)
        
    # def _build_tree(self, node):
    #     children = TreeNode.objects.filter(parent=node)
    #     print( {
    #         'node': node,
    #         'children': [self._build_tree(child) for child in children]
    #     })
    # def resolve_tree_data(self, info):
    #  root_nodes = TreeNode.objects.filter(parent__isnull=True)
    #  tree_data = []
    #  for node in root_nodes:
    #     tree_data.append(self._build_tree(node))
    #  print(tree_data) 
    
    # def resolve_all_tree_nodes(self, info):
    #  students = Student.objects.all()
    #  student_dict = {student.roll_no: {'name': student, 'children': []} for student in students}
    #  root_nodes = []
    # #  print(student_dict['B21AI044'])
    # #  student_data=student_dict['B22CS015']
    # #  print(type(student_data))
    # #  student_dict['B21AI044']['children'].append(student_data)
    # #  print(student_dict)
    #  for student_id, student_data in student_dict.items():
    # #     #  print(student_id)
    # #     #  print(student_data['node'].parentId)
    #     if student_data['name'].parentId:
    #         parent_id = student_data['name'].parentId
    # #     #     # print(student_id)
    # #         print(student_data)
    #         student_dict[parent_id]['children'].append(student_data)
    # #     #     print('now',student_dict)
    #     else:
    #         root_nodes.append(student_data)
    # #  print(student_dict)
    #  print(root_nodes)
    
    # #  tree_data = [root_node for root_node in root_nodes if root_node]
    # #  return student_dict
    #  serialized_tree_data = []

    #  for root_node in root_nodes:
    #         print('hii',root_node['children'][0])
    #         serialized_root_node = root_node['name']
    #         # print(root_node['children'])
    #         serialized_root_node.children = [
    #             child['name'] for child in root_node['children']
    #         ]
    #         serialized_tree_data.append(serialized_root_node)
    #  print(serialized_tree_data)
    #  return serialized_tree_data
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
    
    # def resolve_all_tree_nodes(self, info):
    #  root_nodes = Student.objects.filter(parentId=None)
    #  tree_data = []
    #  for node in root_nodes:
    #     if node is not None:
    #      tree_data.append(self._build_tree(node))
    #  return tree_data

    # def _build_tree(self, node):
    #  children = Student.objects.filter(parentId=node)
    #  if children:
    #     return {
    #         'node': node,
    #         'children': [self._build_tree(child) for child in children]
    #     }
    #  else:
    #     return {'node': node, 'children': []}

    # def resolve_children(self, info, **kwargs):
    #     parent_id = kwargs.get('parentId')
    #     if parent_id:
    #         return StudentType.objects.filter(parent_id=parent_id)
    #     return None
    def resolve_student_node(root,info,roll):
        return Student.objects.get(roll_no=roll)

    def resolve_students(root,info):
        return Student.objects.all()

    # def resolve_children(root, info, parentId):
    #     return Student.objects.filter(parentId=parentId)
    
    # def resolve_student_path(root, info, roll):
    #     pathObjects=[]
    #     while(Student.objects.get(roll_no=roll).parentId!=None):
    #         student=Student.objects.get(roll_no=roll)
    #         pathObjects.append(student)
    #         roll= student.parentId
    #     pathObjects.append(Student.objects.get(roll_no=roll))
    #     return pathObjects
    
    # def resolve_student_sibling(root,info):
    #     student=list(Student.objects.all())
    #     siblings=[]
    #     for i in range(len(student)):
    #         parentid=student[i].parentId
    #         siblings.extend(Student.objects.filter(parentId=parentid))
    #     # print(siblings)
    #     return siblings
    #     #             #    .exclude(roll_no=roll)


    # def resolve_student_batch(root,info,roll):
    #     current_node= Student.objects.get(roll_no=roll)
    #     year_of_node= current_node.year
    #     current_batch= Student.objects.filter(year=year_of_node)
    #     tree_for_batch=[]
    #     for person in current_batch:
    #         tree_for_batch.append(Query.resolve_student_path(root,info,person.roll_no))
    #     return tree_for_batch
    #     return tree_for_batch(root,info,current_batch)


    def resolve_student_search(root,info, search_query):
        return Student.objects.filter(Q(name__icontains=search_query) | Q(roll_no__icontains= search_query))[0:8]
# class CreateTreeNode(graphene.Mutation):
#     class Arguments:
#         name = graphene.String()
#         parent_id = graphene.Int()

#     tree_node = graphene.Field(TreeNodeType)

#     def mutate(self, info, name, parent_id=None):
#         parent = TreeNode.objects.filter(id=parent_id).first() if parent_id else None
#         tree_node = TreeNode(name=name, parent=parent)
#         tree_node.save()
#         return CreateTreeNode(tree_node=tree_node)

# class Mutation(graphene.ObjectType):
#     create_tree_node = CreateTreeNode.Field()

schema=graphene.Schema(query=Query)