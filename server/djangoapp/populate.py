from .models import CarMake, CarModel

def initiate():
    car_make_data = [
        {"name": "NISSAN", "description": "Great cars from Japan", "country": "Japan"},
        {"name": "Mercedes", "description": "Luxury German automotive engineering", "country": "Germany"},
        {"name": "Audi", "description": "Vorsprung durch Technik", "country": "Germany"},
        {"name": "Kia", "description": "Movement that inspires", "country": "South Korea"},
        {"name": "Toyota", "description": "Reliable Japanese automobiles", "country": "Japan"},
        {"name": "Ford", "description": "Built Ford Proud, American heritage", "country": "USA"},
        {"name": "Honda", "description": "The Power of Dreams", "country": "Japan"}
    ]

    car_make_instances = []
    for data in car_make_data:
        make, _ = CarMake.objects.get_or_create(
            name=data['name'],
            defaults={'description': data['description'], 'country': data['country']}
        )
        car_make_instances.append(make)

    car_model_data = [
        {"name": "Pathfinder", "type": "SUV", "year": 2023, "car_make": car_make_instances[0], "dealer_id": 1},
        {"name": "Qashqai", "type": "SUV", "year": 2023, "car_make": car_make_instances[0], "dealer_id": 2},
        {"name": "X-Trail", "type": "SUV", "year": 2023, "car_make": car_make_instances[0], "dealer_id": 3},
        {"name": "A-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1], "dealer_id": 1},
        {"name": "C-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1], "dealer_id": 4},
        {"name": "E-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1], "dealer_id": 5},
        {"name": "A4", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[2], "dealer_id": 1},
        {"name": "A6", "type": "SEDAN", "year": 2022, "car_make": car_make_instances[2], "dealer_id": 2},
        {"name": "Q5", "type": "SUV", "year": 2023, "car_make": car_make_instances[2], "dealer_id": 3},
        {"name": "Sorrento", "type": "SUV", "year": 2023, "car_make": car_make_instances[3], "dealer_id": 4},
        {"name": "Carnival", "type": "SUV", "year": 2023, "car_make": car_make_instances[3], "dealer_id": 5},
        {"name": "Cerato", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[3], "dealer_id": 6},
        {"name": "Corolla", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[4], "dealer_id": 1},
        {"name": "Camry", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[4], "dealer_id": 2},
        {"name": "RAV4", "type": "SUV", "year": 2023, "car_make": car_make_instances[4], "dealer_id": 3},
        {"name": "Explorer", "type": "SUV", "year": 2023, "car_make": car_make_instances[5], "dealer_id": 4},
        {"name": "Mustang", "type": "COUPE", "year": 2022, "car_make": car_make_instances[5], "dealer_id": 5},
        {"name": "F-150", "type": "TRUCK", "year": 2023, "car_make": car_make_instances[5], "dealer_id": 6},
        {"name": "Civic", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[6], "dealer_id": 7},
        {"name": "Accord", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[6], "dealer_id": 3},
        {"name": "CR-V", "type": "SUV", "year": 2023, "car_make": car_make_instances[6], "dealer_id": 4}
    ]

    for data in car_model_data:
        CarModel.objects.get_or_create(
            name=data['name'],
            car_make=data['car_make'],
            type=data['type'],
            year=data['year'],
            defaults={'dealer_id': data.get('dealer_id')}
        )
    print("Database populated with car makes and models.")
