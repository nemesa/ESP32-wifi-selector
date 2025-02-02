import express, { Express, response } from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import build from './build'

const app: Express = express()

const PORT = 1234


const delay = async function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
app.use(express.json())


app.get('/server-simulation-page', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    const simulationPageHtmlContent = fs.readFileSync('dev-simulation-index.html', 'utf8')
    res.set('Content-Type', 'text/html; charset=UTF-8')
    res.send(Buffer.from(simulationPageHtmlContent))
})

let simConfig = {
    connectionInfo:
    {
        delay: null,
        response: {
            status: 3,
            ip: "192.168.1.1",
            rssi: -62
        }
    },
    scanWifi:{
        delay: 1000,
    }

}

app.get('/sim/config', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    res.json(simConfig)
})

app.post('/sim/config', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    console.log(JSON.stringify(req.body, null, 2))
    simConfig = req.body
    res.json(simConfig)
})


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

app.get('/toast.js', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    const indexHtmlContent = fs.readFileSync('Toastify.js', 'utf8')
    res.set('Content-Type', 'text/javascript; charset=UTF-8')
    res.send(Buffer.from(indexHtmlContent))
})

app.get('/scan-wifi', (req, res) => {
    console.log(`${req.method} ${req.url}`)
    res.set('Content-Type', 'text/plain')
    res.send("OK")
})

app.get('/scan-wifi-result', async (req, res) => {
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
    if (simConfig.scanWifi.delay !== null) {
        await delay(simConfig.scanWifi.delay)
    }
    res.json(response)
})


app.post('/connect-wifi', (req, res) => {
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
    console.log(`${req.method} ${req.url}`)


    res.json(settingsObj)
})
app.post('/settings', (req, res) => {
    console.log(`${req.method} ${req.url}`)

    console.log(JSON.stringify(req.body, null, 2))
    settingsObj = req.body
    const response = {
        success: true
    }

    res.json(response)
})

app.get('/connection-info', async (req, res) => {
    console.log(`${req.method} ${req.url}`)
    const response = simConfig.connectionInfo.response
    if (simConfig.connectionInfo.delay !== null) {
        await delay(simConfig.connectionInfo.delay)
    }
    res.json(response)
})

app.listen(PORT, () => {
    console.log(`***************************************************** `)
    console.log(`* dev - server running                *`)
    console.log(`* at http://localhost:${PORT}   *`)
    console.log(`* dev - server side simulation page                *`)
    console.log(`* at http://localhost:${PORT}/server-simulation-page   *`)
    console.log(`*****************************************************`)

})