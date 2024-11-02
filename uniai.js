function addMessage(sender, text) {
    const chatContent = document.getElementById('chat-content');
    const message = document.createElement('div');
    message.className = 'bg-gray-100 p-4 rounded-md shadow-md my-2';
    const header = document.createElement('div');
    header.className = 'font-semibold text-gray-700';
    header.textContent = sender;
    message.appendChild(header);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.style.whiteSpace = 'pre-wrap'; // 保持换行
    typeEffect(contentDiv, text);
    
    message.appendChild(contentDiv);
    chatContent.appendChild(message);
    chatContent.scrollTop = chatContent.scrollHeight; // 滚动到最新消息
}

function typeEffect(element, text, speed = 10) {
    const lines = text.split('\n');
    let lineIndex = 0;
    function typeLine() {
        if (lineIndex < lines.length) {
            parseAndTypeLine(lines[lineIndex]);
            lineIndex++;
            setTimeout(typeLine, 100);
        }
    }
    typeLine();
}

function parseAndTypeLine(line) {
    const parts = parseMarkdown(line);
    parts.forEach(part => {
        const span = document.createElement(part.type === 'link' ? 'a' : 'span');
        span.textContent = part.content;
        if (part.type === 'bold') {
            span.style.fontWeight = 'bold';
        } else if (part.type === 'italic') {
            span.style.fontStyle = 'italic';
        } else if (part.type === 'inline-code') {
            span.style.fontFamily = 'monospace';
            span.style.backgroundColor = '#f0f0f0';
            span.style.padding = '2px 4px';
            span.style.borderRadius = '3px';
        } else if (part.type === 'link') {
            span.href = part.href;
            span.style.color = '#1a0dab';
            span.style.textDecoration = 'underline';
        }
        element.appendChild(span);
    });
}

function parseMarkdown(line) {
    const parts = [];
    let currentIndex = 0;
    const regex = /(\*\*|__|`|[*_]|[0-9]+\.\s|\[.*?\]\(.*?\))/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
        if (match.index > currentIndex) {
            parts.push({ type: 'text', content: line.slice(currentIndex, match.index) });
        }
        const token = match[0];
        if (token === '**' || token === '__') {
            const endIndex = line.indexOf(token, match.index + 2);
            if (endIndex !== -1) {
                parts.push({ type: 'bold', content: line.slice(match.index + 2, endIndex) });
                currentIndex = endIndex + 2;
                regex.lastIndex = currentIndex;
            }
        } else if (token === '*' || token === '_') {
            const endIndex = line.indexOf(token, match.index + 1);
            if (endIndex !== -1) {
                parts.push({ type: 'italic', content: line.slice(match.index + 1, endIndex) });
                currentIndex = endIndex + 1;
                regex.lastIndex = currentIndex;
            }
        } else if (token === '`') {
            const endIndex = line.indexOf('`', match.index + 1);
            if (endIndex !== -1) {
                parts.push({ type: 'inline-code', content: line.slice(match.index + 1, endIndex) });
                currentIndex = endIndex + 1;
                regex.lastIndex = currentIndex;
            }
        } else if (/\[.*?\]\(.*?\)/.test(token)) {
            const text = token.match(/\[(.*?)\]/)[1];
            const href = token.match(/\((.*?)\)/)[1];
            parts.push({ type: 'link', content: text, href: href });
            currentIndex = match.index + token.length;
        } else if (/^[0-9]+\.\s/.test(token)) {
            parts.push({ type: 'text', content: token });
            currentIndex = match.index + token.length;
        }
    }
    if (currentIndex < line.length) {
        parts.push({ type: 'text', content: line.slice(currentIndex) });
    }
    return parts;
}
