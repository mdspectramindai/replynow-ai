async function generateReply() {
  const message = document.getElementById("input").value;

  const res = await fetch("/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  document.getElementById("output").innerText = data.reply;
}