
// for bubbles effects---------------------------------
document.addEventListener("DOMContentLoaded", function() {
    const bubbleContainer = document.querySelector('.bubbles');

    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        // Set random size
        const size = Math.random() * (80 - 20) + 20; // Random size between 20px and 80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        // Set random position
        const top = Math.random() * 100; // Random top position percentage
        const left = Math.random() * 100; // Random left position percentage
        bubble.style.top = `${top}%`;
        bubble.style.left = `${left}%`;

        // Set random color
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
        bubble.style.backgroundColor = color;

        // Set random animation duration
        const duration = Math.random() * (30 - 10) + 10; // Random duration between 10s and 30s
        bubble.style.animationDuration = `${duration}s`;

        bubbleContainer.appendChild(bubble);
    }
      
});



    // JavaScript for quizzes score and answer display------------------------
    let score = 0;

    // Attach event listeners to all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', checkAnswers);
    });

    // Function to check the answers
    function checkAnswers() {
        const questions = document.querySelectorAll('.question');
        const scoreContainer = document.getElementById('score-container');
        score = 0; // Reset score

        questions.forEach((question) => {
            const options = question.querySelectorAll('input[type="radio"]');
            const selectedOption = question.querySelector('input[type="radio"]:checked');

            if (selectedOption) {
                options.forEach(option => {
                    const label = option.parentElement;
                    const icon = label.querySelector('.icon');

                    if (option.classList.contains('answer')) {
                        // Correct answer
                        label.style.backgroundColor = 'lightgreen';
                        label.style.color = 'black';
                        if (icon) {
                            icon.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
                            icon.style.color = 'green';
                        }
                        if (option === selectedOption) {
                            score++; // Increment score if the selected option is correct
                        }
                    } else if (option === selectedOption) {
                        // Wrong selected answer
                        label.style.backgroundColor = 'lightcoral';
                        label.style.color = 'black';
                        if (icon) {
                            icon.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
                            icon.style.color = 'red';
                        }
                    } else {
                        // Reset other options
                        label.style.backgroundColor = '';
                        label.style.color = '';
                        if (icon) {
                            icon.innerHTML = '';
                        }
                    }
                });
            }
        });

        // Update score container
        if (scoreContainer) {
            scoreContainer.innerHTML = `You scored ${score} out of ${questions.length}!`;
        }
    }



 
