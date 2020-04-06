let wts = require('../models/infoTSCModelo')

let agente = new wts()


async function main() {
    console.log('antes de recolectar')
    let data = await agente.recolectar()

    console.log(data)
    console.log('despues de recolectar')

 /*
    let data = agente.recolectar().then(function(data) {
        console.log(data)
        console.log('despues de recolectar')
        return data
    })
*/

}

main()
// console.log('fin')