import express, { Express } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import build from './build'

const app: Express = express()

const PORT = 1234


// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
app.use(express.json())

app.get('/', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    
    res.set('Content-Type', 'text/html')
    res.send(Buffer.from(build()))
})


app.get('/ko.js', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    const indexHtmlContent = fs.readFileSync('ko.js', 'utf8')
    res.set('Content-Type', 'text/javascript; charset=UTF-8')
    res.send(Buffer.from(indexHtmlContent))
})

app.get('/scan-wifi', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)
    res.set('Content-Type', 'text/plain')    
    res.send("OK")
})

app.get('/scan-wifi-result', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)
    const response = {
        "networks": [
            { "SSID": "Rem-Guest", "RSSI": -68, "EncryptionType": "WPA2/PSK" },
            { "SSID": "Rem-IOT", "RSSI": -68, "EncryptionType": "WPA2/PSK" },
            { "SSID": "Telekom-992531", "RSSI": -78, "EncryptionType": "WPA2/PSK" },
            { "SSID": "Telekom-fb562f", "RSSI": -83, "EncryptionType": "Unknown" },
            { "SSID": "Telekom-fb562f", "RSSI": -83, "EncryptionType": "None" },
            { "SSID": "Rem-IOT", "RSSI": -85, "EncryptionType": "WPA2/PSK" },
            { "SSID": "Rem-Guest", "RSSI": -86, "EncryptionType": "WPA2/PSK" }
        ]
    }

    res.json(response)
})


app.post('/connect-wifi', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)

    console.log(JSON.stringify(req.body, null, 2))
    const response = {
        "ok": true
    }

    res.json(response)
})


app.listen(PORT, () => {
    console.log(`***************************************************** `)
    console.log(`* dev - server running                *`)
    console.log(`* at http://localhost:${PORT}   *`)
    console.log(`*****************************************************`)

})