const express = require('express')
const router = express.Router()
const wts = require('../models/infoTSCModelo.js')
const fs = require('fs')
const tmp = require('tmp')

agente = new wts()

router.get('/recargar', function(req, res, next) {

  agente.cargaCompleta().then(function(data) {
    res.json(data)
  })
})

router.get('/cargafull', function(req, res, next) {

  agente.info().then(function(data) {
    res.json(data)
  })

})

router.get('/exportarusuarios', function(req, res, next) {

  agente.info().then(function(data) {

    tmp.file({prefix: 'infoWTS-'}, function _tempFileCreated(err, csvtemp, fd, cleanupCallback) {

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

      res.download(csvtemp, 'estadoUsuarios.csv', function() {
        cleanupCallback()
      })
    })
  })
})


router.get('/usuariosxservidor', function(req, res, next) {

  agente.info().then(function(data) {

    let resultado = []

    // Pimero recorro los servidores
    for (let i = 0; i< data.length;i++) {

      if (!data[i].sesiones) continue
      
      for (let j = 0; j < data[i].sesiones.length;j++) {
        let obj = {}

        obj.userName=data[i].sesiones[j].username
        obj.serverName=data[i].Computadora
        obj.procesos = []

        if (!data[i].procesos) continue

        for (let x=0;x<data[i].procesos.length;x++) {
          if (obj.userName.toUpperCase() === data[i].procesos[x].username.toUpperCase()) {
            obj.procesos.push({ process : data[i].procesos[x].process, idprocess : data[i].procesos[x].idprocess})
          }
        }

        resultado.push(obj)
      }
    }

    res.json(resultado)
  })
})

router.get('/sesionesxservidor', function(req, res, next) {

  agente.info().then(function(data) {

    let resultado = []

    // Pimero recorro los servidores
    for (let i = 0; i< data.length;i++) {

      if (!data[i].Computadora) continue 
      
      let obj = {}

      obj.sesiones=data[i].sesiones
      obj.serverName=data[i].Computadora
        
      resultado.push(obj)
    }

    res.json(resultado)
  })
})

module.exports = router
