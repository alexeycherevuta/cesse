import { observable, action } from 'mobx'
import { BaseMobxStore } from '../../../common/_base'
import { IKeyAny } from '../../../common/intf/IKeyAny'
class LocaleMobxStore extends BaseMobxStore {
  @observable translations: IKeyAny = {}
  @observable language: string
  @action public setTranslation(language: string, translation: IKeyAny): void {
    this.translations[language] = translation
  }
  @action public setLanguage(language: string): void {
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
export default LocaleMobxStore
