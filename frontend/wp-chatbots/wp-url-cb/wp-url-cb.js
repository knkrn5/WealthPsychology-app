const scrapeBtn = document.getElementById('scrapeBtn');
const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseArea = document.getElementById('responseArea');
const suggestedQuestionBox = document.querySelector('.suggested-question-box');
const scrapResponseArea = document.getElementById('scrapResponseArea');

document.addEventListener('DOMContentLoaded', async () => {
    scrapResponseArea.innerHTML = '<b>Scraping data...</b>';
    try {
        const response = await fetch('/wp-url-cb/scraped-data');
        const data = await response.json();
        if (data.success) {
            scrapResponseArea.innerHTML = `
                <strong>Scraped Text:</strong>
                <pre style="white-space: pre-wrap;">${data.scrapedText}</pre>
            `;
        } else {
            scrapResponseArea.textContent = 'Failed to fetch scraped data.';
        }
    } catch (error) {
        console.error('Error fetching scraped data:', error);
        scrapResponseArea.textContent = 'Error fetching scraped data.';
    }
});

document.querySelectorAll('.suggested-question').forEach((suggestedQuestion) => {
    suggestedQuestion.addEventListener('click', () => {
        userInput.value = suggestedQuestion.textContent;
        userInput.focus();

        const inputEvent = new Event("input", { bubbles: true });
        userInput.dispatchEvent(inputEvent);
    });
});

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        askBtn.click();
    }
});



// Function to create a conversation message element
function createMessageElement(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `message-${role}`);
    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-role">${role === 'user' ? 'You' : 'AI'}:</span>
            ${text}
        </div>
    `;
    return messageDiv;
}

document.addEventListener('DOMContentLoaded', () => {
    // Enable/Disable the ask button based on user input
    userInput.addEventListener('input', () => {
        askBtn.disabled = userInput.value.trim() === "";
    });

    askBtn.disabled = true;
})


// Function to clear suggested questions after first interaction
function hideSuggestedQuestions() {
    if (suggestedQuestionBox) {
        suggestedQuestionBox.style.display = 'none';
    }
}

askBtn.addEventListener('click', async () => {
    const question = userInput.value.trim();
    if (!question) {
        console.log("No question provided");
        return;
    }

    // Disable user input and ask button during processing
    userInput.disabled = true;
    askBtn.disabled = true;

    // Hide suggested questions on first interaction
    hideSuggestedQuestions();

    // Add user message to response area
    const userMessageElement = createMessageElement('user', question);
    responseArea.appendChild(userMessageElement);

    // Clear input and scroll to bottom
    userInput.value = '';
    responseArea.scrollTop = responseArea.scrollHeight;

    // Show loading indicator
    const loadingElement = createMessageElement('ai', 'Generating response...');
    responseArea.appendChild(loadingElement);

    try {
        const response = await fetch('/wp-url-cb/wp-ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question }),
        });

        // Remove loading indicator
        responseArea.removeChild(loadingElement);

        // Parse the response text as JSON directly
        const data = await response.json();

        if (data.error) {
            // Add error message
            const errorElement = createMessageElement('ai', `Error: ${data.error}`);
            responseArea.appendChild(errorElement);
        } else {
            // Add AI response message
            const responseElement = createMessageElement('ai', data.response);
            responseArea.appendChild(responseElement);
        }

        // Scroll to bottom
        responseArea.scrollTop = responseArea.scrollHeight;

    } catch (error) {
        console.error('Ask error:', error);
        // Remove loading indicator
        if (loadingElement.parentNode === responseArea) {
            responseArea.removeChild(loadingElement);
        }

        // Add error message
        const errorElement = createMessageElement('ai', 'Error processing request');
        responseArea.appendChild(errorElement);
    }finally {
        // Re-enable user input and ask button
        userInput.disabled = false;
        askBtn.disabled = userInput.value.trim() === "";
        userInput.focus();
    }
});

scrapeBtn.addEventListener('click', async () => {
    scrapResponseArea.innerHTML = 'Scraping website...';
    window.location.reload();
});