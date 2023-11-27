from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
import requests
import random

# Declare the APP server instance
app = Flask(__name__)
app.secret_key = "your_secret_key"
# Enable CORS policies
CORS(app)

# Global variables
ingredients = {
    "Egg": {"img": "../static/img/ingredients/Egg.png"},
    "Butter": {"img": "../static/img/ingredients/Butter.png"},
    "Soy": {"img": "../static/img/ingredients/Soy.png"},
    "Yogurt": {"img": "../static/img/ingredients/Yogurt.png"},
    "Nuts": {"img": "../static/img/ingredients/Nuts.png"},
    "Wheat": {"img": "../static/img/ingredients/Wheat.png"},
    "Penaut": {"img": "../static/img/ingredients/Penaut.png"},
    "Cream": {"img": "../static/img/ingredients/Cream.png"},
    "Seafood": {"img": "../static/img/ingredients/Seafood.png"},
    "Milk": {"img": "../static/img/ingredients/Milk.png"},
}


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


@app.route("/meals/allergies", methods=["GET"])
def render_allergies():
    return render_template("allergies.html", ingredients=ingredients)


@app.route("/meals/hates", methods=["GET"])
def render_hates():
    return render_template("hates.html", meals=session.get("selected_meals"))


@app.route("/meals/recommendations", methods=["GET"])
def render_recommendations():
    temp_meals = session.get("selected_meals")
    complete_info_meals = {}
    for key, meal in temp_meals.items():
        complete_meal_info = get_complete_meal(meal["idMeal"])
        complete_info_meals[key] = complete_meal_info
    return render_template("recomendations.html", meals=complete_info_meals)


def any_ingredient_present(meal, ingredients):
    for ingredient in ingredients:
        for ingredient_number in range(1, 21):
            if meal["strIngredient" + str(ingredient_number)] == ingredient:
                print(ingredient + " present")
                return True
    return False


def get_random_meal_by_category(category):
    params = {
        "c": category,
    }
    api_url = "https://www.themealdb.com/api/json/v1/1/filter.php"
    response = requests.get(api_url, params=params)

    response_all_meals_by_category = None
    if response.status_code == 200:
        response_all_meals_by_category = response.json()
        amount_meals = len(response_all_meals_by_category["meals"])
        random_meal = response_all_meals_by_category["meals"][
            random.randint(1, amount_meals - 1)
        ]
        temp_meal = get_complete_meal(random_meal["idMeal"])
        random_meal["strArea"] = temp_meal["strArea"]
        return random_meal


@app.route("/meals/filterByAllergies", methods=["POST"])
def filter_meals_by_ingredients():
    data = request.json
    allergic_ingredients = data.get("ingredients", [])
    temp_categories = session.get("categories")
    categories = [
        category for category in temp_categories if category not in allergic_ingredients
    ]

    new_meals = {}

    for category in categories:
        added = False
        while not added:
            temp_short_meal = get_random_meal_by_category(category)
            temp_full_meal = get_complete_meal(temp_short_meal["idMeal"])
            if not any_ingredient_present(temp_full_meal, allergic_ingredients):
                temp_short_meal["strArea"] = temp_full_meal["strArea"]
                new_meals[category] = temp_short_meal
                added = True

    session["selected_meals"] = new_meals

    return "", 200


def get_complete_meal(id):
    headers = {
        "Accept": "application/json",
    }
    params = {
        "i": id,
    }
    api_url = "https://www.themealdb.com/api/json/v1/1/lookup.php"
    response = requests.get(api_url, params=params, headers=headers)

    if response.status_code == 200:
        meal_data = response.json()
        return meal_data["meals"][0]


@app.route("/meals/getRandomByCategories", methods=["GET"])
def get_random_meals_by_categories():
    previous_selected_categories = [
        "Beef",
        "Chicken",
        "Lamb",
        "Pasta",
        "Pork",
        "Seafood",
        "Vegan",
        "Vegetarian",
    ]

    meals = {}
    for category in previous_selected_categories:
        meals[category] = get_random_meal_by_category(category)

    session["selected_meals"] = meals
    return render_template("meals.html", meals=meals)


@app.route("/meals/filterByIds", methods=["POST"])
def filter_meals_by_ids():
    data = request.json
    checked_meal_ids = data.get("checkedMealIds", [])
    selected_categories = []

    meals = session.get("selected_meals")
    for key, meal in meals.items():
        if meal["idMeal"] in checked_meal_ids:
            selected_categories.append(key)

    session["categories"] = selected_categories
    return "", 200


@app.route("/meals/filterByIdsHates", methods=["POST"])
def filter_meals_by_ids_hates():
    data = request.json
    checked_meal_ids = data.get("checkedMealIds", [])
    meals = session.get("selected_meals")
    session["selected_meals"] = {
        key: meal
        for key, meal in meals.items()
        if meal["idMeal"] not in checked_meal_ids
    }

    meals = session.get("selected_meals")
    ammountOfRecommendations = data.get("ammountOfRecommendations")
    meals_items = list(meals.items())
    temp_meals = {}

    for x in range(ammountOfRecommendations):
        random_key, random_value = random.choice(meals_items)
        meals_items = [item for item in meals_items if item[0] != random_key]
        temp_meals[random_key] = random_value
    session["selected_meals"] = temp_meals

    return "", 200


# Execute the app instance
# The app will run locally in: http://localhost:5001/ after execution
if __name__ == "__main__":
    app.run(debug=True, port=5001)
