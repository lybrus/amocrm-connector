![Test](https://github.com/lybrus/amocrm-connector/workflows/Test%20and%20publish/badge.svg)

# Node.js [AmoCRM](https://www.amocrm.ru/developers/content/crm_platform/platform-abilities) api connector

Изначально библиотека создавалась для внутреннего использования. Периодически, с внесением изменений в amocrm api, в
интеграции появляются ошибки. Цель данного проекта помочь создать надежный, протестированный инструмент для работы с
amocrm. :ok_hand:
Поддерживать его актуальным с помощью автотестов и сообщества. Автоматические тесты запускаются каждый день с
использованием github actions.

## Описание

Основные возможности:

* OAuth авторизация
* Запросы к api
* Частичное покрытие методов api
* Работа с api чатов

## Основные отличия версии 0.3.x от 0.2.x

* Переход на TypeScript
* Убраны механизмы контроля частоты запросов и автоматического обновления токена
* Убрана поддержка стора
* Добавлены подсистемы и описаны типы некоторых dto
* Добавлена поддержка chat api

## Начало работы

### Установка

```shell
yarn add amocrm-connector
```

### Пример использования

```typescript
import {AmoCRM, AmoCRMToken} from 'amocrm-connector'
import rawToken from './token.json'

const {accessUntil, ...rest} = rawToken
const token = {
    accessUntil: new Date(accessUntil),
    ...rest
}

;(async () => {
    const amocrm = new AmoCRM({
        credential: {
            domain: 'your_domain',
            integrationId: 'integration-id',
            secretKey: 'secret-key',
            redirectUri: 'redirect-uri'
        },
        token
    })

    const {amojoId} = await amocrm.account.get(AccountWith.amojoId)
    if (!amojoId) return

    const scopeId = await amocrm.chat.connectChannel(amojoId, 'Название канала')

    const result = await amocrm.chat.addMessage(
        scopeId,
        {
            date: new Date(),
            // id беседы из вашей системы
            conversationId: 'conversation-id',
            sender: {
                id: 'sender-id',
                name: 'Имя клиента',
                profile: {
                    phone: '71234567890'
                }
            },
            id: 'message-id',
            message: {
                type: MessageType.Text,
                text: 'Тест сообщения'
            }
        }
    )
})()
```

Другие примеры смотрите в папке [examples](examples)

## Документация

### Создание объекта AmoCRM
* [new AmoCRM(options)](#AmoCRM)

### Методы AmoCRM
* [amocrm.on(event, eventListener)](#amocrmonevent-eventlistener)
* [amocrm.addListener(event, eventListener)](#amocrmaddlistenerevent-eventlistener)
* [amocrm.removeListener(event, eventListener)](#amocrmremovelistenerevent-eventlistener)
* [amocrm.tokenIsActual()](#amocrmtokenisactual)
* [amocrm.getToken(options)](#amocrmgettokenoptions)
* [amocrm.getOAuthLink(state, mode)](#amocrmgetoauthlinkstate-mode)
* [amocrm.request(config)](#amocrmrequestconfig)
* [amocrm.get(config)](#amocrmgetconfig)
* [amocrm.post(config)](#amocrmpostconfig)
* [amocrm.patch(config)](#amocrmpatchconfig)
* [amocrm.delete(config)](#amocrmdeleteconfig)

### Подсистемы
#### Аккаунт
* [amocrm.account.get(withParams)](#amocrmaccountgetwithparams)

#### Чаты
* [amocrm.chat.request(config)](#amocrmchatrequestconfig)
* [amocrm.chat.get(config)](#amocrmchatgetconfig)
* [amocrm.chat.post(config)](#amocrmchatpostconfig)
* [amocrm.chat.checkSignature(body, signature)](#amocrmchatchecksignaturebody-signature)
* [amocrm.chat.connectChannel(amojoId, title)](#amocrmchatconnectchannelamojoid-title)
* [amocrm.chat.addMessage(scopeId, payload)](#amocrmchataddmessagescopeid-payload)
* [amocrm.chat.deliveryStatus(scopeId, messageId, data)](#amocrmchatdeliverystatusscopeid-messageid-data)
* [amocrm.chat.typing(scopeId, data)](#amocrmchattypingscopeid-data)

### Прочее
* [AmoDTO](#AmoDTO)
* [AmoEntity](#AmoEntity)
* [AmoLike](#AmoLike)

### AmoCRM

```typescript
const amocrm = new AmoCRM({
    credential: {
        // Домен вашего аккаунта. Ссылка на ваш аккаунт выглядит как https://[domain].amocrm.ru
        domain,
        // ID интеграции из "ключи и доступы" вашей интеграции
        integrationId,
        // Секретный ключ из "ключи и доступы" вашей интеграции
        secretKey,
        // url из настроек вашей интеграции
        redirectUri,
        // Секретный ключ канала чатов (secret_key)
        chatSecret,
        // id зарегистрированного канала чатов
        chatId
    },
    // необязательный параметр, объект токена полученный ранее
    token
})
```

### Методы

#### amocrm.on(event, eventListener)

Алиас для [amocrm.addListener(event, eventListener)](#amocrmaddlistenerevent-eventlistener)

### amocrm.addListener(event, eventListener)

```typescript
amocrm.addListener(event: 'token', eventListener: (token: AmoCRMToken) => void): void
```

#### События

* `token` - при получении нового токена

### amocrm.removeListener(event, eventListener)

```typescript
amocrm.addListener(event: 'token', eventListener: (token: AmoCRMToken) => void): void
```

### amocrm.tokenIsActual()

```typescript
amocrm.tokenIsActual(): boolean
```

### amocrm.getToken(options)

Запрашивает новый токен по коду авторизации или токену обновления
```typescript
async amocrm.getToken(options: { code?: string, refreshToken?: string })): Promise<void>
```

### amocrm.getOAuthLink(state, mode)

```typescript
amocrm.getOAuthLink(state: string = '', mode: 'post_message' | 'popup' = 'post_message'): string
```

### amocrm.request(config)

HTTP запрос к amocrm. Основано на библиотеке **[axios](https://github.com/axios/axios)**.

```typescript
async amocrm.request<T = unknown, D = unknown>(config: AmoCRMRequestConfig<D>): Promise<AxiosResponse<T, D>>

type AmoCRMRequestConfig<D = undefined> = AxiosRequestConfig<D> & {
    useToken?: boolean,
    ifModifiedSince?: Date
}

// Описание некоторых полей AmoCRMRequestConfig
{
    // Добавлять ли заголовок Authorization
    useToken: boolean = true,
    // Добавляет заголовок If-Modified-Since
    ifModifiedSince?: Date,
    // Тело запроса
    data?: D,
    // Заголовки запроса
    headers: Record<string, string | number | boolean> = {},
    // Метод запроса
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
    // URL относительно BaseURL
    url: string,
    baseURL: string = `https://${this.credential.domain}.amocrm.ru`
}
```
### amocrm.get(config)

```typescript
amocrm.request({method: 'GET', ...config})
```
### amocrm.post(config)

```typescript
amocrm.request({method: 'POST', ...config})
```
### amocrm.patch(config)

```typescript
amocrm.request({method: 'PATCH', ...config})
```
### amocrm.delete(config)

```typescript
amocrm.request({method: 'DELETE', ...config})
```

### amocrm.account.get(withParams)

Запрос [параметров аккаунта](https://www.amocrm.ru/developers/content/crm_platform/account-info)
```typescript
async amocrm.account.get(withParams?: AccountWith | AccountWith[]): Promise<AccountInfo>
```

### amocrm.chat.request(config)

HTTP запрос к api чатов
Автоматически добавляет заголовки для авторизации запроса
```typescript
async amocrm.chat.request<T = unknown, D = unknown>(config: AmoCRMRequestConfig<D>): Promise<AxiosResponse<T, D>>
```

### amocrm.chat.get(config)

```typescript
amocrm.chat.request({method: 'GET', ...config})
```

### amocrm.chat.post(config)

```typescript
amocrm.chat.request({method: 'POST', ...config})
```

### amocrm.chat.checkSignature(body, signature)

Проверяет подпись для входящих запросов (вебхуков)
```typescript
amocrm.chat.checkSignature(body: unknown, signature?: string | string[]): boolean
```

### amocrm.chat.connectChannel(amojoId, title)

[Подключение канала чата в аккаунте](https://www.amocrm.ru/developers/content/chats/chat-api-reference#Подключение-канала-чата-в-аккаунте)
```typescript
async amocrm.chat.connectChannel(amojoId: string, title: string): Promise<string>
```

Возвращаемое значение - `scopeId`
amojoId может быть получен следующим образом

```typescript
const {amojoId} = await amocrm.account.get(AccountWith.amojoId)
```

### amocrm.chat.addMessage(scopeId, payload)

[Отправка или импорт сообщения](https://www.amocrm.ru/developers/content/chats/chat-api-reference#Отправка-или-импорт-сообщения)
```typescript
async amocrm.chat.addMessage(scopeId: string, addMessagePayload: AmoLike<AddMessagePayload>): Promise<AddMessageResponse>
```

### amocrm.chat.deliveryStatus(scopeId, messageId, data)

[Обновление статуса доставки сообщения](https://www.amocrm.ru/developers/content/chats/chat-api-reference#Обновление-статуса-доставки-сообщения)
```typescript
async amocrm.chat.deliveryStatus(scopeId: string, messageId: string, deliveryStatusRequest: AmoLike<DeliveryStatusRequest>): Promise<void>
```

### amocrm.chat.typing(scopeId, data)

[Передача информации о печатании](https://www.amocrm.ru/developers/content/chats/chat-api-reference#Передача-информации-о-печатание)
```typescript
async amocrm.chat.typing(scopeId: string, typingRequest: AmoLike<TypingRequest>)
```

### AmoDTO

Цель данного класса - описать объекты передачи данных AmoCRM API. Какие задачи решает данный класс
* Преобразование названий свойств camelCase <-> snake_case
* Валидация объекта [нереализовано]
* Типизация объекта
* Сериализация/десериализация

### AmoEntity

AmoEntity - некая сущность обладающая уникальным идентификатором. Свойства содержащие ссылки (идентификаторы) на объекты такого типа при десериализации автоматически заменяются на объекты этого тип, и наоборот.

### AmoLike

AmoDTO и AmoEntity - классы, и для передачи значений в методы api необходимо создать каждый объект, создать вложенные объекты и т.п.
Это создает много лишнего кода. Для возможности более лаконичного описания передаваемого аргумента используется AmoLike.
```typescript
type AmoLike<T extends AmoDTO = AmoDTO> = T | DeepPartial<T>
```
Таким образом мы можем передавать в качестве аргумента как сам объект AmoDTO, так и плоский объект.

#### Пример

```typescript
    // Плоский объект
    const result = await amocrm.chat.addMessage(
        scopeId,
        {
            date: new Date(),
            // id беседы из вашей системы
            conversationId: 'conversation-id',
            sender: {
                id: 'sender-id',
                name: 'Имя клиента',
                profile: {
                    phone: '71234567890'
                }
            },
            id: 'message-id',
            message: {
                type: MessageType.Text,
                text: 'Тест сообщения'
            }
        }
    )

    //AmoDTO
    const result = await amocrm.chat.addMessage(
        scopeId,
        new AddMessagePayload({
            date: new Date(),
            // id беседы из вашей системы
            conversationId: 'conversation-id',
            sender: new MessageParticipant({
                id: 'sender-id',
                name: 'Имя клиента',
                profile: new MessageParticipantProfile({
                    phone: '71234567890'
                })
            }),
            id: 'message-id',
            message: new AddMessageContent({
                type: MessageType.Text,
                text: 'Тест сообщения'
            })
        })
    )
```

### Авторизация

Подробно про AmoCRM реализацию OAuth2 авторизации
в [официальной документации](https://www.amocrm.ru/developers/content/oauth/step-by-step)
Также можете посмотреть [видео](https://youtu.be/eK7xYAbxJHo) от создателей другой
библиотеки [https://github.com/UsefulWeb/AmoCRM](https://github.com/UsefulWeb/AmoCRM).

Коротко, шаги:

1. Регистрация вашей интеграции
2. Переход пользователя по ссылке выдачи доступа пользователем вашему приложению. Ссылку получить можно
   методом `amocrm.getOAuthLink`
3. Обработка запроса на redirect uri, здесь должен быть запущен ваш сервер. В виде гет параметра amocrm передаст код
   авторизации. Его необходимо обменять на токен с помощью метода `amocrm.getToken`. Пример реализации смотрите в
   файле `testing/server.js`

## Ошибки и пожелания

Если в процессе использования вы обнаружили ошибку, расскажите о ней,
откройте [issue](https://github.com/lybrus/amocrm-connector/issues) с подробным описанием. Спасибо за помощь в
тестировании! :thumbsup: Если у вас есть пожелания, также
открывайте [issue](https://github.com/lybrus/amocrm-connector/issues)! :eyes:

## Разработка

### Команды

* `yarn build` сборка проекта
* `yarn serve` запуск сервера для обработки запросов от amocrm. Необходима настройка окружения.
* `yarn tunnel` создает туннель с использованием утилиты localtunnel. Необходима настройка окружения.
* `yarn cypress` запуск cypress тестов, используется для проверки работы OAuth и автоматического получения токена.
  Необходимо:
    * Настроить окружение. Токен сохраняется в testing/token.json. Про настройку окружения ниже.
    * Запустить сервер для обработки запросов от amocrm.
    * Создать туннель с публичного адреса на ваш локальный сервер.
* `yarn cypress:open` запуск cypress тестов в интерактивном режиме. Необходима настройка окружения.
* `yarn jest` запуск jest тестов. Для работы необходимо настроить окружение, а также токен в testing/token.json. Поэтому
  полезно сначала запустить cypress тест.
* `yarn test` запуск cypress и jest тестов

### Настройка окружения

Необходимо создать файл `.evn.test` с переменными окружения в корне проекта. Для удобства можно воспользоваться
шаблоном `.env.test.example` (здесь также описано для чего нужны переменные)

```shell
cp .env.test.example .env.test
```

Если у вас есть вопросы касательно разработки - пишите мне в телеграм [@lybrus](https://t.me/lybrus). :point_left:

**Любая помощь в разработке и тестировании данного проекта приветствуется!** :thumbsup:
