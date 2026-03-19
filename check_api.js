async function check() {
  const key = "AIzaSyDnTyU1UHoqcBPB9e4CaFJ0oM2xnVKkvzU";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://xakhundx.github.io/Ai-Pomodoro-App/"
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: "Hello" }] }]
    })
  });
  const data = await response.json();
  console.log("STATUS:", response.status);
  console.log("BODY:", JSON.stringify(data, null, 2));
}
check();
