function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

function esperando(encender) {

    if (!encender) 
        document.getElementById('espera').innerHTML = ''
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

function registroServidorResumen(dataServidor) {

    return `
    <tr>
        <td><i class="material-icons">computer</i></td>
        <td>${dataServidor.Computadora}</td>
        <td>${dataServidor.OS}</td>
        <td class="left">
            <!--
            <span class="new badge blue left" data-badge-caption="Memoria"></span>
            <span class="new badge blue left" data-badge-caption="Memoria Usada"></span>
            <span class="new badge blue left" data-badge-caption="Procesos"></span>
            <span class="new badge blue left" data-badge-caption="Sesiones"></span>
            -->
            <div title="Memoria del equipo" class="chip red lighten-1 white-text">${readableBytes(dataServidor.Memoria.TotalFisica)}</div>
            <div title="Memoria utilizada" class="chip green lighten-0 white-text">${readableBytes(dataServidor.Memoria.TotalFisica - dataServidor.Memoria.DisponibleFisica)}</div>
            <div title="Carga" class="chip deep-orange lighten-1 white-text">${dataServidor.Memoria.Carga.toFixed(2) + ' %'}</div>
            <div title="Sesiones" class="chip blue lighten-1 white-text">${dataServidor.sesiones}</div>
            <div title="Procesos" class="chip purple lighten-2 white-text">${dataServidor.procesos}</div>
        </td>
    </tr>`
}

function resumen() {
    getJSON('/api/resumen', function (data) {
        //        console.log('data:', data)
        document.getElementById('valServidores').innerText = data.servidores ? data.servidores : -1
        document.getElementById('valSesiones').innerText = data.sesiones ? data.sesiones : -1
        document.getElementById('valProcesos').innerText = data.procesos ? data.procesos : -1
        document.getElementById('valMemoria').innerText = data.totalMemoria ? readableBytes(data.totalMemoria) : -1
        document.getElementById('valMemoriaUsada').innerText = data.usadaMemoria ? readableBytes(data.usadaMemoria) : -1
        document.getElementById('valCarga').innerText = data.carga ? data.carga.toFixed(2) + ' %' : -1 
        
        getJSON('/api/infoservidores', function(data) {

            let registros = ""
            for(let i=0;i<data.length;i++) {
                registros += registroServidorResumen(data[i])
            }
            
            document.getElementById('listaServidoresResumen').innerHTML = registros 
        })
    })
}

function tablaProcesosID(data) {
    let html = `
        <table class="highlight">
            <thead>
                    <tr>
                        <th></th>
                        <th>Aplicacion</th>
                        <th>PID</th>
                    </tr>
            </thead>
            <tbody>`

    for (let j=0;j<data.length;j++) {
        html += `<tr>
                    <td><i class="material-icons">insert_drive_file</i></td>
                    <td>${data[j].process}</td>
                    <td>${data[j].idprocess}</td>
                </tr>`
        }

    html += '</tbody></table>'

    return html
}

function cargarUsuarios() {

    esperando(true)

    getJSON('/api/usuariosxservidor', function(data) {

        let items = "" 
        for (let i=0;i<data.length;i++) {
            items += `
            <li>
                <div class="collapsible-header">
                    <i class="material-icons">face</i>
                    ${data[i].userName}
                    <span class="new badge blue" data-badge-caption="${data[i].serverName}"></span>
                </div>
                <div class="collapsible-body">${tablaProcesosID(data[i].procesos)}</div>
            </li>`
        }
        
        esperando(false)
        document.getElementById('botonExportar').style.visibility = 'visible'
        document.getElementById('listaUsuarios').innerHTML = items
    })
}

function tablaUsuariosWinStationName(data) {

    let html = `
        <table class="highlight">
            <thead>
                <tr>
                    <th></th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>WinStation</th>
                </tr>
            </thead>
            <tbody>`

    for (let j=0;j<data.length;j++) {
        html += `<tr>
                    <td><i class="material-icons">face</i></td>
                    <td>${data[j].username}</td>
                    <td>${data[j].state}</td>
                    <td>${data[j].winstationname}</td>
                </tr>`
        }

    html += '</tbody></table>'

    return html
}

function cargarServidores() {

    esperando(true)

    getJSON('/api/sesionesxservidor', function(data) {

        let items = "" 
        for (let i=0;i<data.length;i++) {
            items += `
            <li>
                <div class="collapsible-header">
                    <i class="material-icons">computer</i>
                    ${data[i].serverName}
                    <span class="new badge blue" data-badge-caption="Sesiones">${data[i].sesiones.length}</span>
                </div>
    
                <div class="collapsible-body">${tablaUsuariosWinStationName(data[i].sesiones)}</div>
            </li>`
        }

        document.getElementById('listaServidores').innerHTML = items
        esperando(false)
    })
}
