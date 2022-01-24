console.clear()
require('dotenv/config')
require('module-alias/register')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const qrcode = require('qrcode-terminal')
const { Client } = require('whatsapp-web.js')
const ChromeLauncher = require('chrome-launcher')
const chromePath = ChromeLauncher.Launcher.getInstallations()[0]
const makeBox = require('@helpers/makebox')
const jsonParse = require('@helpers/json-parse')
const printLogo = require('@helpers/print-logo')
const getDFResponse = require('@dialogflow/get-df-response')
const parseMessages = require('./parse-messages')

const SESSION_FILE_PATH = './wa-session.json'

const client = new Client({
	session: fs.existsSync(path.resolve(__dirname, SESSION_FILE_PATH))
		? jsonParse(fs.readFileSync(path.resolve(__dirname, SESSION_FILE_PATH), { encoding: 'utf-8' }))
		: jsonParse(process.env.WHATSAPP_TOKEN, null, null, true),
	puppeteer: { executablePath: chromePath }
})

console.log(makeBox('Conectando, aguarde...', chalk.yellowBright, chalk.yellow))
printLogo()
process.title = 'Conectando...'

// Quando conectar, salva a sessão no arquivo
client.on('authenticated', (session) => {
	fs.writeFile(path.resolve(__dirname, SESSION_FILE_PATH), JSON.stringify(session), () => { })
})

// Falha na autenticação
client.on('auth_failure', () => {
	console.clear()
	console.log(makeBox('Falha na autenticação do WhatsApp', chalk.redBright, chalk.red))
	printLogo()
	process.title = 'Falha na autenticação'
})

// Desconectado
client.on('disconnected', () => {
	console.clear()
	console.log(makeBox('Desconectado', chalk.redBright, chalk.red))
	printLogo()
	process.title = 'Desconectado'
})

// Imprime o QR Code
client.on('qr', (qr) => {
	console.clear()
	process.title = 'Aguardando autenticação...'
	console.log(makeBox('Escaneie o QR Code no seu WhatsApp', chalk.cyanBright, chalk.cyan))
	qrcode.generate(qr, { small: true })
})

// Conectado
client.on('ready', () => {
	console.clear()
	console.log(makeBox('Conectado!', chalk.greenBright, chalk.green))
	printLogo()
	process.title = 'IFPB ChatBot'
})

// Nova mensagem
client.on('message', async (msg) => {
	// Permite apenas alguns contatos (para testes)
	if (process.env.WHATSAPP_ALLOWED_NUMBERS) {
		if (!process.env.WHATSAPP_ALLOWED_NUMBERS.split(',').includes(msg.from)) return
	}

	const chat = msg.getChat()

	// Ativa o estado "Digitando..."
	chat.then(c => c.sendStateTyping())

	// Retorna a resposta do DialogFlow
	getDFResponse(msg.body, msg.from, 'whatsapp')
		.then((r) => parseMessages(r, client))
		.then((m) => sendMessages(m, client, msg))
		.catch((e) => error(e, msg))
		.finally(() => {
			// Desativa o estado "Digitando..."
			chat.then(c => c.clearState())
		})
})

// Envia as mensagens
async function sendMessages(msgs, client, msg) {
	for (let res of msgs) {
		// Se a mensagem for uma Promise
		if (res.then) res = await res.catch((err) => {
			console.error(err)
			return null
		})

		// Envia apenas se a mensagem for válida
		if (res) await client.sendMessage(msg.from, res).catch(console.error)
	}
}

// Executa caso ocorra algum erro
function error(err, msg) {
	console.error(err)
	client.sendMessage(msg.from, 'Ops! Ocorreu um problema técnico, peço desculpas').catch(console.error)
}

// Inicia o servidor
client.initialize()

// Evita que o servidor feche quando ocorrer um erro
process.on('uncaughtException', console.error)

module.exports = client