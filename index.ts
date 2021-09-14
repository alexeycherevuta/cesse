import BaseStoreClass from './src/client/plugins/index'
import BucketPlugin from './src/client/plugins/bucket'
import LocalePlugin from './src/client/plugins/locale'
import PrismicPlugin from './src/client/plugins/prismic'
import AgentHelper from './src/client/helpers/agent'
import RequestHelper from './src/client/helpers/request'
import * as PrismicToReactHelper from './src/client/helpers/prismicToReact'
import BootstrapComponent from './src/client/bootstrap'
import PrismicHelper from './src/common/helpers/prismic'
import _Languages from './src/common/props/Languages'
import _PrismicRichContent from './src/common/props/PrismicRichContent'
import _PrismicSpans from './src/common/props/PrismicSpans'
import _RequestLifeCycles from './src/common/props/RequestLifeCycles'
import _RequestMethods from './src/common/props/RequestMethods'
export { IKeyAny } from './src/common/intf/IKeyAny'
export { IKeyString } from './src/common/intf/IKeyString'
export { IPrismicContentType, IPrismicComponent, IPrismicSlices, IPrismicSlice, IPrismicComponentConverter, PrismicComponentConverterFunction } from './src/common/intf/IPrismicHelper'
export { IBaseAppConfig, IBaseAppProps, IBaseRequest, IBaseAppRoute, IBaseApiRoute } from './src/client/intf/IBase'
export { IBaseAppStores } from './src/client/intf/IGeneric'
export namespace Client {
  export namespace Plugins {
    export const Base = BaseStoreClass
    export const Bucket = BucketPlugin
    export const Locale = LocalePlugin
    export const Prismic = PrismicPlugin
  }
  export namespace Helpers {
    export const Agent = AgentHelper
    export const Request = RequestHelper
    export const PrismicToReact = PrismicToReactHelper
  }
  export const Bootstrap = BootstrapComponent
}
export namespace Common {
  export namespace Helpers {
    export const Prismic = PrismicHelper
  }
}
export namespace Server {
}
export namespace Props {
  export const Languages = _Languages
  export const PrismicRichContent = _PrismicRichContent
  export const PrismicSpans = _PrismicSpans
  export const RequestLifeCycles = _RequestLifeCycles
  export const RequestMethods = _RequestMethods
}
