document.getElementById('send-button').onclick = async function () {
    const inputBox = document.getElementById('input-box');
    const model = document.getElementById('model-selector').value;
    const question = inputBox.value;
    if (!question) return;

    // 先显示用户消息
    const chatContent = document.getElementById('chat-content');
    const userMessageHTML = `
        <div class="message-card">
            <div>User:</div>
            <div>${marked(question)}</div>
        </div>
    `;
    chatContent.innerHTML += userMessageHTML;

    // 显示加载动画
    const aiMessageHTML = `
        <div class="message-card">
            <div>${model}:</div>
            <div class="loader"></div>
        </div>
    `;
    chatContent.innerHTML += aiMessageHTML;

    // 清空输入框
    inputBox.value = '';

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

    // 移除加载动画并显示AI消息
    const loader = chatContent.lastChild.querySelector('.loader');
    loader.parentElement.innerHTML = `
        <div>${model}:</div>
        <div>${marked(result.answer)}</div>
    `;
};

document.getElementById('clear-button').onclick = function () {
    document.getElementById('input-box').value = '';
};
