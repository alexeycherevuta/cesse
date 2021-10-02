import * as PrismicPlugin from './src/plugins/prismic'
import BaseStoreClass from './src/client/plugins/index'
import BucketPlugin from './src/client/plugins/bucket'
import LocalePlugin from './src/client/plugins/locale'
import AgentHelper from './src/client/helpers/agent'
import RequestHelper from './src/client/helpers/request'
import * as PrismicToReactHelper from './src/plugins/prismic/modules/react'
import BootstrapComponent from './src/client/bootstrap'
import _Languages from './src/common/props/Languages'
import _PrismicSpans from './src/plugins/prismic/props/PrismicSpans'
import _RequestLifeCycles from './src/common/props/RequestLifeCycles'
import _RequestMethods from './src/common/props/RequestMethods'
export { IKeyAny } from './src/common/intf/IKeyAny'
export { IKeyString } from './src/common/intf/IKeyString'
export { IBaseAppConfig, IBaseAppProps, IBaseRequest, IBaseAppRoute, IBaseApiRoute } from './src/client/intf/IBase'
export { IBaseAppStores } from './src/client/intf/IGeneric'
export namespace Plugins {
  export const Prismic = PrismicPlugin
}
export namespace Client {
  export namespace Pluginsx {
    export const Base = BaseStoreClass
    export const Bucket = BucketPlugin
    export const Locale = LocalePlugin
  }
  export namespace Helpers {
    export const Agent = AgentHelper
    export const Request = RequestHelper
    export const PrismicToReact = PrismicToReactHelper
  }
  export const Bootstrap = BootstrapComponent
}
export namespace Props {
  export const Languages = _Languages
  export const PrismicSpans = _PrismicSpans
  export const RequestLifeCycles = _RequestLifeCycles
  export const RequestMethods = _RequestMethods
}
