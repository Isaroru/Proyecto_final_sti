const restartButton = document.getElementById('restart_btn')
restartButton.addEventListener('click', () => window.location.href = 'http://localhost:5001/meals/getRandomByCategories')

const noneAllergies = document.getElementById('none-checkbox');
noneAllergies.addEventListener('change', () => {
    controlNoneAllergies();
});

function controlNoneAllergies() {
    let checkbox = document.getElementById('none-checkbox');
    if (checkbox.checked) {
        uncheckAndDisableCheckboxes();
    } else {
        ableCheckboxes();
    }
}

function uncheckAndDisableCheckboxes() {
    var checkboxes = document.querySelectorAll('.ingredient-checkbox');

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
        checkboxes[i].disabled = true;
    }
}

function ableCheckboxes() {
    var checkboxes = document.querySelectorAll('.ingredient-checkbox');

    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].disabled = false;
    }
}

const nextButton = document.getElementById('next_btn')
nextButton.addEventListener('click', () => {
    proceedWithHates();
});

function proceedWithHates() {
    let ingredientNames = verifyAndCreateSelectedMeals();

    let dataToSend = {
        ingredients: ingredientNames
    };
    document.getElementById('loading-screen').style.display = 'block';
    fetch('http://localhost:5001/meals/filterByAllergies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => {
        if (response.status == 200) {
            window.location.href = 'http://localhost:5001/meals/hates';
        } else {
            alert("Error del servidor");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}

function verifyAndCreateSelectedMeals() {
    let checkboxes = document.querySelectorAll('.ingredient-checkbox');
    let checkedIngrediens = [];
    checkboxes.forEach(function(checkbox) {
        if (checkbox.checked) {
            checkedIngrediens.push(checkbox.getAttribute('data-ingredient-name'));
        }
    });

    return checkedIngrediens;
}