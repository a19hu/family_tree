from django.shortcuts import render
from django.http import HttpResponse
from .models import Student
import pandas as pd
import csv, io
from django.contrib import messages
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import StudentSerializer


class ResolveAllTreeNodes(APIView):
    def get(self, request, format=None):
        students = Student.objects.all()
        student_dict = {student.roll_no: {'name': student, 'children': []} for student in students}
        root_nodes = []

        for student_id, student_data in student_dict.items():
            if student_data['name'].parentId:
                parent_id = student_data['name'].parentId
                student_dict[parent_id]['children'].append(student_data)
            else:
                root_nodes.append(student_data)

        def build_tree(node):
            serialized_node = StudentSerializer(node['name']).data
            serialized_node['children'] = [
                build_tree(child) for child in node['children']
            ]
            return serialized_node

        tree_data = [build_tree(root_node) for root_node in root_nodes]

        return Response(tree_data)   

def index(request):
    return HttpResponse(" ")


def upload(request):
    # data = Profile.objects.all()
    data = Student.objects.all()
    prompt = {
        'order': 'Order of the CSV should be name, roll_no,year,picture,parentId,linkedIn',
        'profiles': data    
              }
    if request.method == "GET":
        return render(request, 'excelImport.html', prompt)
    csv_file = request.FILES['file']
    if not csv_file.name.endswith('.csv'):
        messages.error(request, 'THIS IS NOT A CSV FILE')
    data_set = csv_file.read().decode('UTF-8')
    io_string = io.StringIO(data_set)
    print('hello')
    next(io_string)
    for column in csv.reader(io_string, delimiter=',', quotechar="|"):
       created = Student.objects.update_or_create(
        name=column[0],
        roll_no=column[1],
        parentId=column[2],
        year=column[3],
        picture=column[3],
        linkedIn=column[4],
        
       )
    
    return render(request, 'excelImport.html')