from django.urls import path
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # Auth endpoints
    path('login', views.login_user, name='login'),
    path('logout', views.logout_request, name='logout'),
    path('register', views.registration, name='register'),

    # Car makes and models
    path('get_cars', views.get_cars, name='getcars'),

    # Dealership endpoints
    path('get_dealers', views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),
    path('dealer/<int:dealer_id>', views.get_dealer_details, name='dealer_details'),

    # Review endpoints
    path('reviews/dealer/<int:dealer_id>', views.get_dealer_reviews, name='dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),

    # Static pages
    path('about', views.about, name='about'),
    path('contact', views.contact, name='contact'),
]
