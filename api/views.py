from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . models import Task
from . serializers import TaskSerializer

@api_view(['GET'])
def taskList(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def taskDetail(request, id):
    tasks = Task.objects.get(id=id)
    serializer = TaskSerializer(tasks, many=False)
    return Response(serializer.data)    

@api_view(['POST'])
def taskCreate(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def taskUpdate(request, id):
    task = Task.objects.get(id=id)
    serializer = TaskSerializer(instance=task, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def taskDelete(request, id):
    task = Task.objects.get(id=id)
    task.delete()
    return Response("Item successfully deleted!")        
