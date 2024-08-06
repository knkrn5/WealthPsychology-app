    
    //bubbles effects via quizzes.js

    // javascript for  quizzes
    const quizQuestions = [
        { answer: "Initial Public Offering" },
        { answer: "SEBI" },
        { answer: "BSE" },
        { answer: "National Stock Exchange Fifty" },
        { answer: "Sensex" },
        { answer: "1988" },
        { answer: "National Stock Exchange" },
        { answer: "Bull Market" },
        { answer: "Dividend paid in additional shares" },
        { answer: "Rakesh Jhunjhunwala" }
    ];
    
    document.querySelectorAll('.options input').forEach((input) => {
        input.addEventListener('change', function() {
            const questionIndex = this.name.replace('question', '');
            const resultDiv = document.getElementById(`result${questionIndex}`);
            const selectedOption = document.querySelector(`input[name="question${questionIndex}"]:checked`);
    
            // Clear previous highlights
            document.querySelectorAll(`input[name="question${questionIndex}"]`).forEach(option => {
                option.parentElement.style.backgroundColor = ""; // Clear previous background color
            });
    
           // highlighting/styling/ the selected option
            if (selectedOption) {
                const isCorrect = selectedOption.value === quizQuestions[questionIndex].answer;
                if (isCorrect) {
                    resultDiv.textContent = "Well Done!🎉";
                    resultDiv.style.color = "green";
                    selectedOption.parentElement.style.backgroundColor = 'lightgreen';
                    selectedOption.parentElement.style.color = 'black';
                } else {
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
            }
        });
    });
    

