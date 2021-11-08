const Prismic = require('prismic-javascript')
import { BaseMobxStore } from '../../../common/_base'
import { observable, action, toJS } from 'mobx'
import { computedFn } from 'mobx-utils'
import RequestLifeCycles from '../../../common/props/RequestLifeCycles'
import PrismicParser from './parser'
import { IPrismicComponentParser } from '../intf/IPrismicParser'
interface IPrismicPluginQueryOptions {
  lang?: string
}
interface IPrismicMobxConstructor {
  url: string
  token: string
  layoutNamePatterns?: string[]
  parsers?: IPrismicComponentParser[]
}
export default class PrismicMobxStore extends BaseMobxStore {
  private functions: IPrismicComponentParser[]
  private layoutNamePatterns: string[]
  private url: string
  private token: string
  @observable lifecycle: RequestLifeCycles
  @observable version: string
  @observable _parser: PrismicParser
  private queryOptions: IPrismicPluginQueryOptions = {}
  constructor({ url, token, layoutNamePatterns, parsers }: IPrismicMobxConstructor) {
    super()
    if (!token || !url) {
      throw new Error('Provide access details to your Prismic repository')
    }
    this.layoutNamePatterns = layoutNamePatterns || []
    this.functions = parsers || []
    this.lifecycle = RequestLifeCycles.idle
    this.url = url
    this.token = token
  }
  public withLanguage(lang: string): void {
    this.queryOptions.lang = lang
  }
  public prismic: () => PrismicParser = computedFn(function getPrismicHelper(this: PrismicMobxStore): PrismicParser {
    return toJS(this._parser)
  })
  @action async fetch(): Promise<void> {
    this.lifecycle = RequestLifeCycles.triggered
    Prismic.getApi(this.url, { accessToken: this.token })
      .then((api: any) => {
        return api.query('', this.queryOptions)
      }).then((response: any) => {
        const prismic = new PrismicParser({ prismicQueryResponse: response })
        if (this.layoutNamePatterns.length > 0) {
          prismic.defineLayoutNamesPatterns(this.layoutNamePatterns)
        }
        if (this.functions.length > 0) {
          prismic.defineComponentParsers(this.functions)
        }
        prismic.parse()
        this._parser = prismic
        this.version = response.version
        this.lifecycle = RequestLifeCycles.completed
      }, (err: any) => {
        this.lifecycle = RequestLifeCycles.completed
        console.error('Prismic API error', err)
      })
  }
}
