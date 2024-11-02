document.getElementById('send-button').onclick = async function () {
    const inputBox = document.getElementById('input-box');
    const model = document.getElementById('model-selector').value;
    const question = inputBox.value.trim();
    if (!question) return;

    const chatContent = document.getElementById('chat-content');
    addMessage('User', question);

    const loadingMessage = addLoadingMessage('AI');
    inputBox.value = '';

    try {
        const response = await fetch('https://uniai.swoslzaiijnma.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questions: question,
                history: [], // 可以存储历史记录
                model: model
            })
        });
        const result = await response.json();
        loadingMessage.remove(); // 移除加载消息
        typeEffect(loadingMessage, result.answer.response);
    } catch (error) {
        loadingMessage.remove();
        addMessage('AI', 'Request failed: ' + error);
    }
};

document.getElementById('clear-button').onclick = function () {
    document.getElementById('input-box').value = '';
};

function addMessage(sender, text) {
    const message = document.createElement('div');
    message.className = 'message p-2 mb-2 rounded-md bg-gray-100';
    message.innerHTML = `<strong>${sender}:</strong> <div class="message-content">${parseMarkdown(text)}</div>`;
    document.getElementById('chat-content').appendChild(message);
}

function addLoadingMessage(sender) {
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message p-2 mb-2 rounded-md bg-gray-100';
    loadingMessage.innerHTML = `<strong>${sender}:</strong> <div class="loader loader2"></div>`;
    document.getElementById('chat-content').appendChild(loadingMessage);
    return loadingMessage;
}

function typeEffect(element, text, speed = 50) {
    const lines = text.split('\n');
    let lineIndex = 0;

    function typeLine() {
        if (lineIndex < lines.length) {
            const line = lines[lineIndex];
            let charIndex = 0;

            function typeChar() {
                if (charIndex < line.length) {
                    element.lastChild.innerHTML += line.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeChar, speed);
                } else {
                    lineIndex++;
                    element.innerHTML += '<br>';
                    setTimeout(typeLine, 100);
                }
            }
            typeChar();
        }
    }
    typeLine();
}

function parseMarkdown(text) {
    // 在此处解析 Markdown，返回 HTML 字符串
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/_(.*?)_/g, '<em>$1</em>')
               .replace(/`(.*?)`/g, '<code>$1</code>');
}
