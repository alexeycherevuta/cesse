import * as PrismicPlugin from './src/plugins/prismic'
import * as LocalePlugin from './src/plugins/locale'
import * as RequestPlugin from './src/plugins/request'
import { BaseMobxStore as _BaseMobxStore } from './src/common/_base'
import BootstrapComponent from './src/common/bootstrap'
import _RequestLifeCycles from './src/common/props/RequestLifeCycles'
import _RequestMethods from './src/common/props/RequestMethods'
export { IKeyAny } from './src/common/intf/IKeyAny'
export { IKeyString } from './src/common/intf/IKeyString'
export { IBaseWebAppConfig } from './src/common/intf/IBaseWebAppConfig'
export { IBaseWebAppProps } from './src/common/intf/IBaseWebAppProps'
export { IBaseWebAppRoute } from './src/common/intf/IBaseWebAppRoute'
export { IBaseApiRoute } from './src/common/intf/IBaseApiRoute'
export { IBaseRequest } from './src/common/intf/IBaseRequest'
export const Bootstrap = BootstrapComponent
export namespace Plugins {
  export const Prismic = PrismicPlugin
  export const Locale = LocalePlugin
  export const Request = RequestPlugin
}
export namespace Common {
  export namespace Props {
    export const RequestLifeCycles = _RequestLifeCycles
    export const RequestMethods = _RequestMethods
  }
  export type BaseMobxStore = _BaseMobxStore
}
