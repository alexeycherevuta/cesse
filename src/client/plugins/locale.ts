import { observable, action } from 'mobx'
import BaseStore from '.'
import { IKeyAny } from '../../common/intf/IKeyAny'
import Languages from '../../common/props/Languages'
class LocalePlugin extends BaseStore {
  @observable translations: IKeyAny = {}
  @observable language: Languages
  @action public setTranslation(language: Languages, translation: IKeyAny): void {
    this.translations[language] = translation
  }
  @action public setLanguage(language: Languages): void {
    if (this.translations.hasOwnProperty(language)) {
      this.language = language
    }
  }
  public text(key: string, subkey?: string): any {
    if (!this.language) {
      throw new Error('Unable to retrieve translation. Are you sure you filled the plugin with data?')
    }
    const char = '?'
    const sheet = this.translations[this.language]
    const hasKey = sheet.hasOwnProperty(key)
    if (hasKey && !subkey) {
      return sheet[key]
    }
    if (subkey && hasKey && sheet[key].hasOwnProperty(subkey)) {
      return sheet[key][subkey]
    } else if (subkey && hasKey && !sheet[key].hasOwnProperty(subkey)) {
      return char
    }
    return char
  }
}
export default LocalePlugin
