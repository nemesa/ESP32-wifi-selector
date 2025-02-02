import fs from 'fs'
import path from 'path'

export default function build(): string {
    let buildOutput = ''
    const indexHtmlContent = fs.readFileSync('./app/index.html', 'utf8')
    buildOutput += indexHtmlContent

    /*STYLES*/
    let styles = ''
    fs.readdirSync('./styles').forEach(file => {
        const filePath = path.join('./styles', file)
        console.log('adding',filePath)
        const styleContent = fs.readFileSync(filePath, 'utf8')
        styles += `<style>\n${styleContent}\n</style>\n`
    })
    buildOutput = buildOutput.replace('</head>', `${styles}\n${'</head>'}`)

    /*SCRITS*/
    let scripts = ''
    fs.readdirSync('./scripts').forEach(file => {
        const filePath = path.join('./scripts', file)
        console.log('adding',filePath)
        const scriptContent = fs.readFileSync(filePath, 'utf8')
        scripts += `<script type="text/javascript">\n${scriptContent}\n</script>\n`
    })
    buildOutput = buildOutput.replace('</head>', `${scripts}\n${'</head>'}`)

    /*TEMPLATES*/
    let templates = ''
    fs.readdirSync('./templates').forEach(file => {
        const filePath = path.join('./templates', file)
        console.log('adding',filePath)
        const templateId = path.parse(filePath).name
        const templateContent = fs.readFileSync(filePath, 'utf8')
        templates += `<script type="text/html" id="${templateId}">\n${templateContent}\n</script>\n`
    })
    buildOutput = buildOutput.replace('</head>', `${templates}\n${'</head>'}`)

    return buildOutput

}