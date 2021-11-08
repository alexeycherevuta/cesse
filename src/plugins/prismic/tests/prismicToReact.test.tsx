import * as React from 'react'
import { mount, shallow } from 'enzyme'
import PrismicComponents from '../props/PrismicComponents'
import PrismicParser from '../modules/parser'
import { prismicQueryResponse } from '../factory'
import { PrismicComponent, HtmlTextComponent, ImageComponent, TextComponent, HyperlinkComponent } from '../modules/react'
import { IPrismicComponent } from '../intf/IPrismicComponent'
import { IPrismicHyperlinkComponentBody } from '../intf/IPrismicComponentBody'
const debug = (e: any) => {
  console.log(e.debug())
}
describe('Plugin: Prismic → React components', () => {
  const prismic = new PrismicParser({ prismicQueryResponse: prismicQueryResponse() })
  prismic.parse()
  it('render PrismicComponent returning `HtmlTextComponent`', () => {
    const wrapper = mount(<PrismicComponent component={prismic.getComponentFromLayout('spa_master', 'website_name')} />)
    expect(wrapper.find('h1').length).toBe(1)
    expect(wrapper.find('h1').text()).toEqual('Accelerate Tutors')
  })
  it('render HtmlTextComponent`', () => {
    const comp = prismic.getComponentFromLayout('spa_master', 'website_name') as IPrismicComponent
    expect(comp).toBeDefined()
    const item = shallow(<HtmlTextComponent component={comp} />)
    expect(item.find('h1').length).toBe(1)
    expect(item.find('h1').render().text()).toEqual('Accelerate Tutors')
  })
  it('render `ImageComponent`', () => {
    const comp = prismic.getComponentFromSlice('spa_master', 'header', 'header_logo') as IPrismicComponent
    expect(comp).toBeDefined()
    const item = shallow(<ImageComponent component={comp} />)
    expect(item.length).toEqual(1)
    expect(item.prop('src')).toEqual('https:
    expect(item.prop('className')).toEqual('prismic--image')
  })
  it('render `TextComponent`', () => {
    const list = prismic.getSlice('spa_master', 'body_section_1')
    expect(list).not.toBeNull()
    if (list) { 
      const component = list.repeatable[0].find((item: IPrismicComponent) => item.component == PrismicComponents.TextComponent)
      expect(component).toBeDefined()
      if (component) { 
        const item = shallow(<TextComponent component={component} />)
        expect(item.find('span').length).toBe(1)
        expect(item.prop('className')).toEqual('prismic--text')
        expect(item.find('span').text()).toEqual('Our fully qualified, talented teachers are offering online tuition; including 1:1 or 1:few group sessions covering all aspects of the curriculum, age groups and abilities from early years to A Level and SEN.')
      }
    }
  })
  it('render `HyperlinkComponent` with page id reference (#)', () => {
    const list = prismic.getSlice('spa_master', 'section_2')
    expect(list).not.toBeNull()
    if (list) { 
      const component = list.repeatable[0].find((item: IPrismicComponent) => item.component == PrismicComponents.HyperlinkComponent)
      expect(component).toBeDefined()
      if (component) { 
        const a = shallow(<HyperlinkComponent component={component} caption="click here" />).find('a')
        expect(a.length).toBe(1)
        expect(a.prop('className')).toEqual('prismic--link')
        expect(a.text()).toEqual('click here')
        expect(a.prop('target')).toEqual('')
        expect(a.prop('href')).toEqual('#')
      }
    }
  })
  it('render `HyperlinkComponent` with external URL', () => {
    const list = prismic.getSlice('spa_master', 'section_2')
    expect(list).not.toBeNull()
    if (list) { 
      let component = list.repeatable[0].find((item: IPrismicComponent) => item.component == PrismicComponents.HyperlinkComponent)
      expect(component).toBeDefined()
      if (component) { 
        expect(component.body).toBeDefined()
        const body = component.body as IPrismicHyperlinkComponentBody
        body.href = 'http:
        component.body = body
        const a = shallow(<HyperlinkComponent component={component} caption="click there"/>).find('a')
        expect(a.length).toBe(1)
        expect(a.prop('className')).toEqual('prismic--link')
        expect(a.text()).toEqual('click there')
        expect(a.prop('target')).toEqual('_blank')
        expect(a.prop('href')).toEqual('http:
      }
    }
  })
  it('render null component', () => {
    const unknownComp: IPrismicComponent = {
      label: 'something',
      component: null,
      body: null,
      slice: null,
      firstOfKind: true,
      lastOfKind: true
    }
    const item = shallow(<PrismicComponent component={unknownComp} />)
    expect(item.find('div').length).toEqual(1)
    expect(item.text()).toEqual('Error: component is `null`')
  })
  it('render not recognised component', () => {
    const otherComp: IPrismicComponent = {
      label: 'something',
      component: 'SphereComponentIWishedItExisted',
      body: {
        sphere: 'glazed',
        radius: 100
      },
      slice: null,
      firstOfKind: true,
      lastOfKind: true
    }
    const item = shallow(<PrismicComponent component={otherComp} />)
    expect(item.find('div').length).toEqual(1)
    expect(item.text()).toEqual('Error: component not recognised')
  })
  it('resolve multiple spans of the same type', () => {
    const wrapper = mount(<PrismicComponent component={prismic.getComponentFromSlice('spa_master', 'masthead', 'masthead_title')} />)
    expect(wrapper.html()).toEqual('<h2><span>Masthead <strong>title</strong> is <strong>great</strong> and will be improved</span></h2>')
  })
  describe('render `RichComponent`', () => {
    const wrapper = mount(<PrismicComponent component={prismic.getComponentFromSlice('spa_master', 'masthead', 'rich_example')} />)
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
    it('resolve `italic` span', () => {
      expect(rich.find('em').length).toEqual(1)
    })
    it('resolve `hyperlink` span', () => {
      expect(rich.find('a').length).toEqual(3)
      const a = rich.find('a')['0']
      expect(JSON.stringify(a.attribs)).toEqual('{\"class\":\"prismic--link\",\"href\":\"https:
    })
    it('resolve `strong` span', () => {
      expect(rich.find('strong').length).toEqual(3)
    })
  })
})
