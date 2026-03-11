const API_KEY = "Your Api Key"; 

async function sendMessage() {
    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userText = input.value.trim();

    if (userText === "") return;

    // Display user message
    chatBox.innerHTML += `<div class="message user">${userText}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // UPDATED URL: Using the 2026 stable Gemini 3 Flash model
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userText }] }]
                })
            }
        );

        const data = await response.json();

        // Check for errors from Google (like key issues or model availability)
        if (data.error) {
            console.error("API Error:", data.error.message);
            chatBox.innerHTML += `<div class="message bot">Error: ${data.error.message}</div>`;
            return;
        }

        // Safely extract the reply
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botReply) {
            chatBox.innerHTML += `<div class="message bot">${botReply}</div>`;
        } else {
            // Check if the response was blocked for safety
            const blockReason = data.promptFeedback?.blockReason || "unknown reason";
            chatBox.innerHTML += `<div class="message bot">Message blocked: ${blockReason}</div>`;
        }

    } catch (error) {
        console.error("Connection Error:", error);
        chatBox.innerHTML += `<div class="message bot">Connection failed. Check your console!</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}