import * as express from 'express'
import { Request, Response } from 'express'
import { IWebServerStaticRoute, IWebServer, IWebServerApiRoute } from './intf/IServer'
const prerenderServer = require('prerender')
const prerender = require('prerender-node')
const helmet = require('helmet')
const expressStaticGzip = require('express-static-gzip')
const gzipOptions = {
  enableBrotli: true,
  customCompressions: [{
    encodingName: 'deflate',
    fileExtension: 'zz'
  }],
  orderPreference: ['br']
}
const server = ({ config, apiRoutes, staticRoutes, pathToIndex, prerenderToken }: IWebServer): void => {
  const app = express()
  const port = process.env.port || 3000
  if (prerenderToken) {
    prerender.set('prerenderToken', prerenderToken)
    if (config.env === 'development') {
      prerender.set('prerenderServiceUrl', `${config.baseUrl}:3001`)
    }
    app.use(prerender)
    prerenderServer({ port: 3001 }).start()
  }
  app.locals.config = config
  apiRoutes.forEach((route: IWebServerApiRoute) => {
    app.route(route.uri)[route.method.toLowerCase()](route.controller)
  })
  staticRoutes.forEach((route: IWebServerStaticRoute) => {
    app.use(route.uri, config.options.compression ? express.static(route.path) : expressStaticGzip(route.path, gzipOptions))
  })
  app.get('*', (req: Request, res: Response) => {
    console.log(`Inbound: ${req.url}`)
    res.sendFile(pathToIndex)
  })
  app.use((err: any, res: any, req: any, next: any) => {
    console.error(err)
    next()
  })
  app.listen(port, () => {
    console.info(`
      \nApplication status:\n
        * listening at ${port}\n
        * mounting point: ${pathToIndex}\n
        * compression: ${config.options.compression}\n
        * prerendering: ${prerenderToken ? true : false}\n
      `)
  })
}
export default server
