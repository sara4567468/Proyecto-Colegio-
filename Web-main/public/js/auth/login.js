function login(event) {
  event.preventDefault();

  const user = document.getElementById("user").value.trim();
  const passwd = document.getElementById("passwd").value.trim();
  const feedback = document.getElementById("feedbackText");
  const submitButton = document.querySelector('button[type="submit"]');

  if (!user || !passwd) {
    feedback.innerText = "Por favor completa todos los campos.";
    return;
  }

  submitButton.disabled = true;
  feedback.innerText = "";

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, passwd }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      return response.json();
    })
    .then((data) => {
      if (data.redirect) {
        sessionStorage.setItem("user", user);
        sessionStorage.setItem("token", data.token);
        window.location.href = data.redirect;
      } else if (data.error) {
        feedback.innerText = data.error;
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      feedback.innerText = "Error al procesar la solicitud.";
    })
    .finally(() => {
      submitButton.disabled = false;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (form) form.addEventListener("submit", login);
});
