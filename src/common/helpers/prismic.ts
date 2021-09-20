import * as _ from 'lodash'
import { IKeyAny } from '../intf/IKeyAny'
import { IPrismicContentType, IPrismicSlice, IPrismicComponent, IPrismicSlices, IPrismicComponentConverter } from '../intf/IPrismicHelper'
import PrismicComponents from '../props/PrismicComponents'
interface IPrismicHelper {
  defineLayoutNamesPatterns(names: string[]): void
  defineComponentConverters(converters: IPrismicComponentConverter[]): void
  getContentType(name: string): IPrismicContentType[] | null
  getSlice(layout: string, slice: string): IPrismicSlice | null
  getStaticComponentFromLayout(layout: string, label: string): IPrismicComponent | undefined
  getStaticComponentFromSlice(layout: string, slice: string, label: string): IPrismicComponent | undefined
  parse(): void
}
interface IKeyArray {
  [key: string]: IKeyAny[]
}
interface IKeyPrismicContentType {
  [contentTypeName: string]: IPrismicContentType[]
}
interface IPrismicPluginConstructor {
  prismicQueryResponse: any
}
export default class PrismicHelper implements IPrismicHelper {
  private layouts: string[] = ['master', 'layout']
  private converters: IPrismicComponentConverter[] = [
    {
      component: PrismicComponents.HtmlTextComponent,
      convert: toInlineComponent
    },
    {
      component: PrismicComponents.TextComponent,
      convert: toTextComponent
    },
    {
      component: PrismicComponents.ImageComponent,
      convert: toImageComponent
    },
    {
      component: PrismicComponents.HyperlinkComponent,
      convert: toHyperlinkComponent
    }
  ]
  private parsed: IKeyPrismicContentType
  private payload: any
  constructor({ prismicQueryResponse }: IPrismicPluginConstructor) {
    this.payload = prismicQueryResponse
  }
  public defineLayoutNamesPatterns(names: string[]): void {
    this.layouts = names
  }
  public defineComponentConverters(converters: IPrismicComponentConverter[]): void {
    this.converters = converters
  }
  public parse(): void {
    if (!isQueryResponseValid(this.payload)) {
      throw new Error('Prismic query response is invalid')
    }
    this.parsed = this.purifyContentTypes(_.groupBy(this.payload.results, 'type'))
  }
  public getContentType(name: string): IPrismicContentType[] | null {
    return this.parsed.hasOwnProperty(name)
      ? this.parsed[name]
      : null
  }
  public getSlice(layout: string, slice: string): IPrismicSlice | null {
    const ct = this.getContentType(layout)
    if (!ct || (ct && (!Array.isArray(ct) || ct.length !== 1 || !ct[0].layout))) {
      return null
    }
    return ct[0].slices.hasOwnProperty(slice)
      ? ct[0].slices[slice]
      : null
  }
  public getStaticComponentFromLayout(layout: string, label: string): IPrismicComponent | undefined {
    const l = this.getContentType(layout)
    if (l) {
      return l[0].components.find((component: IPrismicComponent) => component.label === label)
    }
    return undefined
  }
  public getStaticComponentFromSlice(layout: string, slice: string, label: string): IPrismicComponent | undefined {
    const s = this.getSlice(layout, slice)
    if (s) {
      return s.static.find((component: IPrismicComponent) => component.label === label)
    }
    return undefined
  }
  private purifyContentTypes = (contentTypes: IKeyArray): IKeyPrismicContentType => {
    const _contentTypes: IKeyPrismicContentType = {}
    Object.keys(contentTypes).forEach((key: string) => {
      _contentTypes[key] = []
      _contentTypes[key] = contentTypes[key].map((obj: IKeyAny) => {
        const layout = this.layouts.filter((l: string) => obj.type.indexOf(l) !== -1).length > 0
        const hasSlices = obj.data && obj.data.hasOwnProperty('body') && Array.isArray(obj.data.body) && obj.data.body.length > 0
        return {
          id: obj.id,
          type: obj.type,
          layout,
          last_publication: obj.last_publication_date,
          lang: obj.lang.toLowerCase(),
          slices: hasSlices ? this.convertBodyToSlices(obj.data.body) : [],
          components: this.convertDataToComponents(obj.data)
        }
      })
    })
    return _contentTypes
  }
  private convertDataToComponents = (data: IKeyArray): IPrismicComponent[] => {
    const keys = Object.keys(data)
    const slicesIndex = keys.indexOf('body')
    if (slicesIndex !== -1) {
      keys.splice(keys.indexOf('body'), 1)
    }
    const _components: IPrismicComponent[] = []
    keys.forEach((label: string) => {
      _components.push(this.convertRawDataToComponent(label, data[label][0]))
    })
    return _components
  }
  private convertBodyToSlices = (body: IKeyAny[]): any => {
    const _slices = _.groupBy(body, 'slice_type')
    const newSlices: IPrismicSlices = {}
    Object.keys(_slices).forEach((sliceName: string) => {
      const slice = _slices[sliceName][0]
      newSlices[sliceName] = {
        static: [],
        repeatable: []
      }
      Object.keys(slice.primary).forEach((label: string) => {
        let data = slice.primary[label]
        this.convertElementToComponent(newSlices[sliceName].static, data, sliceName, label)
      })
      if (!_.isEmpty(slice.items)) {
        slice.items.forEach((components: IKeyAny) => {
          const group: IPrismicComponent[] = []
          Object.keys(components).forEach((label: string) => {
            let data = components[label]
            this.convertElementToComponent(group, data, sliceName, label)
          })
          newSlices[sliceName].repeatable.push(group)
        })
      }
    })
    return newSlices
  }
  private convertElementToComponent = (arr: IPrismicComponent[], data: IKeyAny | any[], sliceName: string, label: string) => {
    if (!Array.isArray(data)) {
      arr.push(this.convertRawDataToComponent(label, data, sliceName))
    } else if (Array.isArray(data) && data.length === 1) {
      arr.push(this.convertRawDataToComponent(label, data[0], sliceName))
    } else {
      const subComponents: IPrismicComponent[] = []
      data.forEach((item: IKeyAny, index: number) => subComponents.push({
        label: `${label}_${index}`,
        slice: sliceName,
        ...this.identifyComponent(item)
      }))
      arr.push({
        label,
        slice: sliceName,
        component: PrismicComponents.ComplexComponent,
        body: subComponents
      })
    }
  }
  private convertRawDataToComponent = (label: string, raw: IKeyAny, slice?: string): IPrismicComponent => {
    return {
      label,
      slice: slice || null,
      ...this.identifyComponent(raw)
    }
  }
  private identifyComponent = (raw: IKeyAny) => {
    let component: string | null = null
    let body: IKeyAny | null = null
    this.converters.forEach((converter: IPrismicComponentConverter) => {
      if (_.isNull(component)) {
        body = converter.convert(raw)
        if (!_.isNull(body)) {
          component = converter.component
        }
      }
    })
    return { body, component }
  }
}
const isQueryResponseValid = (r: any): boolean => {
  let valid = true
  if (!r.hasOwnProperty('page') || !r.hasOwnProperty('results_per_page') || !r.hasOwnProperty('version')) {
    valid = false
  }
  if (!r.results || (r && !Array.isArray(r.results))) {
    valid = false
  }
  return valid
}
const toInlineComponent = (el: any): IKeyAny | null => {
  const nameToTag = {
    heading1: 'h1',
    heading2: 'h2',
    heading3: 'h3',
    heading4: 'h4',
    heading5: 'h5',
    heading6: 'h6',
    paragraph: 'p',
    o_list_item: 'ol',
    list_item: 'ul'
  }
  const type = el && el.type
    ? el.type.replace('-', '_')
    : undefined
  if (type && el.text && Array.isArray(el.spans) && Object.keys(nameToTag).includes(type)) {
    return {
      tag: nameToTag[type],
      spans: el.spans
    }
  }
  return null
}
const toTextComponent = (el: any): IKeyAny | null => {
  if (_.isString(el) || _.isNull(el)) {
    return {
      text: el
    }
  }
  return null
}
const toImageComponent = (el: any): IKeyAny | null => {
  if (el && el.hasOwnProperty('dimensions') && el.hasOwnProperty('alt') && el.hasOwnProperty('url')) {
    return {
      src: el.url,
      alt: el.alt || '',
      dimensions: el.dimensions,
      copyright: el.copyright || undefined
    }
  }
  return null
}
const toHyperlinkComponent = (el: any): IKeyAny | null => {
  if (el && el.hasOwnProperty('link_type') && el.hasOwnProperty('url')) {
    return {
      type: el.link_type.toLowerCase(),
      href: el.url,
      target: el.target || undefined
    }
  }
  return null
}