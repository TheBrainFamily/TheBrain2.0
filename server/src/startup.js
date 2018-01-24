import { createServer } from 'http'
const {app} = require('./app')

const server = createServer(app)
const port = process.env.PORT || 8080

server.listen(port, undefined, undefined, () => console.log( // eslint-disable-line no-console
  `API Server is now running on http://localhost:${port}/graphql`
))
