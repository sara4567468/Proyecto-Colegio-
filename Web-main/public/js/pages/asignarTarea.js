document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tareaForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_final = document.getElementById("fecha_final").value;
    const group_id = sessionStorage.getItem("group_id");
    const token = sessionStorage.getItem("token");

    if (!titulo || !descripcion || !fecha_inicio || !fecha_final) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/asignarTarea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          fecha_inicio,
          fecha_final,
          group_id,
        }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();

      if (data.success) {
        alert("Tarea asignada correctamente.");
      } else {
        alert("Error al asignar la tarea.");
      }
      window.history.back();
    } catch (error) {
      alert("Error al asignar tarea.");
      console.error(error);
    }
  });
});
