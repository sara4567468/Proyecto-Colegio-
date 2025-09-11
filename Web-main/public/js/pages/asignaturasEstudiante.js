class Notificador {
  constructor() {
    this.observadores = []
  }
  suscribir(observador) {
    this.observadores.push(observador)
  }
  notificar(mensaje) {
    this.observadores.forEach(observador => observador(mensaje))
  }
}

const notificador = new Notificador()
notificador.suscribir(mensaje => {
  alert(mensaje)
})

async function fetchEntregasProximas(user, group_id) {
  try {
    const response = await fetch('http://localhost:3000/entregasProximas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      },
      body: JSON.stringify({ user_id: user, group_id })
    })
    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`)
    }
    const responseData = await response.json()
    if (responseData.data && responseData.data[1].entregas.length === 0) {
      let hoy = new Date()
      let fechaFinal = new Date(responseData.data[1].result.fecha_final)
      let diferenciaDias = Math.ceil((fechaFinal - hoy) / (1000 * 60 * 60 * 24))
      if (diferenciaDias <= 3) {
        return responseData.success
      }
    }
    return false
  } catch (error) {
    console.error('Error al obtener entregas próximas:', error)
    return false
  }
}

async function fetchAsignaturas() {
  try {
    const user = sessionStorage.getItem('user')
    const passwd = sessionStorage.getItem('passwd')
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, passwd })
    })
    const data = await response.json()
    if (data.asignaturas && data.asignaturas.length > 0) {
      let table = document.getElementById('asignaturasTable').getElementsByTagName('tbody')[0]
      for (const asignatura of data.asignaturas) {
        let row = table.insertRow()
        let cell1 = row.insertCell(0)
        let cell2 = row.insertCell(1)
        cell1.textContent = asignatura.group_id
        cell2.textContent = asignatura.nombre
        cell2.style.cursor = 'pointer'
        cell2.onclick = function () {
          sessionStorage.setItem('group_id', asignatura.group_id)
          window.location.href = 'visualizarAsignatura.html'
        }
        const determinante = await fetchEntregasProximas(user, asignatura.group_id)
        if (determinante) {
          notificador.notificar(`${asignatura.nombre} contiene tareas pendientes!!`)
        }
      }
    } else {
      console.log('No hay asignaturas inscritas.')
    }
  } catch (error) {
    console.error('Error al cargar las asignaturas:', error)
  }
}

window.onload = function () {
  fetchAsignaturas()
}
