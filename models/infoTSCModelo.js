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

            await fetch('http://' + ts[i] + ':7319/wts/informacion')
                .then(function(res) {
                  return res.json()  
                })
                .then(function(json) {
                    json.ts = ts[i]
                    that.infots.push(json)
                    return that.infots
                }).catch(function(data){

                })

            await fetch('http://' + ts[i] + ':7319/wts/sesiones')
                .then(function(res) {
                    return res.json()  
                })
                .then(function(json) {
                    that.infots[i].sesiones = json

                    return that.infots
                }).catch(function(data) {
                    that.infots[i].sesiones = []
                })

            await fetch('http://' + ts[i] + ':7319/wts/procesos')
                .then(function(res) {
                    return res.json()  
                })
                .then(function(json) {
                    that.infots[i].procesos = json

                    return that.infots
                }).catch(function(data) {
                    that.infots[i].procesos = []
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
                that.cargaCompleta().then(function(data){
                    resolve(that.infots)
                })
            } else {
                resolve(that.infots)
            }
        })

//        return this.infots;
    }
}

module.exports = infoTSCModelo
