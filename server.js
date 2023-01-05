const { writeFileSync, appendFileSync } = require('node:fs')
const OSC = require('osc-js')

// TODO: add timestamp to filename once logging is observed to be working, otherwise we will generate a bunch of empty files while testing
const outputFilename = (`./output/out.csv`)
const config = {
  open: { port: 9130 }
}
const osc = new OSC({ plugin: new OSC.DatagramPlugin(config) })
osc.on('*', message => {
  console.log('Message:', message)
  const { address, types, args } = message
  const data = { address, types: types.slice(1), argsJson: `'${JSON.stringify(args)}'`, timestamp: Date.now()}
  const newRow = Object.values(data).join(',') + '\n'
  appendFileSync(outputFilename, newRow)
})
osc.on('open', () => {
  console.log('ready to record on port 9130')
  const firstRow = 'address,types,argsJson,timestamp\n'
  writeFileSync(outputFilename, firstRow)
})

osc.open(config) // start a UDP server on port 9130
