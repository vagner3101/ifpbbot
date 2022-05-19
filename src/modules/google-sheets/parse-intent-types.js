const { includes } = require('./helpers')

/**
 * Converte a intenção do formato de texto para objeto do IFPBBot
 * Veja o arquivo: /src/dialogflow/README.md
 * @param {object} intent - Objeto da intenção
 * @param {string} columnName - Nome da coluna
 * @param {string} cellValue - Valor da célula
 */
function parseIntentTypes(intent, columnName, cellValue) {
	// "includes" verifica se o nome da coluna contém alguma das seguintes strings
	// Para cada tipo de resposta adicione um "if" e execute "intent.messages.push(<objeto no formato IFPBBot>)"

	if (includes(columnName, ['nome', 'name', 'titulo', 'title'])) {
		// Título da intenção
		if (!intent.displayName) intent.displayName = cellValue

	} else if (includes(columnName, ['pergunta', 'frase', 'mensagem', 'question', 'message'])) {
		// Perguntas da intenção
		intent.trainingPhrases.push(...cellValue.split('\n'))

	} else if (includes(columnName, ['variacao', 'variation'])) {
		// Variação de texto
		intent.messages.push({
			type: 'text_variation',
			text: cellValue
		})

	} else if (includes(columnName, ['texto', 'text', 'resposta', 'response'])) {
		// Texto
		intent.messages.push({
			type: 'text',
			text: [cellValue]
		})

	} else if (includes(columnName, ['imagem', 'image', 'foto', 'photo', 'picture'])) {
		// Imagem
		intent.messages.push({
			type: 'image',
			rawUrl: cellValue
		})

	} else if (includes(columnName, ['arquivo', 'file', 'documento'])) {
		// Arquivo
		intent.messages.push({
			type: 'file',
			url: cellValue
		})

	} else if (includes(columnName, ['botao', 'button', 'chips'])) {
		// Chips
		intent.messages.push({
			type: 'chips',
			options: [{ text: cellValue }]
		})
	}
}

module.exports = parseIntentTypes