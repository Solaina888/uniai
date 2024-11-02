function initializeChat() {
    document.getElementById('send-button').onclick = async function () {
        const inputBox = document.getElementById('input-box');
        const model = document.getElementById('model-selector').value;
        const question = inputBox.value;

        if (!question) return;

        // 添加用户消息到页面
        addMessageToChat('User', question, 'user');

        // 显示加载动画
        const loadingMessage = addMessageToChat('Loading...', '', 'loading');

        // 发送请求
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

        // 移除加载动画
        loadingMessage.remove();

        // 添加AI消息到页面
        addMessageToChat(model, result.answer, 'ai');
        inputBox.value = '';
    };

    document.getElementById('clear-button').onclick = function () {
        document.getElementById('input-box').value = '';
    };
}

function addMessageToChat(sender, message, type) {
    const chatContent = document.getElementById('chat-content');
    const messageDiv = document.createElement('div');
    
    // 应用样式
    messageDiv.className = 'my-2 p-3 rounded-lg shadow-md';
    
    if (type === 'user') {
        messageDiv.classList.add('bg-blue-100');
    } else if (type === 'ai') {
        messageDiv.classList.add('bg-green-100');
    } else if (type === 'loading') {
        messageDiv.classList.add('bg-gray-200');
    }

    // 处理Markdown格式
    messageDiv.innerHTML = `<strong>${sender}:</strong><br>${convertMarkdown(message)}`;
    
    chatContent.appendChild(messageDiv);
    chatContent.scrollTop = chatContent.scrollHeight; // 滚动到最新消息
    return messageDiv;
}

function convertMarkdown(message) {
    // 简单处理Markdown格式，需扩展更多格式
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 粗体
        .replace(/\*(.*?)\*/g, '<em>$1</em>')              // 斜体
        .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-white p-1 rounded">$1</code>'); // 代码
}
