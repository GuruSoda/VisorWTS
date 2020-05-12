"use strict";function readableBytes(a){var b=Math.log,c=Math.floor(b(a)/b(1024));return 1*(a/Math.pow(1024,c)).toFixed(2)+" "+["B","KB","MB","GB","TB","PB","EB","ZB","YB"][c]}function esperando(a){if(!a)document.getElementById("espera").innerHTML="";else{document.getElementById("espera").innerHTML="\n                <div class=\"row center\">\n                    <div class=\"preloader-wrapper big active\">\n                        <div class=\"spinner-layer spinner-blue-only\">\n                        <div class=\"circle-clipper left\">\n                            <div class=\"circle\"></div>\n                        </div><div class=\"gap-patch\">\n                            <div class=\"circle\"></div>\n                        </div><div class=\"circle-clipper right\">\n                            <div class=\"circle\"></div>\n                        </div>\n                        </div>\n                    </div>\n                </div>"}}function registroServidorResumen(a){return"\n    <tr>\n        <td><i class=\"material-icons\">computer</i></td>\n        <td>".concat(a.Computadora,"</td>\n        <td>").concat(a.OS,"</td>\n        <td class=\"left\">\n            <!--\n            <span class=\"new badge blue left\" data-badge-caption=\"Memoria\"></span>\n            <span class=\"new badge blue left\" data-badge-caption=\"Memoria Usada\"></span>\n            <span class=\"new badge blue left\" data-badge-caption=\"Procesos\"></span>\n            <span class=\"new badge blue left\" data-badge-caption=\"Sesiones\"></span>\n            -->\n            <div title=\"Memoria del equipo\" class=\"chip red lighten-1 white-text\">").concat(readableBytes(a.Memoria.TotalFisica),"</div>\n            <div title=\"Memoria utilizada\" class=\"chip green lighten-0 white-text\">").concat(readableBytes(a.Memoria.TotalFisica-a.Memoria.DisponibleFisica),"</div>\n            <div title=\"Carga\" class=\"chip deep-orange lighten-1 white-text\">").concat(a.Memoria.Carga.toFixed(2)+" %","</div>\n            <div title=\"Sesiones\" class=\"chip blue lighten-1 white-text\">").concat(a.sesiones,"</div>\n            <div title=\"Procesos\" class=\"chip purple lighten-2 white-text\">").concat(a.procesos,"</div>\n        </td>\n    </tr>")}function resumen(){getJSON("/api/resumen",function(a){//        console.log('data:', data)
document.getElementById("valServidores").innerText=a.servidores?a.servidores:-1,document.getElementById("valSesiones").innerText=a.sesiones?a.sesiones:-1,document.getElementById("valProcesos").innerText=a.procesos?a.procesos:-1,document.getElementById("valMemoria").innerText=a.totalMemoria?readableBytes(a.totalMemoria):-1,document.getElementById("valMemoriaUsada").innerText=a.usadaMemoria?readableBytes(a.usadaMemoria):-1,document.getElementById("valCarga").innerText=a.carga?a.carga.toFixed(2)+" %":-1,getJSON("/api/infoservidores",function(a){for(var b="",c=0;c<a.length;c++)b+=registroServidorResumen(a[c]);document.getElementById("listaServidoresResumen").innerHTML=b})})}function tablaProcesosID(a){for(var b="\n        <table class=\"highlight\">\n            <thead>\n                    <tr>\n                        <th></th>\n                        <th>Aplicacion</th>\n                        <th>PID</th>\n                    </tr>\n            </thead>\n            <tbody>",c=0;c<a.length;c++)b+="<tr>\n                    <td><i class=\"material-icons\">insert_drive_file</i></td>\n                    <td>".concat(a[c].process,"</td>\n                    <td>").concat(a[c].idprocess,"</td>\n                </tr>");return b+="</tbody></table>",b}function cargarUsuarios(){esperando(!0),getJSON("/api/usuariosxservidor",function(a){for(var b="",c=0;c<a.length;c++)b+="\n            <li>\n                <div class=\"collapsible-header\">\n                    <i class=\"material-icons\">face</i>\n                    ".concat(a[c].userName,"\n                    <span class=\"new badge blue\" data-badge-caption=\"").concat(a[c].serverName,"\"></span>\n                </div>\n                <div class=\"collapsible-body\">").concat(tablaProcesosID(a[c].procesos),"</div>\n            </li>");esperando(!1),document.getElementById("botonExportar").style.visibility="visible",document.getElementById("listaUsuarios").innerHTML=b})}function tablaUsuariosWinStationName(a){for(var b="\n        <table class=\"highlight\">\n            <thead>\n                <tr>\n                    <th></th>\n                    <th>Usuario</th>\n                    <th>Estado</th>\n                    <th>WinStation</th>\n                </tr>\n            </thead>\n            <tbody>",c=0;c<a.length;c++)b+="<tr>\n                    <td><i class=\"material-icons\">face</i></td>\n                    <td>".concat(a[c].username,"</td>\n                    <td>").concat(a[c].state,"</td>\n                    <td>").concat(a[c].winstationname,"</td>\n                </tr>");return b+="</tbody></table>",b}function cargarServidores(){esperando(!0),getJSON("/api/sesionesxservidor",function(a){for(var b="",c=0;c<a.length;c++)b+="\n            <li>\n                <div class=\"collapsible-header\">\n                    <i class=\"material-icons\">computer</i>\n                    ".concat(a[c].serverName,"\n                    <span class=\"new badge blue\" data-badge-caption=\"Sesiones\">").concat(a[c].sesiones.length,"</span>\n                </div>\n    \n                <div class=\"collapsible-body\">").concat(tablaUsuariosWinStationName(a[c].sesiones),"</div>\n            </li>");document.getElementById("listaServidores").innerHTML=b,esperando(!1)})}
"use strict";document.addEventListener("DOMContentLoaded",function(){M.AutoInit();var a=document.querySelectorAll(".sidenav"),b=M.Sidenav.init(a,{draggable:!1,edge:"left"});// otra forma de escuchar cambios en el #
crossroads.addRoute("#/",function(){load("main","partials/resumen.html",function(){resumen()})}),crossroads.addRoute("#/servidores",function(){load("main","partials/servidores.html",function(){cargarServidores();var a=document.querySelectorAll(".collapsible"),b=M.Collapsible.init(a,{acordeon:!1,onOpenStart:null})})}),crossroads.addRoute("#/usuarios",function(){load("main","partials/usuarios.html",function(){cargarUsuarios();var a=document.querySelectorAll(".collapsible"),b=M.Collapsible.init(a,{acordeon:!1,onOpenStart:null})})}),crossroads.addRoute("#/buscar",function(){load("main","partials/buscar.html")}),window.addEventListener("hashchange",function(){crossroads.parse(window.location.hash)}),window.location.hash||location.replace("#/"),crossroads.parse(window.location.hash)});
"use strict";function load(a,b,c){var d=new XMLHttpRequest;// se ejecuta cuando finalizo el GET
d.onload=function(){200<=d.status&&400>d.status&&(document.getElementById(a).innerHTML=d.responseText,c&&c())},d.open("GET",b),d.send()}function getJSON(a,b){var c=new XMLHttpRequest;c.onreadystatechange=function(){if(4===c.readyState&&200===c.status){var a=JSON.parse(c.responseText);b&&b(a)}},c.open("GET",a),c.send()}// async function getJSON(url) {
//     return fetch(url).then(function(data) {
//         return data.json()
//     }).then(function(json) {
//         console.log(url,':',json)
//         return json
//     }).catch(function(error) {
//         console.log('Error:', error)
//         return error.message
//     })
// }

//# sourceMappingURL=index-compiled.js.map