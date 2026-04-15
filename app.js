const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = "message " + role;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  const apiKey = "Tu API key";

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: "Respondé como experto en Prompt Engineering para diseño gráfico. Tu único objetivo es recibir una idea simple del usuario y devolver un prompt técnico para Midjourney en inglés que incluya: estilo, iluminación, tipo de lente y resolución. Respondé SOLO con el prompt final en inglés. Idea del usuario: " + message }
              ]
            }
          ]
        })
      }
    );

    const data = await res.json();

    const reply = 
      data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "Sin respuesta de la IA. Revisá la consola.";

    addMessage(reply, "model");

  } catch (error) {
    addMessage("Error: " + error.message, "model");
  }
});