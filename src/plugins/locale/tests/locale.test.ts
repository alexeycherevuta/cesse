import { IKeyAny } from '../../../..'
import LocaleMobx from '../modules/mobx'
import Languages from '../props/Languages'
const dummyA: IKeyAny = {
  foo: 'text',
  bar: 'sample',
  nested: {
    example: 'great'
  }
}
const dummyB: IKeyAny = {
  foo: 'other',
  bar: 'test'
}
describe('Plugin: Locale → functionality', () => {
  it('initialises a plugin instance', () => {
    expect(() => new LocaleMobx()).not.toThrow(Error)
  })
  it('throws an error if there is no language set', () => {
    const i = new LocaleMobx()
    expect(() => i.text('foo')).toThrow(Error)
  })
  it('unable to set a language if no translation in a pool ', () => {
    const i = new LocaleMobx()
    i.setLanguage(Languages.english)
    expect(i.language).toBeUndefined()
  })
  it('sets a translation', () => {
    const i = new LocaleMobx()
    i.setTranslation(Languages.english, dummyA)
    expect(i.translations).toHaveProperty(Languages.english)
  })
  it('sets a language if translation is set', () => {
    const i = new LocaleMobx()
    i.setTranslation(Languages.english, dummyA)
    i.setLanguage(Languages.english)
    expect(i.language).toEqual(Languages.english)
  })
  it('unable to set a different language if the translation is not there', () => {
    const i = new LocaleMobx()
    i.setTranslation(Languages.english, dummyA)
    i.setLanguage(Languages.polish)
    expect(i.language).toBeUndefined()
  })
  describe('single translation dataset', () => {
    const i = new LocaleMobx()
    i.setTranslation(Languages.english, dummyA)
    i.setLanguage(Languages.english)
    it('provides a flat level translation', () => {
      expect(i.text('foo')).toEqual(dummyA.foo)
    })
    it('provides a nested translation', () => {
      expect(i.text('nested', 'example')).toEqual(dummyA.nested.example)
    })
    it('provides a `?` if translation has not been found', () => {
      expect(i.text('nonexistent')).toEqual('?')
    })
    it('provides a `?` if nested translation does not exist', () => {
      expect(i.text('something', 'wrong')).toEqual('?')
    })
    it('provides a `?` if key exists and subkey does not', () => {
      expect(i.text('nested', 'wrong')).toEqual('?')
    })
  })
  describe('multiple translations', () => {
    const i = new LocaleMobx()
    i.setTranslation(Languages.english, dummyA)
    i.setLanguage(Languages.english)
    it('adding a translation does not impact the current language set', () => {
      expect(i.text('bar')).toEqual(dummyA.bar)
      i.setTranslation(Languages.polish, dummyB)
      expect(i.text('bar')).toEqual(dummyA.bar)
    })
    it('switching a translation takes effect', () => {
      i.setLanguage(Languages.polish)
      expect(i.text('bar')).toEqual(dummyB.bar)
    })
  })
})
