// chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatContent = document.getElementById('chat-content');
    const inputBox = document.getElementById('input-box');
    const clearButton = document.getElementById('clear-button');
    const sendButton = document.getElementById('send-button');
    const modelSelector = document.getElementById('model-selector');
  
    // Markdown parser
    const md = window.markdownit();
    md.use(window.markdownitHighlightjs);
  
    // Function to render markdown
    function renderMarkdown(text) {
      return md.render(text);
    }
  
    // Function to create a message card
    function createMessageCard(sender, message) {
      const card = document.createElement('div');
      card.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'mb-4', 'shadow-md');
  
      const senderTag = document.createElement('span');
      senderTag.classList.add('text-gray-600', 'font-bold');
      senderTag.textContent = sender;
  
      const messageContent = document.createElement('div');
      messageContent.innerHTML = renderMarkdown(message);
  
      card.appendChild(senderTag);
      card.appendChild(messageContent);
  
      return card;
    }
  
    // Function to add loading animation
    function addLoadingAnimation() {
      const loadingCard = document.createElement('div');
      loadingCard.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'mb-4', 'shadow-md');
      loadingCard.innerHTML = `
        <div class="flex items-center justify-center h-12">
          <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-600" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      `;
  
      chatContent.appendChild(loadingCard);
      return loadingCard;
    }
  
    // Function to handle send button click
    sendButton.onclick = async function () {
      const question = inputBox.value;
      if (!question) return;
  
      // Add user message card
      const userCard = createMessageCard('User', question);
      chatContent.appendChild(userCard);
  
      // Add loading animation
      const loadingCard = addLoadingAnimation();
  
      // Clear input box
      inputBox.value = '';
  
      // Fetch AI response
      const model = modelSelector.value;
      const response = await fetch('https://uniai.swoslzaiijnma.workers.dev/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questions: question,
          history: [], // Can store history records
          model: model
        })
      });
  
      const result = await response.json();
      const aiMessage = result.answer.response;
  
      // Remove loading animation and add AI message card
      chatContent.removeChild(loadingCard);
      const aiCard = createMessageCard('AI', aiMessage);
      chatContent.appendChild(aiCard);
    };
  
    // Function to handle clear button click
    clearButton.onclick = function () {
      inputBox.value = '';
    };
  });