import * as _ from 'lodash'
import * as f from './functions'
import PrismicComponents from '../props/PrismicComponents'
import { IPrismicComponentParser } from '../intf/IPrismicParser'
import { IPrismicContentType, IPrismicSlice, IPrismicComponent, IPrismicSlices } from '../intf/IPrismicComponent'
import { IKeyAny } from '../../../common/intf/IKeyAny'
import { IKeyArray } from '../../../common/intf/IKeyArray'
import { IPrismicRichComponentBody } from '../intf/IPrismicComponentBody'
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
interface IPrismicParser {
  defineLayoutNamesPatterns(names: string[]): void
  defineComponentParsers(converters: IPrismicComponentParser[]): void
  getContentType(name: string): IPrismicContentType[] | null
  getSlice(layout: string, slice: string): IPrismicSlice | null
  getComponentFromLayout(layout: string, label: string): IPrismicComponent | undefined
  getComponentFromSlice(layout: string, slice: string, label: string): IPrismicComponent | undefined
  parse(): void
}
interface IKeyPrismicContentType {
  [contentTypeName: string]: IPrismicContentType[]
}
interface IPrismicPluginConstructor {
  prismicQueryResponse: any
}
interface IPrismicIdentifyComponent {
  component: string | null
  body: IKeyAny | null
}
export default class PrismicParser implements IPrismicParser {
  private layouts: string[] = ['master', 'layout']
  private converters: IPrismicComponentParser[] = [
    {
      component: PrismicComponents.HtmlTextComponent,
      convert: f.parseHtmlTextComponent
    },
    {
      component: PrismicComponents.TextComponent,
      convert: f.parseTextComponent
    },
    {
      component: PrismicComponents.ImageComponent,
      convert: f.parseImageComponent
    },
    {
      component: PrismicComponents.HyperlinkComponent,
      convert: f.parseHyperlinkComponent
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
  public defineComponentParsers(converters: IPrismicComponentParser[]): void {
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
  public getComponentFromLayout(layout: string, label: string): IPrismicComponent | undefined {
    const l = this.getContentType(layout)
    if (l) {
      return l[0].components.find((component: IPrismicComponent) => component.label === label)
    }
    return undefined
  }
  public getComponentFromSlice(layout: string, slice: string, label: string): IPrismicComponent | undefined {
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
      if (data.hasOwnProperty(label) && Array.isArray(data[label]) && data[label].length > 0) {
        _components.push(this.convertRawDataToComponent(label, data[label][0]))
      }
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
  private convertElementToComponent = (arr: IPrismicComponent[], data: IKeyAny | IKeyAny[], sliceName: string, label: string) => {
    if (!Array.isArray(data)) {
      arr.push(this.convertRawDataToComponent(label, data, sliceName))
    } else if (Array.isArray(data) && data.length === 1) {
      arr.push(this.convertRawDataToComponent(label, data[0], sliceName))
    } else {
      const subComponents: IPrismicRichComponentBody = []
      data.forEach((item: IKeyAny, index: number) => {
        const _label = `${label}_${index}`
        const current = this.identifyComponent(_label, item)
        subComponents.push({
          label: _label,
          slice: sliceName,
          firstOfKind: this.isFirstOfKind(current, index, data),
          lastOfKind: this.isLastOfKind(current, index, data),
          ...current
        })
      })
      arr.push({
        label,
        slice: sliceName,
        component: PrismicComponents.RichComponent,
        firstOfKind: true,
        lastOfKind: true,
        body: subComponents
      })
    }
  }
  private convertRawDataToComponent = (label: string, raw: IKeyAny, slice?: string): IPrismicComponent => {
    return {
      label,
      slice: slice || null,
      firstOfKind: true,
      lastOfKind: true,
      ...this.identifyComponent(label, raw)
    }
  }
  private identifyComponent = (label: string, raw: IKeyAny): IPrismicIdentifyComponent => {
    let component: string | null = null
    let body: IKeyAny | null = null
    this.converters.forEach((converter: IPrismicComponentParser) => {
      if (_.isNull(component)) {
        body = converter.convert(label, raw)
        if (!_.isNull(body)) {
          component = converter.component
        }
      }
    })
    return { body, component }
  }
  private isFirstOfKind = (current: IPrismicIdentifyComponent, index: number, data: IKeyAny[]): boolean => {
    let first: boolean = true
    if (current.component && current.body && index - 1 >= 0) {
      const prev = this.identifyComponent('x', data[index - 1])
      if (
        prev.component === current.component && prev.body
        && prev.body.hasOwnProperty('tag') && current.body.hasOwnProperty('tag')
        && prev.body.tag === current.body.tag
      ) { first = false }
    }
    return first
  }
  private isLastOfKind = (current: IPrismicIdentifyComponent, index: number, data: IKeyAny[]): boolean => {
    let last: boolean = true
    if (current.component && current.body && index + 1 < data.length) {
      const next = this.identifyComponent('x', data[index + 1])
      if (
        next.component === current.component && next.body
        && next.body.hasOwnProperty('tag') && current.body.hasOwnProperty('tag')
        && next.body.tag === current.body.tag
      ) { last = false }
    }
    return last
  }
}
