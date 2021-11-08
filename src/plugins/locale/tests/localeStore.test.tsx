import * as React from 'react'
import { Provider, inject, observer } from 'mobx-react'
import LocaleMobx from '../modules/mobx'
import { mount } from 'enzyme'
import Languages from '../props/Languages'
import { IKeyAny } from '../../../common/intf/IKeyAny'
const lang1: IKeyAny = {
  foo: 'text',
  bar: 'sample',
  nested: {
    example: 'great'
  }
}
const lang2: IKeyAny = {
  foo: 'other',
  bar: 'test'
}
const locale = new LocaleMobx()
locale.setTranslation(Languages.english, lang1)
locale.setTranslation(Languages.polish, lang2)
locale.setLanguage(Languages.english)
const Container = (props: any): JSX.Element => {
  const store = { locale }
  return <Provider {...store}>{props.children}</Provider>
}
@inject('locale')
@observer
class RenderTranslation extends React.Component<any, {}> {
  public render(): JSX.Element {
    const l = this.props.locale as LocaleMobx
    return <div>{l.text('bar')}</div>
  }
}
@inject('locale')
@observer
class SwitchTranslation extends React.Component<any, {}> {
  public componentDidMount(): void {
    this.props.locale.setLanguage(Languages.polish)
  }
  public render(): JSX.Element {
    const l = this.props.locale as LocaleMobx
    return <div>{l.text('bar')}</div>
  }
}
describe('Plugin: Locale → React component', () => {
  it('returns a correctly translated text based on a language set', () => {
    const comp = mount(<Container><RenderTranslation /></Container>)
    expect(comp.find('div').text()).toEqual(lang1.bar)
  })
  it('returns a correctly translated text based on a language set', () => {
    const comp = mount(<Container><SwitchTranslation /></Container>)
    expect(comp.find('div').text()).toEqual(lang2.bar)
  })
})
