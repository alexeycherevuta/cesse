import { observable, action, toJS } from 'mobx'
import { computedFn } from 'mobx-utils'
const Prismic = require('prismic-javascript')
import { BaseStore } from '.'
import RequestLifeCycles from '../../common/props/RequestLifeCycles'
import PrismicProjectSchemas from '../../common/props/PrismicProjectSchemas'
import { IKeyAny } from '../../common/intf/IKeyAny'
interface IPrismicPluginConstructor {
  url: string
  token: string
}
interface IPrismicPluginQueryOptions {
  lang?: string
}
type getComponentFunc = (slice: string, componentId: string) => IKeyAny | undefined
export default class PrismicPlugin extends BaseStore {
  private url: string
  private token: string
  @observable lifecycle: RequestLifeCycles
  @observable version: string
  @observable _data: IKeyAny
  private queryOptions: IPrismicPluginQueryOptions = {}
  constructor({ url, token }: IPrismicPluginConstructor) {
    super()
    if (!token || !url) {
      throw new Error('Provide access details to your Prismic repository')
    }
    this.lifecycle = RequestLifeCycles.idle
    this.url = url
    this.token = token
  }
  public component: getComponentFunc = computedFn(function(this: any, slice: string, componentId: string): IKeyAny | {} {
    let component = {}
    if (this._data && this._data.hasOwnProperty(slice)) {
      component = this._data[slice].find((comp: IKeyAny) => comp.slice === componentId)
    }
    return toJS(component)
  })
  public withLanguage(lang: string): void {
    this.queryOptions.lang = lang
  }
  @action async fetch(schema: PrismicProjectSchemas): Promise<void> {
    this.lifecycle = RequestLifeCycles.triggered
    Prismic.getApi(this.url, { accessToken: this.token })
      .then((api: any) => {
        return api.query('', this.queryOptions)
      }).then((response: any) => {
        switch (schema) {
          case PrismicProjectSchemas.SinglePageApplication: {
            this._data = this.asSinglePageApplication(response.results)
            break
          }
          default: {
            this._data = response.results
            this.version = response.version
          }
          this.lifecycle = RequestLifeCycles.completed
        }
      }, (err: any) => {
        this.lifecycle = RequestLifeCycles.completed
        console.error('Prismic API error', err)
      })
  }
  private asSinglePageApplication(raw: IKeyAny[]): IKeyAny {
    let rawSlices: any[] = []
    let slices: IKeyAny = {}
    const mergePrismicComponent = (component: any): IKeyAny => {
      if (component && Array.isArray(component)) {
        return component.length > 1
          ? { items: [...component] }
          : { ...component[0] }
      } else {
        return {...component}
      }
    }
    if (!raw || !Array.isArray(raw)) {
      throw new Error('No data returned from Prismic')
    }
    try {
      rawSlices = raw[0].data.body
      rawSlices.forEach((slice: IKeyAny) => {
        const slug = slice.slice_type
        slices[slug] = []
        Object.keys(slice.primary).forEach((componentId: string) => {
          const component = slice.primary[componentId]
          slices[slug].push({
            slice: componentId,
            ...mergePrismicComponent(component)
          })
        })
      })
    } catch (e) {
      console.error(e)
      throw new Error('Incorrect Prismic payload structure')
    }
    return slices
  }
}
