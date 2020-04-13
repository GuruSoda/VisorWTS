const express = require('express')
const router = express.Router()
const wts = require('../models/infoTSCModelo.js')
const fs = require('fs')

agente = new wts()

router.get('/recargar', function(req, res, next) {
  agente.recolectar().then(function(data) {
    res.json(data)
  })
})

router.get('/cargafull', function(req, res, next) {
  agente.info().then(function(data) {
    res.json(data)
  })
})

router.get('/database', function(req, res, next) {
  agente.dataBasePromises().then(data => {
    res.json(data)
  })
})

router.get('/exportarusuarios', function(req, res, next) {
  agente.exportarusuarios().then(archivo => {
    res.download(archivo, 'estadoUsuarios.csv', function() {
      fs.unlinkSync(archivo)
    })
  }).catch(error => {
    console.log('error:', error)
    res.send(error)
  })
})

router.get('/usuariosxservidor', function(req, res, next) {
  agente.usuariosxservidor().then(function(data) {
    res.json(data)
  }).catch(function(error) {
    res.json([])
  }) 
})

router.get('/sesionesxservidor', function(req, res, next) {
  agente.sesionesxservidor().then(function(data) {
    res.json(data)
  }).catch(function(data) {
    res.json([])
  })
})

router.get('/resumen', function(req, res, next) {
  agente.resumen().then(function(data) {
     res.json(data)
   }).catch(function(data) {
    res.json({error: data})
  })
})

router.get('/infoservidores', function(req, res, next) {
  agente.infoServidores().then( data => {
     res.json(data)
   }).catch(function(data) {
    res.json({error: data})
  })
})

module.exports = router
