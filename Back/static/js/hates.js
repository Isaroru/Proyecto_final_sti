const restartButton = document.getElementById('restart_btn');
restartButton.addEventListener('click', () => window.location.href = 'http://localhost:5001/meals/getRandomByCategories');

const nextButton = document.getElementById('next_btn');
nextButton.addEventListener('click', () => {
    proceedWithRecommendations();
});

var elements = document.querySelectorAll('.meal-checkbox');
for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener('change', () => {
        recalculateOptionsRecomendations();
    });
}

function recalculateOptionsRecomendations() {
    let checkboxes = document.querySelectorAll('.meal-checkbox');
    let nonSelectedCount = 0;
    checkboxes.forEach(function(checkbox) {
        if (!checkbox.checked) {
            nonSelectedCount += 1;
        }
    });
    createOptions(nonSelectedCount);
}

function createOptions(numberOfOptions) {
    let select = document.getElementById('recommendations-select');
    select.innerHTML = '';
    if(numberOfOptions == 0) {
        return false;
    }
    for (var i = 1; i<=numberOfOptions; i += 2){
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = i;
        if(i == 3) {
            i += 1;
        }
        select.appendChild(opt);
    }
}

function proceedWithRecommendations() {
    let mealsIds = verifyAndCreateSelectedMeals();
    var selectElement = document.getElementById('recommendations-select');
    var selectedValue = selectElement.value;

        let dataToSend = {
            checkedMealIds: mealsIds,
            ammountOfRecommendations: parseInt(selectedValue)
        };
        document.getElementById('loading-screen').style.display = 'block';
        fetch('http://localhost:5001/meals/filterByIdsHates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            if (response.status == 200) {
                window.location.href = 'http://localhost:5001/meals/recommendations';
            } else {
                alert("Error del servidor");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
}

function verifyAndCreateSelectedMeals() {
    var selectElement = document.getElementById('recommendations-select');
    var selectedValue = selectElement.value;
    if(selectedValue == undefined || selectedValue == "") {
        alert("Debes dejar al menos 1 recomendación");
        return false;
    }

    let checkboxes = document.querySelectorAll('.meal-checkbox');
    let checkedMealIds = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedMealIds.push(checkbox.getAttribute('data-meal-id'));
        }
    });
    return checkedMealIds;
}

recalculateOptionsRecomendations();