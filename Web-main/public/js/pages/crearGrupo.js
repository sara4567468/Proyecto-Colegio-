document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("crearGrupoForm")

  form.addEventListener("submit", async event => {
    event.preventDefault()
    const nombre = document.getElementById("nombre").value.trim()
    const profesor = sessionStorage.getItem("user")

    if (!nombre) {
      alert("El nombre del grupo no puede estar vacío.")
      return
    }

    try {
      const response = await fetch("http://localhost:3000/crearGrupo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ nombre, profesor })
      })

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }

      const data = await response.json()
      alert(data.message || "Grupo creado correctamente.")
      form.reset()
    } catch (error) {
      alert("Error al crear grupo: " + error.message)
    }
  })
})
