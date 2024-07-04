async function sendMessage() {
    var promptInput = document.getElementById("promptInput").value;
    document.getElementById("promptInput").value="";
    var chatbox = document.getElementById("chatbox");
            var userMessage = document.createElement("div");
            userMessage.className = "user-message";
            userMessage.innerHTML = `You:${promptInput}`;
            chatbox.appendChild(userMessage);


    try {
        const sessionData = localStorage.getItem('sessionData');
        if (!sessionData) {
            throw new Error('Session data not found');
        }
        const session = JSON.parse(sessionData);
        console.log(session);
        const session_id = session.session_id;
        const response = await fetch('https://maxbot-9ays.onrender.com/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: promptInput, session_id: session_id }),
        });

        const result = await response.json();
        console.log(result);
        const message=result[0][0];
        if (response.ok) {
            // Append bot response to chatbox
            var botMessage = document.createElement("div");
            botMessage.className = "bot-message";
            botMessage.innerHTML = `<strong>AI Bot:</strong> ${message}`;
            var chatbox = document.getElementById("chatbox");
            chatbox.appendChild(botMessage);
        } else {
            // Handle errors (e.g., display an error message)
            alert(`Error: ${result.error}`);
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Please try to ask the question properly as I am not trained enough');
    }

    
    chatbox.scrollTop = chatbox.scrollHeight;
}