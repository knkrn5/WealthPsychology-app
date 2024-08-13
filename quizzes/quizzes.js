document.addEventListener("DOMContentLoaded", function() {
    const bubbleContainer = document.querySelector('.bubbles');
    const quizContainer = document.getElementById('quiz-container');
    const heading = document.getElementsByTagName('h1')[0]; // Get the first <h1> element
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Bubble effect code (unchanged)
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * (80 - 20) + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        bubble.style.top = `${top}%`;
        bubble.style.left = `${left}%`;
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5)`;
        bubble.style.backgroundColor = color;
        const duration = Math.random() * (30 - 10) + 10;
        bubble.style.animationDuration = `${duration}s`;
        bubbleContainer.appendChild(bubble);
    }


    // Function to initialize quiz-related JavaScript and for quizzes score and answer display
    function initQuizJS() {
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
    }

    function setActiveNavLink() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentQuiz = urlParams.get('quiz');
        
        navLinks.forEach(link => {
            const linkQuiz = link.textContent.trim().replace(' ', '-').toLowerCase();
            if (linkQuiz === currentQuiz) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function loadQuiz(url, title, quizHeading) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                quizContainer.innerHTML = data;
                history.pushState({ quizUrl: url, title: title, heading: quizHeading }, title, `?quiz=${encodeURIComponent(title)}`);
                document.title = `Quiz - ${quizHeading || title || 'Stock Market'}`;
                heading.textContent = `${quizHeading || title || 'Stock Market'}`;
                setActiveNavLink();
                initQuizJS();
            })
            .catch(error => {
                console.error('Error loading quiz:', error);
                quizContainer.innerHTML = '<p>Failed to load the quiz. Please try again later.</p>';
            });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            const quizUrl = this.getAttribute('data-quiz');
            const quizHeading = this.textContent.trim();
            const quizTitle = quizHeading.replace(' ', '-').toLowerCase();
            loadQuiz(quizUrl, quizTitle, quizHeading);
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.quizUrl) {
            loadQuiz(event.state.quizUrl, event.state.title, event.state.heading);
        }
        setActiveNavLink();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const initialQuiz = urlParams.get('quiz');
    const defaultLink = initialQuiz ? 
        Array.from(navLinks).find(link => link.textContent.trim().replace(' ', '-').toLowerCase() === initialQuiz) : 
        document.querySelector('.nav-menu a.active');

    if (defaultLink) {
        const quizUrl = defaultLink.getAttribute('data-quiz');
        const quizHeading = defaultLink.textContent.trim();
        const quizTitle = quizHeading.replace(' ', '-').toLowerCase();
        loadQuiz(quizUrl, quizTitle, quizHeading);
    }

    setActiveNavLink();
});