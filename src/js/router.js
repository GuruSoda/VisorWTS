document.addEventListener('DOMContentLoaded', function() {
    M.AutoInit()

    let elems = document.querySelectorAll('.sidenav')
    let instancesaaa = M.Sidenav.init(elems, { draggable: false, edge: 'left' })

    crossroads.addRoute('#/', function () {
        load('main', 'partials/resumen.html', function () {

            resumen()
        })
    })

    crossroads.addRoute('#/servidores', function () {
        load('main', 'partials/servidores.html', function() {

            cargarServidores()

            let elems = document.querySelectorAll('.collapsible')

            let instances = M.Collapsible.init(elems, {acordeon: false, onOpenStart: null })

        })
    })

    crossroads.addRoute('#/usuarios', function () {
        load('main', 'partials/usuarios.html', function() {

            cargarUsuarios()

            let elem = document.querySelectorAll('.collapsible')
            let instances = M.Collapsible.init(elem, {acordeon: false, onOpenStart: null })
        })
    })

    crossroads.addRoute('#/buscar', function () {
        load('main', 'partials/buscar.html')
    })

    // otra forma de escuchar cambios en el #
    window.addEventListener('hashchange', function() { crossroads.parse(window.location.hash) })

    if (!window.location.hash) location.replace('#/')

    crossroads.parse(window.location.hash)
})
