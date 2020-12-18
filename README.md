![Test](https://github.com/lybrus/amocrm-connector/workflows/Test%20and%20publish/badge.svg)

# Node.js [AmoCRM](https://www.amocrm.ru/developers/content/crm_platform/platform-abilities) api connector

## Описание

Данная библиотека:

* Реализует методы OAuth авторизации
* Реализует методы запросов к api
* Контролирует частоту запросов
* Позволяет использовать ваше хранилище для сохранения и автоматической загрузки:
    * Токена
    * Кэша запросов

## Начало работы

Установка

```shell
yarn add amocrm-connector
```

```shell
npm install amocrm-connector --save
```

### Пример использования

```javascript
const { AmoCRM, events } = require('amocrm-connector')
// es6 синтаксис
// import { AmoCRM, events } from 'amocrm-connector'

// Опционально, можно не использовать
// С помощью этого объекта вы можете сохранять данные в базу данных
const store = {
    _data: {},
    async get(key) {
        return this._data[key]
    },
    async set(key, value, updatedAt, expiresIn) {
        this._data[key] = {
            value,
            updatedAt
        }
    }
}

const amocrm = new AmoCRM({
    credential: {
        // Ваш аккаунт находится по адресу https://[domain].amocrm.ru
        domain: '...',
        // Из настроек интеграции
        integrationId: '...',
        secretKey: '...',
        redirectUri: '...'
    },
    options: {
        store
    }
})

amocrm.on(events.token, token => {
    // коллбэк будет вызываться каждый раз при получении нового токена
})

// Получение ссылки для OAuth авторизации клиента
const link = amocrm.getOAuthLink()

;(async () => {
    // Необязательно, если подключен стор будет автоматически загружен
    // ранее сохраненный токен
    await amocrm.init()

    // Получение токена по коду авторизации
    await amocrm.getToken({ code: '...' })

    // Запрос к api
    const response = await amocrm.get('/api/v4/leads')

    // При завершении процесса вызывайте данный метод для предотвращения потери токена.
    // Во время завершения процесса возможно выполняется запрос обновляющий токен,
    // в таком случае сохраненный токен станет неактуальным, а новый не будет сохранен.
    // Пример с graceful shutdown смотрите в testing/server.js
    await amocrm.uninit()
})()
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

### Объект доступа к хранилищу (store)

Хранилище позволяет:

* сохранять/загружать токен
* кэшировать сущности для снижения трафика и нагрузки на AmoCRM api, испольуется заголовок `If-Modified-Since`

Объект должен иметь 2 асинхронных метода для работы с key/value хранилищем:

* `get`:
    * аргументы
        * `key` - ключ данных
    * возвращаемое значение

```javascript
{
    // значение
    value,
        // дата и время обновления
        updatedAt
}
```

* `set`:
    * аргументы:
        * `key` - ключ
        * `value` - значение
        * `updatedAt` - дата последнего обновления
        * `expiresIn` - время жизни данных в секундах

Реализация хранилища на ваше усмотрение. Удобнее всего использовать для этих целей базу данных.

Пример простого рантайм хранилища:

```javascript
const store = {
    _data: {},
    async get(key) {
        return this._data[key]
    },
    async set(key, value, updatedAt, expiresIn) {
        this._data[key] = {
            value,
            updatedAt
        }
    }
}
```

## Документация

### `AmoCRM`

```javascript
const amocrm = new AmoCRM({
    credential: {
        // Домен вашего аккаунта. Ссылка на ваш аккаунт выглядит как https://[domain].amocrm.ru
        domain,
        // ID интеграции из "ключи и доступы" вашей интеграции
        integrationId,
        // Секретный ключ из "ключи и доступы" вашей интеграции
        secretKey,
        // url из настроек вашей интеграции
        redirectUri
    },
    // необязательный параметр, объект токена полученный ранее
    token,
    // Дополнительные параметры, необязательный параметр
    options: {
        // Boolean, включает режим отладки, выводит логи в консоль. Необязательный, значение по-умолчанию false
        debug,
        // Объект для доступа к вашему хранилищу. Почитать можно в разделе Хранилище. Необязательный параметр.
        store,
        // Автоматический контроль refresh токена, за сколько секунд до окончания его срока действия обновлять.
        // 0 - не использовать автоматический контроль. Значение по-умолчанию 0.
        // Не используйте данный параметр если запускаете больше инстанса вашего сервера, контролируйте из отдельной cron job
        refreshTokenUpdateOffset,
        // Максимальное количество запросов в секунду.
        // Согласно документации число не должно превышать 7
        // Значение по-умолчанию 5
        maxRequestsPerSecond
    }
})
```

### События

Класс AmoCRM унаследован от класса EventEmitter.

* Подписка на событие `on(eventName, listener)`
* Отписка от события `removeListener(eventName, listener)`

Больше информации можно почитать в официальной [документации](https://nodejs.org/api/events.html).

#### Список событий

| Имя события | Параметры коллбэка      |
|-------------|-------------------------|
| token       | `token` - объект токена |

```javascript
const token = {
    // access token
    access,
    // Дата до которой access token действителен. Тип Date.
    accessUntil,
    // refresh token
    refresh,
    // Дата до которой refresh token действителен. Тип Date.
    refreshUntil
}
```

### Авторизация

#### `amocrm.getOAuthLink(state, mode)`

`state` - уникальная строка, которая будет передана вам обратно в виде гет параметра после выдачи доступа вашему
приложению.
`mode` - режим обработки redirect uri, по-умолчанию `post_message`
Возвращает ссылку для OAuth авторизации

#### `async amocrm.getToken({ code, refreshToken })`

Получает токен по коду авторизации или токену обновления.

### Запросы к api

* `async amocrm.get(options)`
* `async amocrm.post(options)`
* `async amocrm.patch(options)`
* `async amocrm.request({ method, ...options })` `method` возможные значения `GET`, `POST`, `PATCH`

```javascript
const options = {
    // Путь до ресурса, обязательный параметр
    path: '/api/v4/leads',
    // Данные для POST и PATCH запросов, необязательный
    data,
    // Timestamp для заголовка If-Modified-Since. Необязательный параметр. Тип Data
    ifModifiedSince,
    // Использовать кэш. Если подключен стор, запросы будут кэшироваться.
    // Тип Boolean, значение по-умолчанию false
    useCache = false,
    // Время в секундах на которое кэшировать запрос.
    // Значение по-умолчанию 300
    cacheTTL = 300,
    // Явно указывает, добавлять ли заголовок Authorization
    // Актуально когда нужно отправить запрос без данного заголовка
    // Тип Boolean, значение по-умолчанию true
    useToken = true
}
```

#### Возвращаемое значение

```javascript
const response = {
    // Статус (код) HTTP ответа
    statusCode,
    // Тестовое описание статуса
    statusMessage,
    // Заголовки ответа
    headers,
    // Являются ли данные ответа json
    json,
    // Данные ответа
    data
}
```

Ответ возвращается для всех 2xx статусов и статуса 304 (not modified). В остальных случая будет брошено исключение типа
RequestError (ответ содержится в поле `response` исключения)

Методы автоматически проверяют актуальность токена и обновляют его в случае необходимости.

