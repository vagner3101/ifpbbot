# Função `getDFResponse`

### `getDFResponse(text, from, platform = '')`

Recebe como parâmetros a **mensagem do usuário** (`text`), o **remetente** (`from`) que pode ser em qualquer formato e o **nome da plataforma** (`platform`).

Esta função retorna uma *Promise* que resolvida retorna um *array* com as respostas do Dialogflow. Cada tipo de resposta é especificado abaixo:

## Estrutura da resposta
```javascript
[
  {
    type: 'text|chips|image|file|contact|accordion'
    // Outros parâmetros específicos de cada tipo
  },
  ...
]
```

### Custom Payload
Estes objetos podem ser incluídos na resposta do Dialogflow como **Custom Payload** com a seguinte estrutura:
```json
{
  "richContent": [
    [
      // Incluir objetos aqui
    ]
  ]
}
```

### `text` (gerado automaticamente)
Envia uma mensagem simples de texto
```json
{
  "type": "text",
  "text": "Texto da mensagem"
}
```

### `chips`
Envia botões clicáveis para respostas rápidas<br>
[Documentação do Dialogflow Messenger](https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger#suggestion_chip_response_type)
> Obs.: O WhatsApp suporta no máximo 3 botões

```json
{
  "type": "chips",
  "options": [
    { "text": "Botão 1" },
    { "text": "Botão 2" },
    { "text": "Botão 3" }
  ]
}
```

### `image`
Envia uma imagem<br>
[Documentação do Dialogflow Messenger](https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger#image_response_type)
```json
{
  "type": "image",
  "rawUrl": "URL da imagem",
  "accessibilityText": "Legenda da imagem" // Opcional
}
```

### `file`
Envia um arquivo
> Não suportado pelo Dialogflow Messenger
```json
{
  "type": "file",
  "url": "URL do arquivo",
  "name": "Nome do arquivo" // Opcional
}
```

### `contact`
Envia um contato (número de telefone)<br>
Formato recomendado: "551187654321@c.us"
> Não suportado pelo Dialogflow Messenger
```json
{
  "type": "contact",
  "number": "Número de telefone",
  "name": "Nome do contato"
}
```

### `accordion`
Envia um acordeão, que pode ser expandido ao clicar<br>
[Documentação do Dialogflow Messenger](https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger#accordion_response_type)
```json
{
  "type": "accordion",
  "title": "Título do acordeão",
  "text": "Conteúdo"
}
```

<br>

> A documentação para outros tipos que **funcionam apenas no Dialogflow Messenger** podem ser encontrados em: https://cloud.google.com/dialogflow/es/docs/integrations/dialogflow-messenger#info_response_type

<br>

## Ignorar plataforma
Em qualquer um destes objetos é possível adicionar um parâmetro para ignorar certas plataformas, como por exemplo:
```json
{
  "type": "accordion",
  "title": "Título do acordeão",
  "text": "Conteúdo",
  "ignoreWhatsApp": true, // Esta mensagem não será enviada no WhatsApp
  "ignoreTelegram": true // Esta mensagem não será enviada no Telegram
}
```