import * as React from 'react'
import { shallow, mount, render } from 'enzyme'
import { Common, Client } from '../../..'
import { PrismicComponent } from '../../../src/client/helpers/prismicToReact'
import { prismicQueryResponse } from '../../support/prismicFactory'
describe('prismicToReact helper', () => {
  const prismic = new Common.Helpers.Prismic({ prismicQueryResponse: prismicQueryResponse() })
  prismic.parse()
  const comps = prismic.getContentType('spa_master')
  if (comps) {
  }
  it('render `htmlTextComponent', () => {
    const wrapper = shallow(<PrismicComponent component={prismic.getStaticComponentFromLayout('spa_master', 'website_name')} />)
    console.log(wrapper.debug())
    expect(wrapper.find('.text')).toBeTruthy()
  })
})
