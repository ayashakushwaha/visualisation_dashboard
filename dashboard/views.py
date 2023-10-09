from django.shortcuts import render
from django.http import JsonResponse
from dashboard.models import DataModel
import json

def home(request):
    return render(request, "index.html")

def data(request):
    query_param = request.GET.get('query')
    if query_param:
        query = json.loads(query_param)
        result = DataModel.objects(__raw__=query)
    else:
        result = DataModel.objects.all()

    data = [item.to_json() for item in result]
    return JsonResponse(data, safe=False)