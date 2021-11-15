import * as PrismicPlugin from './plugins/prismic'
import * as LocalePlugin from './plugins/locale'
import * as RequestPlugin from './plugins/request'
import { BaseMobxStore as _BaseMobxStore } from './common/_base'
import BootstrapComponent from './common/bootstrap'
import _RequestLifeCycles from './common/props/RequestLifeCycles'
import _RequestMethods from './common/props/RequestMethods'
import _LocaleMobxStore from './plugins/locale/modules/mobx'
import _PrismicMobxStore from './plugins/prismic/modules/mobx'
import _PrismicParser from './plugins/prismic/modules/parser'
export { IKeyAny } from './common/intf/IKeyAny'
export { IKeyString } from './common/intf/IKeyString'
export { IBaseWebAppConfig } from './common/intf/IBaseWebAppConfig'
export { IBaseWebAppProps } from './common/intf/IBaseWebAppProps'
export { IBaseWebAppRoute } from './common/intf/IBaseWebAppRoute'
export { IBaseApiRoute } from './common/intf/IBaseApiRoute'
export { IBaseRequest } from './common/intf/IBaseRequest'
export const Bootstrap = BootstrapComponent
export type LocaleMobxStore = _LocaleMobxStore
export type PrismicMobxStore = _PrismicMobxStore
export type PrismicParser = _PrismicParser
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
