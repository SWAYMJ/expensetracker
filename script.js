// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

function sendMessage() {
    const input = document.getElementById('message');
    const msg = input.value.trim();
    if (!msg) return;
    
    appendMessage('user', msg);
    input.value = '';

    let reply = logExpense(msg);
    appendMessage('bot', reply);

    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function logExpense(text) {
    text = text.toLowerCase();

    // 1️⃣ Show category-wise summary
    if (text.includes('summary') || text.includes('breakdown')) {
        if (expenses.length === 0) return "No expenses logged yet.";
        let summary = {};
        expenses.forEach(exp => {
            summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
        });
        return Object.entries(summary)
                     .map(([cat, amt]) => `${cat}: ₹${amt}`)
                     .join('\n');
    }

    // 2️⃣ Show total spending
    if (text.includes('total') || text.includes('how much') || text.includes('spent') && !text.match(/\d+/)) {
        if (expenses.length === 0) return "No expenses logged yet.";
        let total = expenses.reduce((sum, e) => sum + e.amount, 0);
        return `You've spent a total of ₹${total}.`;
    }

    // 3️⃣ Log a new expense
    let match = text.match(/(\d+\.?\d*)\s*(?:on)?\s*(\w+)/);
    if (match) {
        let amount = parseFloat(match[1]);
        let category = match[2];
        expenses.push({ category, amount, date: new Date().toISOString().split('T')[0] });
        return `Logged ₹${amount} in ${category}.`;
    }

    return "Could not understand. Try: 'Spent 300 on groceries'.";
}


function appendMessage(sender, msg) {
    const chat = document.getElementById('chat');
    const div = document.createElement('div');
    div.className = sender;
    div.textContent = `${sender === 'user' ? 'You' : 'Bot'}: ${msg}`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

