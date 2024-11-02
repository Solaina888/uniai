document.getElementById('send-button').onclick = async function () {
    const inputBox = document.getElementById('input-box');
    const model = document.getElementById('model-selector').value;
    const question = inputBox.value;
    if (!question) return;

    addMessage('User', question);

    const loadingMessage = addMessage('AI', 'Loading...', true); // true for loading state

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

    // 移除加载消息
    loadingMessage.remove();

    // 显示AI消息
    typeEffect(addMessage('AI', ''), result.answer.response);
    inputBox.value = '';
};

document.getElementById('clear-button').onclick = function () {
    document.getElementById('input-box').value = '';
};

function addMessage(sender, text, loading = false) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message bg-gray-100 rounded-lg p-2 my-2';

    const senderLabel = document.createElement('div');
    senderLabel.className = 'font-bold text-gray-700';
    senderLabel.textContent = sender;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = loading ? 'Loading...' : parseMarkdown(text);

    messageContainer.appendChild(senderLabel);
    messageContainer.appendChild(contentDiv);

    document.getElementById('chat-content').appendChild(messageContainer);
    document.getElementById('chat-content').scrollTop = document.getElementById('chat-content').scrollHeight;

    return contentDiv; // 返回内容 div 以供 typeEffect 函数使用
}

function typeEffect(element, text, speed = 50) {
    let index = 0;

    function typeNext() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeNext, speed);
        }
    }
    
    typeNext();
}

// 解析 Markdown 函数
function parseMarkdown(text) {
    // 这里添加Markdown解析逻辑
    // 可以使用库如marked.js或自己实现简单解析
    // 这是一个示例, 实际实现可能复杂
    const boldRegex = /\*\*(.+?)\*\*/g;
    const italicRegex = /\*(.+?)\*/g;
    const codeRegex = /`(.+?)`/g;

    return text
        .replace(boldRegex, '<strong>$1</strong>')
        .replace(italicRegex, '<em>$1</em>')
        .replace(codeRegex, '<code>$1</code>');
}
