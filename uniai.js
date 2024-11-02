// chat-platform.js - 需要托管到外部平台
document.addEventListener('DOMContentLoaded', function() {
    // 配置marked.js
    marked.setOptions({
        highlight: function(code, language) {
            if (language && hljs.getLanguage(language)) {
                return hljs.highlight(code, { language }).value;
            }
            return code;
        },
        breaks: true
    });

    let chatHistory = [];
    const chatContent = document.getElementById('chat-content');
    const inputBox = document.getElementById('input-box');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');
    const modelSelector = document.getElementById('model-selector');

    // 创建消息卡片
    function createMessageCard(content, sender) {
        const card = document.createElement('div');
        card.className = 'message-card';
        
        const label = document.createElement('div');
        label.className = 'message-label';
        label.textContent = sender;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'markdown-content';
        
        card.appendChild(label);
        card.appendChild(contentDiv);
        
        if (typeof content === 'string') {
            contentDiv.innerHTML = marked.parse(content);
        } else {
            contentDiv.appendChild(content);
        }
        
        return card;
    }

    // 创建加载动画
    function createLoadingDots() {
        const dots = document.createElement('div');
        dots.className = 'loading-dots';
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            dots.appendChild(span);
        }
        return dots;
    }

    // 打字效果
    async function typeWriter(element, text) {
        const parsedHTML = marked.parse(text);
        element.innerHTML = parsedHTML;
        
        // 代码高亮
        element.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }

    // 发送消息处理
    async function handleSend() {
        const question = inputBox.value.trim();
        if (!question) return;

        // 添加用户消息
        const userCard = createMessageCard(question, 'User');
        chatContent.appendChild(userCard);
        chatContent.scrollTop = chatContent.scrollHeight;

        // 创建AI消息卡片和加载动画
        const aiCard = createMessageCard(createLoadingDots(), modelSelector.value);
        chatContent.appendChild(aiCard);
        chatContent.scrollTop = chatContent.scrollHeight;

        // 清空输入框
        inputBox.value = '';

        try {
            const response = await fetch('https://your-worker-url.workers.dev/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    questions: question,
                    history: chatHistory,
                    model: modelSelector.value
                })
            });

            const result = await response.json();
            
            // 更新历史记录
            chatHistory.push(
                { sender: 'user', content: question },
                { sender: 'assistant', content: result.answer.response }
            );

            // 替换加载动画为AI响应
            const aiContent = aiCard.querySelector('.markdown-content');
            aiContent.innerHTML = '';
            await typeWriter(aiContent, result.answer.response);

        } catch (error) {
            const aiContent = aiCard.querySelector('.markdown-content');
            aiContent.innerHTML = 'Error: Failed to get response from AI';
        }
    }

    // 事件监听器
    sendButton.onclick = handleSend;
    clearButton.onclick = () => {
        inputBox.value = '';
    };
    
    inputBox.onkeypress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
});