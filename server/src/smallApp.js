import express from 'express'
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/hello', (req, res) => res.send('Hello World New!'))

export {app}
