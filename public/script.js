const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const composer = document.getElementById("composer");
const input = document.getElementById("input");
const send = document.getElementById("send");
const newChat = document.getElementById("newChat");
const clearBtn = document.getElementById("clearBtn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const recentChats = document.getElementById("recentChats");

let messages = [];

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[c]));
}

function addMessage(role, text) {
  if (welcome) welcome.style.display = "none";

  const row = document.createElement("div");
  row.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");

  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;

  return bubble;
}

function showTyping() {
  if (welcome) welcome.style.display = "none";

  const row = document.createElement("div");
  row.className = "message assistant";
  row.id = "typing";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';

  row.appendChild(bubble);
  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function removeTyping() {
  document.getElementById("typing")?.remove();
}

function saveRecent(text) {
  const item = document.createElement("div");
  item.className = "recent";
  item.textContent = text;
  recentChats.prepend(item);

  while (recentChats.children.length > 5) {
    recentChats.lastChild.remove();
  }
}

async function sendMessage(text) {
  text = text.trim();
  if (!text || send.disabled) return;

  addMessage("user", text);
  messages.push({ role: "user", content: text });
  saveRecent(text);

  input.value = "";
  input.style.height = "auto";
  send.disabled = true;
  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    removeTyping();

    if (!response.ok) throw new Error(data.error || "Request failed");

    addMessage("assistant", data.reply);
    messages.push({ role: "assistant", content: data.reply });
  } catch (error) {
    removeTyping();
    addMessage("assistant", } catch (error) {
  removeTyping();
  addMessage("assistant", "ERROR: " + error.message);
  console.error("WINR ERROR:", error);
  } );
    console.error(error);
  } finally {
    send.disabled = false;
    input.focus();
  }
}

composer.addEventListener("submit", e => {
  e.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    composer.requestSubmit();
  }
});

document.querySelectorAll(".suggestions button").forEach(btn => {
  btn.addEventListener("click", () => sendMessage(btn.dataset.prompt));
});

function resetChat() {
  messages = [];
  chat.innerHTML = "";
  chat.appendChild(welcome);
  welcome.style.display = "block";
  input.value = "";
  input.style.height = "auto";
  sidebar.classList.remove("open");
}

newChat.addEventListener("click", resetChat);
clearBtn.addEventListener("click", resetChat);
menuBtn.addEventListener("click", () => sidebar.classList.toggle("open"));


// WINR identity
document.title = "WINR — Your AI Teacher";
