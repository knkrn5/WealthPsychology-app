
//bubbles effects via quizzes.js

 // javascript for  quizzes
    const quizQuestions = [
        { answer: "To protect the interests of investors" },
        { answer: "High dividends and stable earnings" },
        { answer: "The total value of a company's outstanding shares" },
        { answer: "To guarantee the sale of a certain number of shares" },
        { answer: "Price-to-Earnings ratio" },
        { answer: "Option" },
        { answer: "To limit potential losses" },
        { answer: "Spreading investments across various assets" },
        { answer: "NIFTY 50" },
        { answer: "A market where prices are rising" }
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
                            option.parentElement.style.backgroundColor = "lightgreen"; 
                        }
                    });
                }
            }
        });
    });


