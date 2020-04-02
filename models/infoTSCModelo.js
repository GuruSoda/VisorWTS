const fetch = require('node-fetch')
const fs = require('fs')

const configuracion = 'configs/infoTSCConfig.json'

let config = {}

if (fs.existsSync(configuracion)) {
    config = require('../' + configuracion)
}

class infoTSCModelo {
    constructor() {
      this.infots = []
      this.ultimaCarga = new Date(0)
    }

    servidores() {
        return config.servidores
    }

    async cargaCompleta() {
        let ts = this.servidores()
        this.infots = []

        let that = this

        for (let i=0;i<ts.length;i++) {
            let obj= {}

            that.infots[i] = {}
            await fetch('http://' + ts[i] + ':7319/wts/informacion')
                .then(function(res) {
                  return res.json()  
                })
                .then(function(json) {
                    that.infots[i] = json
                }).catch(function(data){
                    console.log('Error:' + data)
                })

            // si el atributo Computadora esta sin datos es por que fallo el anterior fetch
            if (!that.infots[i].Computadora) continue

            that.infots[i].ts = ts[i]

            that.infots[i].sesiones = []
            await fetch('http://' + ts[i] + ':7319/wts/sesiones')
                .then(function(res) {
                    return res.json()  
                })
                .then(function(json) {
                    that.infots[i].sesiones = json
                }).catch(function(data) {
                    console.log('Error:' + data)
                })

            that.infots[i].procesos = []
            await fetch('http://' + ts[i] + ':7319/wts/procesos')
                .then(function(res) {
                    return res.json()  
                })
                .then(function(json) {
                    that.infots[i].procesos = json
                }).catch(function(data) {
                    console.log('Error:' + data)
                })
        }

        return this.infots
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

                that.cargaCompleta().then(function(data) { resolve(that.infots) })
            } else {
                resolve(that.infots)
            }
        })

//        return this.infots;
    }
}

module.exports = infoTSCModelo
