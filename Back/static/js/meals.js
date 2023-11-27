const restartButton = document.getElementById('restart_btn')
restartButton.addEventListener('click', () => window.location.href = 'http://localhost:5001/meals/getRandomByCategories')

const nextButton = document.getElementById('next_btn');
nextButton.addEventListener('click', () => {
    proceedWithIngredients();
});

function proceedWithIngredients() {
    let mealsIds = verifyAndCreateSelectedMeals();
    if(mealsIds != false) {
        let dataToSend = {
            checkedMealIds: mealsIds
        };
        fetch('http://localhost:5001/meals/filterByIds', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            if (response.status == 200) {
                window.location.href = 'http://localhost:5001/meals/allergies';
            } else {
                alert("Error del servidor");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function verifyAndCreateSelectedMeals() {
    let checkboxes = document.querySelectorAll('.meal-checkbox');
    let checkedMealIds = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedMealIds.push(checkbox.getAttribute('data-meal-id'));
        }
    });

    if(checkedMealIds.length <= 3) {
        alert("Debes elegir al menos 4 platos")
        return false;
    } else {
        return checkedMealIds;
    }
}