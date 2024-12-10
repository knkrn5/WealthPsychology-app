const scrapeBtn = document.getElementById('scrapeBtn');
const askBtn = document.getElementById('askBtn');
const userInput = document.getElementById('userInput');
const responseArea = document.getElementById('responseArea');
const suggestedQuestionBox = document.querySelector('.suggested-question-box');
const scrapResponseArea = document.getElementById('scrapResponseArea');

// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async () => {
    // Scraping data initialization
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

    // Enable/Disable the ask button based on user input (moved from separate DOMContentLoaded)
    function updateAskButtonState() {
        askBtn.disabled = userInput.value.trim() === "";
    }
    userInput.addEventListener('input', updateAskButtonState);
    updateAskButtonState(); // Initial state
});

// Suggested questions event listener
document.querySelectorAll('.suggested-question').forEach((suggestedQuestion) => {
    suggestedQuestion.addEventListener('click', () => {
        userInput.value = suggestedQuestion.textContent;

        const inputEvent = new Event("input", { bubbles: true });
        userInput.dispatchEvent(inputEvent);
        askBtn.click();
        if (window.innerWidth <= 430) {
            userInput.blur();
        }
    });
});

// Consolidated keyboard event handling
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

    // Use marked to parse Markdown to HTML
    const parsedText = marked.parse(text);

    messageDiv.innerHTML = `
        <div class="message-content">
            <span class="message-role">${role === 'user' ? 'You' : 'AI'}:</span>
            ${parsedText}
        </div>
    `;
    return messageDiv;
}

let userScrolling = false;
// Function to check user scroll
responseArea.addEventListener('scroll', () => {
    if (responseArea.scrollTop < responseArea.scrollHeight - responseArea.clientHeight - 50) {
        userScrolling = true;
    } else {
        userScrolling = false;
    }
});
// Auto-scroll function
function autoScroll() {
    if (!userScrolling) {
        responseArea.scrollTop = responseArea.scrollHeight;
    }
}

// Replace the existing askBtn event listener
askBtn.addEventListener('click', async () => {
    const question = userInput.value.trim();
    if (!question) {
        console.log("No question provided");
        return;
    }

    // Blur the input field to hide the keyboard
    if (window.innerWidth <= 430) {
        userInput.blur();
    }

    // Disable and clear user input and ask button disable
    userInput.value = '';
    userInput.disabled = true;
    askBtn.disabled = true;

    // remove suggested questions 
    suggestedQuestionBox.remove();

    // Add user message to response area
    const questionElement = createMessageElement('user', question);
    responseArea.appendChild(questionElement);
    responseArea.scrollTop = responseArea.scrollHeight;


    // Create AI response element for streaming
    const responseElement = createMessageElement('ai', 'Generating...');
    responseArea.appendChild(responseElement);
    responseArea.scrollTop = responseArea.scrollHeight;
    const contentDiv = responseElement.querySelector('.message-content');

    try {
        const response = await fetch('/wp-url-cb/wp-ask', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({ question }),
        });

        if (!response.body) {
            contentDiv.innerHTML = 'Error: No response stream.';
            return;
        }

        // Stream response using ReadableStream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });

            // Try to parse JSON chunks
            const lines = chunk.split('\n');
            lines.forEach(line => {
                if (line.startsWith('data: ')) {
                    // Skip the [DONE] marker instead of trying to parse it
                    if (line.includes('[DONE]')) return;

                    try {
                        const jsonData = JSON.parse(line.slice(6));
                        if (jsonData.content) {
                            fullResponse += jsonData.content;
                            // Parse and update the content dynamically
                            contentDiv.innerHTML = marked.parse(fullResponse);

                            // calling Scroll function
                            autoScroll();
                        }
                    } catch (parseError) {
                        console.error('JSON parse error:', parseError);
                    }
                }
            });
        }

        // Remove [DONE] from the final response if it exists
        fullResponse = fullResponse.replace('[DONE]', '').trim();
        contentDiv.innerHTML = marked.parse(fullResponse);

    } catch (error) {
        console.error('Ask error:', error);
        const errorElement = createMessageElement('ai', 'Error processing request');
        responseArea.appendChild(errorElement);
    } finally {
        // Re-enable user input and ask button
        userInput.disabled = false;
        askBtn.disabled = userInput.value.trim() === "";
        userInput.focus();
        if (window.innerWidth <= 430) {
            userInput.blur();
        }
    }
});

// Scrape button event listener
scrapeBtn.addEventListener('click', async () => {
    scrapResponseArea.innerHTML = 'Scraping website...';
    window.location.reload();
});