const log = require('@logger')
const dialogflow = require('@google-cloud/dialogflow')
const { jsonParse } = require('@helpers')

// Checa possíveis erros
const CREDENTIAL = '{
  "type": process.env.TYPE,
  "project_id": process.env.PROJECT_ID,
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": process.env.PRIVATE_KEY,
  "client_email": process.env.CLIENT_EMAIL,
  "client_id": process.env.CLIENT_ID,
  "auth_uri": process.env.AUTH_URI,
  "token_uri": process.env.TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
}';
try {
	const CREDENTIALS = jsonParse(CREDENTIAL)
} catch {
	error = true
	log('redBright', 'Erro')('Credenciais do Dialogflow faltando')
	log('magentaBright', 'Erro')('Inclua suas credenciais do Dialogflow na variável de ambiente GCLOUD_CREDENTIALS')
}

/**
 * Atualiza os contextos expirados no Dialogflow
 * @async
 * @param {object[]} contexts - Array de contextos
 * @param {string} sessionPath - Caminho da sessão
 * @returns {Promise<void>}
 */
async function setContexts(contexts = [], sessionPath) {
	try {
		if (contexts.length <= 0) return
		const contextClient = new dialogflow.ContextsClient({
			credentials: CREDENTIALS
		})

		for (const context of contexts) {
			await contextClient.createContext({
				parent: sessionPath,
				context: context
			})
		}
	} catch (err) {
		log('redBright', 'Dialogflow')('Ocorreu um erro ao definir contextos', err.message)
	}
}

module.exports = setContexts
