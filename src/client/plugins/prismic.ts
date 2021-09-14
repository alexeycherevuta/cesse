import { observable, action, toJS } from 'mobx'
import { computedFn } from 'mobx-utils'
const Prismic = require('prismic-javascript')
import BaseStore from '.'
import RequestLifeCycles from '../../common/props/RequestLifeCycles'
import { IPrismicComponentConverter } from '../../common/intf/IPrismicHelper'
import PrismicHelper from '../../common/helpers/prismic'
interface IPrismicPluginConstructor {
  url: string
  token: string
  layoutNamePatterns?: string[]
  converters?: IPrismicComponentConverter[]
}
interface IPrismicPluginQueryOptions {
  lang?: string
}
export default class PrismicPlugin extends BaseStore {
  private converters: IPrismicComponentConverter[]
  private layoutNamePatterns: string[]
  private url: string
  private token: string
  @observable lifecycle: RequestLifeCycles
  @observable version: string
  @observable _helper: PrismicHelper
  private queryOptions: IPrismicPluginQueryOptions = {}
  constructor({ url, token, layoutNamePatterns, converters }: IPrismicPluginConstructor) {
    super()
    if (!token || !url) {
      throw new Error('Provide access details to your Prismic repository')
    }
    this.layoutNamePatterns = layoutNamePatterns || []
    this.converters = converters || []
    this.lifecycle = RequestLifeCycles.idle
    this.url = url
    this.token = token
  }
  public withLanguage(lang: string): void {
    this.queryOptions.lang = lang
  }
  public prismic: () => PrismicHelper = computedFn(function getPrismicHelper(this: PrismicPlugin): PrismicHelper {
    return toJS(this._helper)
  })
  @action async fetch(): Promise<void> {
    this.lifecycle = RequestLifeCycles.triggered
    Prismic.getApi(this.url, { accessToken: this.token })
      .then((api: any) => {
        return api.query('', this.queryOptions)
      }).then((response: any) => {
        const prismic = new PrismicHelper({ prismicQueryResponse: response })
        if (this.layoutNamePatterns.length > 0) {
          prismic.defineLayoutNamesPatterns(this.layoutNamePatterns)
        }
        if (this.converters.length > 0) {
          prismic.defineComponentConverters(this.converters)
        }
        prismic.parse()
        this._helper = prismic
        this.version = response.version
        this.lifecycle = RequestLifeCycles.completed
      }, (err: any) => {
        this.lifecycle = RequestLifeCycles.completed
        console.error('Prismic API error', err)
      })
  }
}
