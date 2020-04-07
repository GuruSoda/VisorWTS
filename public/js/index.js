function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

function esperando(encender) {

    if (!encender) document.getElementById('espera').innerHTML = ''
    else { 
    let preloader = `
            <div class="row center">
            <div class="preloader-wrapper big active">
                <div class="spinner-layer spinner-blue-only">
                <div class="circle-clipper left">
                    <div class="circle"></div>
                </div><div class="gap-patch">
                    <div class="circle"></div>
                </div><div class="circle-clipper right">
                    <div class="circle"></div>
                </div>
                </div>
            </div>
            </div>`

            document.getElementById('espera').innerHTML = preloader
        }
}

async function resumen() {
    let data = await getJSON('/api/resumen')

    console.log(data)

    document.getElementById('valServidores').innerText = data.servidores
    document.getElementById('valSesiones').innerText = data.sesiones
    document.getElementById('valProcesos').innerText = data.procesos
    document.getElementById('valMemoria').innerText = readableBytes(data.totalMemoria)
    document.getElementById('valMemoriaUsada').innerText = readableBytes(data.usadaMemoria)
    document.getElementById('valCarga').innerText = data.carga
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

    esperando(true)

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

    esperando(false)
    document.getElementById('botonExportar').style.visibility = 'visible'
    document.getElementById('listaUsuarios').innerHTML = items
}

function tablaUsuariosWinStationName(data) {

    let html = `
        <table class="highlight">
            <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>WinStation</th>
                </tr>
            </thead>
    <tbody>`

    for (let j=0;j<data.length;j++) {
        html += `<tr>
                    <td>${data[j].username}</td>
                    <td>${data[j].state}</td>
                    <td>${data[j].winstationname}</td>
                </tr>`
        }

    html += '</tbody></table>'

    return html
}

async function cargarServidores() {

    esperando(true)

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

    esperando(false)
    document.getElementById('listaServidores').innerHTML = items
}
