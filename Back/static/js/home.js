const startButton = document.getElementById('start_btn')
startButton.addEventListener('click', () => window.location.href = 'http://localhost:5001/meals/getRandomByCategories')