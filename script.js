let userId = localStorage.getItem("userId");

if (!userId) {
  userId = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userId", userId);
}

async function generateReply() {
  const message = document.getElementById("input").value;

  const res = await fetch("https://YOUR-RENDER-URL/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, userId }),
  });

  const data = await res.json();

  if (data.reply === "LIMIT_REACHED") {
    document.getElementById("output").innerText =
      "Free limit reached. Upgrade to continue.";
    return;
  }

  document.getElementById("output").innerText = data.reply;
}