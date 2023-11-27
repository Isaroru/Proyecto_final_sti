const restartButton = document.getElementById('restart_btn')
restartButton.addEventListener('click', () => window.location.href = 'http://localhost:5001/meals/getRandomByCategories')