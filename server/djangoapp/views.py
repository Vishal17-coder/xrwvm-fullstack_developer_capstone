import json
import os
from pathlib import Path
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import CarMake, CarModel
from .populate import initiate
from .restapis import get_request, analyze_review_sentiments, post_review

BASE_DIR = Path(__file__).resolve().parent.parent

def load_local_dealers():
    try:
        path = BASE_DIR / 'database' / 'data' / 'dealers.json'
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f).get('dealers', [])
    except Exception as e:
        print(f"Error loading local dealers: {e}")
        return []

def load_local_reviews():
    try:
        path = BASE_DIR / 'database' / 'data' / 'reviews.json'
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f).get('reviews', [])
    except Exception as e:
        print(f"Error loading local reviews: {e}")
        return []

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        response_data = {"userName": username}
        if user is not None:
            login(request, user)
            response_data["status"] = "Authenticated"
        else:
            response_data["status"] = "Failed"
            response_data["error"] = "Invalid credentials"
        return JsonResponse(response_data)
    return JsonResponse({"error": "POST method required"}, status=400)

def logout_request(request):
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged out"})

@csrf_exempt
def registration(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get('userName')
        password = data.get('password')
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')

        username_exist = User.objects.filter(username=username).exists()

        if not username_exist:
            user = User.objects.create_user(
                username=username,
                first_name=first_name,
                last_name=last_name,
                password=password,
                email=email
            )
            login(request, user)
            return JsonResponse({"userName": username, "status": "Authenticated"})
        else:
            return JsonResponse({"userName": username, "error": "Already Registered"})
    return JsonResponse({"error": "POST method required"}, status=400)

def get_cars(request):
    count = CarMake.objects.count()
    if count == 0:
        initiate()

    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name,
            "Year": car_model.year,
            "Type": car_model.type,
            "DealerId": car_model.dealer_id
        })
    return JsonResponse({"CarModels": cars})

def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
        dealers = get_request(endpoint)
        if dealers is None:
            dealers = load_local_dealers()
    else:
        endpoint = f"/fetchDealers/{state}"
        dealers = get_request(endpoint)
        if dealers is None:
            all_dealers = load_local_dealers()
            dealers = [d for d in all_dealers if d.get('state', '').lower() == state.lower() or d.get('st', '').lower() == state.lower()]

    return JsonResponse({"status": 200, "dealers": dealers})

def get_dealer_details(request, dealer_id):
    endpoint = f"/fetchDealer/{dealer_id}"
    dealer = get_request(endpoint)
    if dealer is None:
        all_dealers = load_local_dealers()
        dealer = next((d for d in all_dealers if d.get('id') == int(dealer_id)), None)

    if dealer:
        return JsonResponse({"status": 200, "dealer": dealer})
    return JsonResponse({"status": 404, "message": "Dealer not found"}, status=404)

def get_dealer_reviews(request, dealer_id):
    endpoint = f"/fetchReviews/dealer/{dealer_id}"
    reviews = get_request(endpoint)
    if reviews is None:
        all_reviews = load_local_reviews()
        reviews = [r for r in all_reviews if r.get('dealership') == int(dealer_id)]

    for review_detail in reviews:
        if 'review' in review_detail:
            response = analyze_review_sentiments(review_detail['review'])
            review_detail['sentiment'] = response.get('sentiment', 'neutral')

    return JsonResponse({"status": 200, "reviews": reviews})

@csrf_exempt
def add_review(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            result = post_review(data)
            return JsonResponse({"status": 200, "message": "Review submitted successfully", "result": result})
        except Exception as e:
            return JsonResponse({"status": 400, "message": f"Error posting review: {str(e)}"}, status=400)
    return JsonResponse({"error": "POST method required"}, status=400)

def about(request):
    return render(request, 'About.html')

def contact(request):
    return render(request, 'Contact.html')
