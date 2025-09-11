document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("tareaForm")

  form.addEventListener("submit", async event => {
    event.preventDefault()
    const tarea_id = sessionStorage.getItem("tarea_id")
    const group_id = sessionStorage.getItem("group_id")
    const titulo = document.getElementById("titulo").value.trim()
    const descripcion = document.getElementById("descripcion").value.trim()
    const fecha_inicio = document.getElementById("fecha_inicio").value
    const fecha_final = document.getElementById("fecha_final").value

    if (!titulo || !descripcion || !fecha_inicio || !fecha_final) {
      alert("Todos los campos son obligatorios.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/editarTarea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({
          tarea_id,
          titulo,
          descripcion,
          fecha_inicio,
          fecha_final,
          group_id
        })
      })

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }

      const data = await response.json()
      alert(data.message || "Tarea editada correctamente.")
      window.history.back()
    } catch (error) {
      console.error("Error al editar tarea:", error)
      alert("Error al editar tarea (Conexión con el servidor).")
    }
  })
})
