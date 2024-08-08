 // for quizzes score and answer display------------------------
 let score = 0;

 // Attach event listeners to all radio buttons
 document.querySelectorAll('input[type="radio"]').forEach(radio => {
     radio.addEventListener('change', checkAnswers);
 });

 //function for check the answer
 function checkAnswers() {
     const questions = document.querySelectorAll('.question');
     questions.forEach((question) => {
         const scoreContainer = document.getElementById('score-container');
         const options = question.querySelectorAll('input[type="radio"]');
         const selectedOption = question.querySelector('input[type="radio"]:checked');
         

         if (selectedOption) {
             options.forEach(option => {
                 const label = option.parentElement;
                 const icon = label.querySelector('.icon');
                 // const icon = option.parentElement.querySelector('.icon');
 
                 if (option.classList.contains('answer')) {
                     // Correct answer
                     score++;
                     label.style.backgroundColor = 'lightgreen';
                     label.style.color = 'black';
                     icon.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
                     icon.style.color = 'green';
                 } else if (option === selectedOption) {
                     // Wrong selected answer
                     score--;
                     label.style.backgroundColor = 'lightcoral';
                     label.style.color = 'black';
                     icon.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
                     icon.style.color = 'red';
                 } else {
                     // Reset other options
                     label.style.backgroundColor = '';
                     label.style.color = '';
                     icon.innerHTML = '';
                     scoreContainer.textContent = `you scored ${score} out of ${questions.length}`
                 }
                 
             });
         }
     });

 }

//  ----------------------------------------------------
let score = 0;
let answeredQuestions = new Set();

// Attach event listeners to all radio buttons
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', checkAnswers);
});

//function for check the answer
function checkAnswers() {
    const questions = document.querySelectorAll('.question');
    const scoreContainer = document.getElementById('score-container');
    
    questions.forEach((question, index) => {
        const options = question.querySelectorAll('input[type="radio"]');
        const selectedOption = question.querySelector('input[type="radio"]:checked');

        if (selectedOption && !answeredQuestions.has(index)) {
            answeredQuestions.add(index);
            
            options.forEach(option => {
                const label = option.parentElement;
                const icon = label.querySelector('.icon');

                if (option.classList.contains('answer')) {
                    // Correct answer
                    label.style.backgroundColor = 'lightgreen';
                    label.style.color = 'black';
                    icon.innerHTML = '<i class="fa-regular fa-circle-check"></i>';
                    icon.style.color = 'green';
                    
                    if (option === selectedOption) {
                        score++;
                    }
                } else if (option === selectedOption) {
                    // Wrong selected answer
                    label.style.backgroundColor = 'lightcoral';
                    label.style.color = 'black';
                    icon.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
                    icon.style.color = 'red';
                } else {
                    // Reset other options
                    label.style.backgroundColor = '';
                    label.style.color = '';
                    icon.innerHTML = '';
                }
            });

            scoreContainer.textContent = `You scored ${score} out of ${questions.length}`;
        }
    });
}
