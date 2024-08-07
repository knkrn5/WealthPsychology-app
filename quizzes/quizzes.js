
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


    //answers taken from there respective js


    // for quizzes calculation and answer display------------------------
    let score = 0;

    document.querySelectorAll('.options input').forEach((input) => {
        input.addEventListener('change', function() {
            const questionIndex = this.name.replace('question', '');
            const resultDiv = document.getElementById(`result${questionIndex}`);
            const selectedOption = document.querySelector(`input[name="question${questionIndex}"]:checked`);

            // Clear previous highlights
            document.querySelectorAll(`input[name="question${questionIndex}"]`).forEach(option => {
                option.parentElement.style.backgroundColor = ""; // Clear previous background color
            });

        // highlighting/styling the selected option
            if (selectedOption) {
                const isCorrect = selectedOption.value === quizQuestions[questionIndex].answer;
                if (isCorrect) {
                    score++ ;
                    resultDiv.textContent = "Well Done! Correct answer🎉";
                    resultDiv.style.color = "green";
                    selectedOption.parentElement.style.backgroundColor = 'lightgreen';
                    selectedOption.parentElement.style.color = 'black';
                } 
                
                else {
                    resultDiv.textContent = `Opps!😬 The answer is: ${quizQuestions[questionIndex].answer}`;
                    resultDiv.style.color = "red";
                    selectedOption.parentElement.style.backgroundColor = 'lightcoral';
                    selectedOption.parentElement.style.color = 'black';
                    

                    // Highlight the correct answer
                    document.querySelectorAll(`input[name="question${questionIndex}"]`).forEach(option => {
                        if (option.value === quizQuestions[questionIndex].answer) {
                            option.parentElement.style.backgroundColor = 'lightgreen';
                            option.parentElement.style.color = 'black';
                        }
                    });
                }

                // Calculate and display the score
                updateScore();
            }
        });
    });

    
        //function to update the score
        function updateScore() {
            let score = 0;
            quizQuestions.forEach((quiz, index) => {
                const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                if (selectedOption && selectedOption.value === quiz.answer) {
                    score++;
                }
            });
            const scoreDiv = document.getElementById("score");
            scoreDiv.textContent = `You scored ${score} out of ${quizQuestions.length}!`;
        }

