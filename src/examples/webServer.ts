import server from '../server/webapp'
import { IBaseAppConfig } from '../client/intf/IBase'
const path = require('path')
const basePath = path.join(__dirname, '../build', process.env.ENV || 'production')
const configExample: IBaseAppConfig = {
  appName: 'demo-app-web',
  env: 'development',
  baseUrl: 'http:
  options: {
    compression: false
  }
}
server({
  config: configExample,
  apiRoutes: [],
  staticRoutes: [
    {
      uri: '/styles',
      path: path.join(basePath, 'styles')
    },
    {
      uri: '/images',
      path: path.join(basePath, 'images')
    },
    {
      uri: '/app',
      path: path.join(basePath, 'app')
    }
  ],
  pathToIndex: path.join(basePath, 'index.html'),
  prerenderToken: 'prerender.io token'
})
