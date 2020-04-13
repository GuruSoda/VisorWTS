const fetch = require('node-fetch')
const fs = require('fs')
const tmp = require('tmp')

const configuracion = 'configs/infoTSCConfig.json'

class infoTSCModelo {
    constructor() {
        this.infots = []
        this.ultimaCarga = new Date(0)
        this.config = {}

        if (process.env.FALSABASE) {
            if (fs.existsSync(process.env.FALSABASE)) {
                this.infots = require('../' + process.env.FALSABASE)
                console.log('Falsa base cargada desde: ', process.env.FALSABASE)
            } else 
                console.log('No existe falsa base.')    
        } else {

            // cargo la configuracion desde el archivo
            this.configurar()

            // actualizo la informacion desde los servidores
            this.actualizar()
    
            // Configuro un periodo en seg. de actualizacion
            this.periodoRecoleccion(this.config.tiempoRecoleccion)

            // info la configuracion
            console.log('Configuracion:', this.config)
        }
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

            tmp.file({prefix: 'infoWTS-', keep: true}, function _tempFileCreated(err, csvtemp) {

                if (err) reject(err)

                try {
                    fs.appendFileSync(csvtemp, 'Servidor;Usuario;Proceso\n');
                } catch (err) {
                    reject({error: 'Error creando archivo temporario:' + err})
                }

                for (let i=0;i<that.infots.length;i++) {
                    let servidor = that.infots[i].Computadora
            
                    if (!that.infots[i].sesiones) continue
                    for (let j=0;j<that.infots[i].sesiones.length;j++) {
                        let usuario = that.infots[i].sesiones[j].username
                
                        if (!that.infots[i].procesos) continue
                        for (let x=0;x<that.infots[i].procesos.length;x++) {
                            if (that.infots[i].procesos[x].username.toUpperCase() === usuario.toUpperCase()) {
                                let proceso = that.infots[i].procesos[x].process
                
                                try {
                                    let registro = servidor + ';' + usuario + ';' + proceso + '\n'
                                    fs.appendFileSync(csvtemp, registro);
                                } catch (err) {
                                    reject({error: 'Error creando archivo temporario:' + err})
                                }
                            }
                        }
                    }
                }
                resolve(csvtemp)
            })
        })
    }

    resumen() {
        let that = this

        return new Promise(function (resolve, reject) {
            let resultado = {
                servidores: 0,
                sesiones: 0,
                procesos: 0,
                totalMemoria: 0,
                usadaMemoria: 0,
                carga: 0
            }

            if (that.infots) resultado.servidores = that.infots.length
            else resolve(resultado)

            // Pimero recorro los servidores
            for (let i = 0; i< that.infots.length;i++) {

                resultado.totalMemoria += that.infots[i].Memoria.TotalFisica
                resultado.usadaMemoria += (that.infots[i].Memoria.TotalFisica - that.infots[i].Memoria.DisponibleFisica)
                resultado.carga += that.infots[i].Memoria.Carga;

                if (that.infots[i].sesiones) resultado.sesiones += that.infots[i].sesiones.length

                if (!that.infots[i].sesiones) continue

                // recorro las sesiones de cada servidor
                for (let j = 0; j < that.infots[i].sesiones.length;j++) {

                    if (!that.infots[i].procesos) continue

                    for (let x=0;x<that.infots[i].procesos.length;x++) {
                      if (that.infots[i].sesiones[j].username.toUpperCase() === that.infots[i].procesos[x].username.toUpperCase()) {
                        resultado.procesos++
                      }
                    }
                }
            }

            if (resultado.carga) resultado.carga = resultado.carga/that.infots.length

            resolve(resultado)
        })
    }

    infoServidores() {
        let that = this

        return new Promise(function (resolve, reject) {
            let resultado = []

            resultado = that.infots.map(function(infoServidor) {

                // operador de propagación o expandida / spread operator 
                let obj = {...infoServidor}

                delete obj.Directorio_Actual
                delete obj.Ejecutable
                delete obj.Usuario

                obj.sesiones = infoServidor.sesiones.length
                obj.procesos = infoServidor.procesos.length

                return obj
            })

            resolve(resultado)
        })
    }

    dataBase() {
        return this.infots
    }

    dataBasePromises() {
        let that = this

        return new Promise(function (resolve, reject) {
            resolve(that.infots)
        })
    }

    vacio() {
        let that = this

        return new Promise(function (resolve, reject) {
            resolve({})
        })
    }
}

module.exports = infoTSCModelo
