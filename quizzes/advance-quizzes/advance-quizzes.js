    
    //bubbles effects via quizzes.js

    // javascript for  quizzes
    const quizQuestions = [
        { answer: "Buying a stock at NSE and selling it at BSE for a profit" },
        { answer: "A fund that invests against prevailing market trends" },
        { answer: "It measures the volatility of a stock compared to the market" },
        { answer: "Options" },
        { answer: "Studying historical price movements and trading volumes" },
        { answer: "A stock that trades at a very low price, typically under Rs. 10" },
        { answer: "The measure of a portfolio's return compared to the market" },
        { answer: "Hedging with options" },
        { answer: "Return on Equity (ROE)" },
        { answer: "The tendency of a stock's price to revert to its historical average" }
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
    

