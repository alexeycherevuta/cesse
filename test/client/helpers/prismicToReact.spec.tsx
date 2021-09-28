import * as React from 'react'
import { mount } from 'enzyme'
import { Common } from '../../..'
import { PrismicComponent } from '../../../src/client/helpers/prismicToReact'
import { prismicQueryResponse } from '../../support/prismicFactory'
const d = (e: any) => {
  console.log(e.debug())
}
describe('prismicToReact helper', () => {
  const prismic = new Common.Helpers.Prismic({ prismicQueryResponse: prismicQueryResponse() })
  prismic.parse()
  it('render `htmlTextComponent` as h1', () => {
    const wrapper = mount(<PrismicComponent component={prismic.getComponentFromSliceLayout('spa_master', 'website_name')} />)
    expect(wrapper.find('h1').length).toBe(1)
    expect(wrapper.find('h1').text()).toEqual('Accelerate Tutors')
  })
  describe('render `richComponent`', () => {
    const wrapper = mount(<PrismicComponent component={prismic.getComponentFromSlice('spa_master', 'masthead', 'rich_example')} />)
    d(wrapper)
    const rich = wrapper.find('.prismic--rich').render()
    it('check if element has rendered', () => {
      expect(rich.length).toEqual(1)
    })
    it('check if ordered list is rendered correctly', () => {
      expect(rich.find('ol').length).toEqual(1)
      expect(rich.find('ol').children().length).toEqual(3)
    })
    it('check if unordered list is rendered correctly', () => {
      expect(rich.find('ul').length).toEqual(1)
      expect(rich.find('ol').children().length).toEqual(3)
    })
    it('check if image is rendered correctly', () => {
      const img = rich.find('img')
      expect(img.length).toEqual(1)
      expect(img.prop('src')).toEqual('https:
    })
  })
})
