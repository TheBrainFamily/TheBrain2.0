import { createServer } from 'http'
const {createApp} = require('./app')

const serverListen = async function () {
  const {app} = await createApp()
  const server = createServer(app)
  const port = process.env.PORT || 8080

  server.listen(port, undefined, undefined, () => console.log( // eslint-disable-line no-console
    `API Server is now running on abc http://localhost:${port}/graphql`
  ))
}

serverListen()
