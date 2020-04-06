const fetch = require('node-fetch')
const fs = require('fs')

const configuracion = 'configs/infoTSCConfig.json'

class infoTSCModelo {
    constructor() {
        this.infots = []
        this.ultimaCarga = new Date(0)
        this.config = {}

        this.configurar()

        this.actualizar()

        this.periodoRecoleccion(this.config.tiempoRecoleccion)

//        console.log(this.config)

    }

    configurar() {
        // valores por default de la configuracion
        this.config = {servidores: [], periodoRecoleccion: 60}

        if (fs.existsSync(configuracion)) {
            this.config = require('../' + configuracion)
//            console.log(this.config)
        }
    }

    servidores() {
        return this.config.servidores
    }

    periodoRecoleccion(frecuencia) {
        setInterval(this.actualizar.bind(this), frecuencia * 1000);
    }

    actualizar () {

        let that = this

        this.recolectar().then(function(data) { 
            that.infots = data
        })
    }

    async recolectar() {
//        console.log('Actualizando Servidores:' + this.servidores())

        let ts = this.servidores()
        let dataServidores = []

        let that = this

        for (let i=0;i<ts.length;i++) {
            let obj= {}

            dataServidores[i] = {}
            dataServidores[i].serverConfig = ts[i]
            await fetch('http://' + ts[i] + ':7319/wts/informacion')
                .then(function(res) {
                  return res.json()
                })
                .then(function(json) {
                    dataServidores[i] = json
                }).catch(function(data){
                    dataServidores[i].errorInformacion = data.message
                })

            // si el atributo Computadora esta sin datos es por que fallo el anterior fetch
            if (!dataServidores[i].Computadora) continue

            dataServidores[i].ts = ts[i]

            dataServidores[i].sesiones = []
            
//          await fetch('http://httpstat.us/404')
            await fetch('http://' + ts[i] + ':7319/wts/sesiones')
                .then(function(res) {
                    if (res.ok) return res.json()
                    else return []
                })
                .then(function(json) {
                    dataServidores[i].sesiones = json
                }).catch(function(data) {
                    dataServidores[i].errorSesiones = data.message
                })

            dataServidores[i].procesos = []
            await fetch('http://' + ts[i] + ':7319/wts/procesos')
                .then(function(res) {
                    return res.json()
                })
                .then(function(json) {
                    dataServidores[i].procesos = json
                }).catch(function(data) {
                        dataServidores[i].errorProcesos = data.message
                })

                let fecha = new Date()
                dataServidores[i].actualizado = fecha.toString()
        }

        return dataServidores
    }

    async info() {

        const that = this

        return new Promise(function (resolve, reject) {
            let ahora = new Date()
          
//            console.log('ultimaCarga:' + that.ultimaCarga)
//            console.log('ahora      :' + ahora)

            if ((that.ultimaCarga.getTime() + 30000) < ahora.getTime()) {
                that.ultimaCarga = ahora
//                that.cargaCompleta()

                that.recolectar().then(function(data) { resolve(that.infots) })
            } else {
                resolve(that.infots)
            }
        })

//        return this.infots;
    }

    sesionesxservidor() {

        let that = this

        return new Promise(function (resolve, reject) {

            let resultado = []
        
            // Pimero recorro los servidores
            for (let i = 0; i< that.infots.length;i++) {
        
                if (!that.infots[i].Computadora) continue 
                
                let obj = {}
        
                obj.sesiones=that.infots[i].sesiones
                obj.serverName=that.infots[i].Computadora
                
                resultado.push(obj)
            }

            resolve(resultado)
        })
    }

    usuariosxservidor() {
        let that = this
        
        return new Promise(function (resolve, reject) {
            let resultado = []

            // Pimero recorro los servidores
            for (let i = 0; i< that.infots.length;i++) {
        
              if (!that.infots[i].sesiones) continue
              
              for (let j = 0; j < that.infots[i].sesiones.length;j++) {
                let obj = {}
        
                obj.userName=that.infots[i].sesiones[j].username
                obj.serverName=that.infots[i].Computadora
                obj.procesos = []
        
                if (!that.infots[i].procesos) continue
        
                for (let x=0;x<that.infots[i].procesos.length;x++) {
                  if (obj.userName.toUpperCase() === that.infots[i].procesos[x].username.toUpperCase()) {
                    obj.procesos.push({ process : that.infots[i].procesos[x].process, idprocess : that.infots[i].procesos[x].idprocess})
                  }
                }
        
                resultado.push(obj)
              }
            }

            resolve(resultado)
        
        })
    }

    exportarusuarios() {
        let that = this

        return new Promise(function (resolve, reject) {

            tmp.file({prefix: 'infoWTS-'}, function _tempFileCreated(err, csvtemp, fd, cleanupCallback) {

                if (err) reject(err)

                try {
                    fs.appendFileSync(csvtemp, 'Servidor;Usuario;Proceso\n');
                } catch (err) {
                    res.json({error: 'Error creando archivo temporario:' + err})
                }
          
                for (i=0;i<data.length;i++) {
                    let servidor = data[i].Computadora
            
                    if (!data[i].sesiones) continue
                    for (j=0;j<data[i].sesiones.length;j++) {
                        let usuario = data[i].sesiones[j].username
                
                        if (!data[i].procesos) continue
                        for (x=0;x<data[i].procesos.length;x++) {
                            if (data[i].procesos[x].username.toUpperCase() === usuario.toUpperCase()) {
                                let proceso = data[i].procesos[x].process
                
                                try {
                                    let registro = servidor + ';' + usuario + ';' + proceso + '\n'
                                    fs.appendFileSync(csvtemp, registro);
                                } catch (err) {
                                    res.json({error: 'Error creando archivo temporario:' + err})
                                }
                            }
                        }
                    }
                }
                resolve(csvtemp)
            })
        })
    }

    dataBase() {
        return this.infots
    }

    vacio() {
        let that = this

        return new Promise(function (resolve, reject) {
            resolve({})
        })
    }
}

module.exports = infoTSCModelo
