from django.urls import path
from . import views

urlpatterns = [
    path('task-list/', views.taskList, name="taskList"),
    path('task-detail/<int:id>', views.taskDetail, name="taskDetail"),
    path('task-create/', views.taskCreate, name="taskCreate"),
    path('task-update/<int:id>/', views.taskUpdate, name="taskUpdate"),
    path('task-delete/<int:id>/', views.taskDelete, name="taskDelete"),
]
