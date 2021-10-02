import _Languages from '../common/props/Languages'
import LocalePlugin from './plugins/locale'
import PrismicPlugin from '../plugins/prismic/modules/mobx'
export namespace CorePlugins {
  export const Locale = LocalePlugin
  export const Prismic = PrismicPlugin
}
export namespace CoreProps {
  export const Languages = _Languages
}
