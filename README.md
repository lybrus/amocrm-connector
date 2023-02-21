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

## Начало работы

### Установка

```shell
yarn add amocrm-connector
```

### Пример использования

```typescript
import { Integration, Client, Channel, Chat, MessageType } from 'amocrm-connector'
import rawToken from './token.json'

const { accessUntil, ...rest } = rawToken
const token = {
        accessUntil: new Date(accessUntil),
        ...rest
    }

;(async () => {
    const integration = new Integration({
        integrationId: 'integration id',
        secretKey: 'secret key',
        redirectUri: 'redirect uri'
    })

    const client = new Client({
        integration,
        subdomain: 'your_subdomain',
        token
    })

    const accountInfo = await client.account.getAccountInfo()

    const channel = new Channel({
        chatId: 'chat id',
        chatSecret: 'chat secret',
        title: 'channel title'
    })

    const chat = await channel.connect(client)

    const result = await chat.addMessage({
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

### Integration

* [new Integration(options)](src/integration/integration.ts#L14)

Объект является экземпляром `EventEmitter`, [события описаны здесь](src/integration/integration.ts#L6)

#### Методы

* [getOAuthLink](src/integration/integration.ts#L28)
* [processOAuthRedirect](src/integration/integration.ts#L33)
* [on](src/integration/integration.ts#L59)
* [addListener](src/integration/integration.ts#L64)
* [removeListener](src/integration/integration.ts#L69)

### Client

* [new Client(options)](src/integration/client/client.ts#L18)

Объект является экземпляром `EventEmitter`, [события описаны здесь](src/integration/client/client.ts#L7)

#### Методы

* [tokenIsActual](src/integration/client/client.ts#L34)
* [getToken](src/integration/client/client.ts#L39)
* [request](src/integration/client/client.ts#L95)
* [get](src/integration/client/client.ts#L114)
* [post](src/integration/client/client.ts#L118)
* [patch](src/integration/client/client.ts#L122)
* [delete](src/integration/client/client.ts#L126)
* [on](src/integration/client/client.ts#L131)
* [addListener](src/integration/client/client.ts#L136)
* [removeListener](src/integration/client/client.ts#L141)

#### Подсистемы

##### Аккаунт

###### Методы

* [account.getAccountInfo](src/integration/client/subsystems/account/account.ts#L19)
* [account.getAmojoId](src/integration/client/subsystems/account/account.ts#L34)

### Channel

* [new Channel(options)](src/chat/channel.ts#L41)

Объект является экземпляром `EventEmitter`, [события описаны здесь](src/chat/channel.ts#L26)

#### Методы

* [checkSignature](src/chat/channel.ts#L50)
* [post](src/chat/channel.ts#L59)
* [connect](src/chat/channel.ts#L101)
* [processWebhook](src/chat/channel.ts#L125)
* [on](src/chat/channel.ts#L154)
* [removeListener](src/chat/channel.ts#L159)

### Chat

* [new Chat(options)](src/chat/chat.ts#L21)

#### Методы

* [addMessage](src/chat/chat.ts#L28)
* [deliveryStatus](src/chat/chat.ts#L41)
* [typing](src/chat/chat.ts#L50)

### Авторизация

Подробно про AmoCRM реализацию OAuth2 авторизации
в [официальной документации](https://www.amocrm.ru/developers/content/oauth/step-by-step)
Также можете посмотреть [видео](https://youtu.be/eK7xYAbxJHo) от создателей другой
библиотеки [https://github.com/UsefulWeb/AmoCRM](https://github.com/UsefulWeb/AmoCRM).

Коротко, шаги:

1. Регистрация вашей интеграции
2. Переход пользователя по ссылке выдачи доступа пользователем вашему приложению. Ссылку получить можно
   методом `integration.getOAuthLink`
3. Обработка запроса на redirect uri, для этого должен быть запущен ваш сервер. Необходимо вызвать (пример
   для `express`) `integration.processOAuthRedirect(req.query)`.
4. `integration` отправит в событие `setup` объект `client`. Процедура авторизации завершена (токен уже получен) и можно
   пользоваться интеграцией.

## Ошибки и пожелания

Если в процессе использования вы обнаружили ошибку, расскажите о ней,
откройте [issue](https://github.com/lybrus/amocrm-connector/issues) с подробным описанием. Спасибо за помощь в
тестировании! :thumbsup: Если у вас есть пожелания, также
открывайте [issue](https://github.com/lybrus/amocrm-connector/issues)! :eyes:

## Планы

* Покрыть все методы api
* Реализовать унифицированный механизм работы с сущностями (Leads, Contacts, Pipelines, Companies, Catalogs, ...)
    * create(data: DTOWithId | DTOWithId[])
    * find(type: typeof DTOWithId, findOptions)
    * findOne(type: typeof DTOWithId, findOptionsOrId)
    * update(data: DTOWithId | DTOWithId[])
    * delete(data: DTOWithId | DTOWithId[])
* Валидация DTO

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
  полезно сначала запустить cypress тест. [Пока тестов нет]
* `yarn test` запуск cypress и jest тестов

### Настройка окружения

Необходимо создать файл `.evn.test` с переменными окружения в корне проекта. Для удобства можно воспользоваться
шаблоном `.env.test.example` (здесь также описано для чего нужны переменные)

```shell
cp .env.test.example .env.test
```

Если у вас есть вопросы касательно разработки - пишите мне в телеграм [@lybrus](https://t.me/lybrus). :point_left:

**Любая помощь в разработке и тестировании данного проекта приветствуется!** :thumbsup:
