const Service = require('node-windows').Service
const path = require('path')

const dir_node = __dirname + '\\..\\node'

const svc = new Service({
  name:'Visor Windows Terminal Services',
  description: 'Visor y administrador de Windows Terminal Services y Servidores',
  script: path.join(__dirname,'..\\index.js'),
  execPath: dir_node  + '\\node.exe',
  env: [
    {
      name: 'PATH',
      value: dir_node + ';' + process.env['PATH']
    },
    {
      name: 'NODE_PATH',
      value: dir_node
    }
  ]
})

svc.on('install',function() {
  console.log('Servicio instalado correctamente.')
  console.log('Para iniciar ejecute net start "Visor Windows Terminal Services"')
  //  svc.start();
})

svc.on('error', function(error) {
  console.log('Error:', error)
})

svc.install()
// svc.uninstall()
