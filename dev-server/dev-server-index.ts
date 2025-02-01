import express, { Express } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import build from './build'

const app: Express = express()

const PORT = 1234


const dealay = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

app.get('/scan-wifi-result', async (req, res) => {
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
    await dealay(3000)
    res.json(response)
})


app.post('/connect-wifi', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)

    console.log(JSON.stringify(req.body, null, 2))
    const response = {
        "ok": true
    }

    settingsObj.connect_to_ssid = req.body.ssid
    settingsObj.connect_to_password = req.body.password || null

    res.json(response)
})


let settingsObj = {
    "ap_ssid": "ESP32 - 192.168.4.1",
    "ap_password": null,
    "connect_to_ssid": "some ssid",
    "connect_to_password": "some password",
}

app.get('/settings', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)


    res.json(settingsObj)
})
app.post('/settings', (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)

    console.log(JSON.stringify(req.body, null, 2))
    settingsObj = req.body
    const response = {
        success: true
    }

    res.json(response)
})

app.get('/connection-info', async (req, res) => {
    (req as any).socket = null
    console.log(`${req.method} ${req.url}`)
    const response = {
        ipAddress: "192.168.1.1"
    }
    await dealay(7000)
    res.json(response)
})

app.listen(PORT, () => {
    console.log(`***************************************************** `)
    console.log(`* dev - server running                *`)
    console.log(`* at http://localhost:${PORT}   *`)
    console.log(`*****************************************************`)

})