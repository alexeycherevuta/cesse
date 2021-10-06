import _Languages from '../plugins/locale/props/Languages'
import LocalePlugin from '../plugins/locale/modules/mobx'
import PrismicPlugin from '../plugins/prismic/modules/mobx'
export namespace CorePlugins {
  export const Locale = LocalePlugin
  export const Prismic = PrismicPlugin
}
export namespace CoreProps {
  export const Languages = _Languages
}
