// nada
function hola() {
    console.log('Hola!')
}

async function resumen() {
    let data = await getJSON('/api/cargafull')

    console.log(data)
}

function tablaProcesosID(data) {
    let html = `
        <table class="highlight">
            <thead>
                    <tr>
                        <th>Aplicacion</th>
                        <th>PID</th>
                    </tr>
            </thead>
            <tbody>`

    for (let j=0;j<data.length;j++) {
        html += `<tr>
                    <td>${data[j].process}</td>
                    <td>${data[j].idprocess}</td>
                </tr>`
        }

    html += '</tbody></table>'

    return html
}

async function cargarUsuarios() {
    let data = await getJSON('/api/usuariosxservidor')

    let items = "" 
    for (let i=0;i<data.length;i++) {
        items += `
        <li>
            <div class="collapsible-header">
              <i class="material-icons">face</i>
              ${data[i].userName}
            <span class="new badge blue" data-badge-caption="${data[i].serverName}"></span></div>
            <div class="collapsible-body">${tablaProcesosID(data[i].procesos)}</div>
        </li>`
    }
/*
    let items = data.map(function(item) {
        return `
        <li>
            <div class="collapsible-header">
              <i class="material-icons">face</i>
              ${item.userName}
            <span class="new badge blue" data-badge-caption="${item.serverName}"></span></div>
            <div class="collapsible-body"><p></p></div>
        </li>`
    })

    let listaUsuario = document.getElementById('listaUsuarios')

    items.forEach(element => {
        listaUsuarios.appendChild(items)    
    });
*/

    document.getElementById('listaUsuarios').innerHTML = items

}

function tablaUsuariosWinStationName(data) {

    let html = `
        <table class="highlight">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>WinStation</th>
                </tr>
            </thead>
    <tbody>`

    for (let j=0;j<data.length;j++) {
        html += `<tr>
                    <td>${data[j].username}</td>
                    <td>${data[j].winstationname}</td>
                </tr>`
        }

    html += '</tbody></table>'

    return html
}

async function cargarServidores() {
    let data = await getJSON('/api/sesionesxservidor')

    let items = "" 
    for (let i=0;i<data.length;i++) {
        items += `
        <li>
            <div class="collapsible-header">
              <i class="material-icons">computer</i>
                ${data[i].serverName}
            <span class="new badge blue" data-badge-caption="Sesiones">${data[i].sesiones.length}</span></div>
            <div class="collapsible-body">${tablaUsuariosWinStationName(data[i].sesiones)}</div>
        </li>
    `
    }

    document.getElementById('listaServidores').innerHTML = items
}
