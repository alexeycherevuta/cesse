import axios, { AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import to from 'await-to-js'
import { Props, Client } from '../../..'
import { IBaseApiRoute } from '../../..'
const AgentHelper = Client.Helpers.Agent.default
const request = Client.Helpers.Agent.request
const RequestMethods = Props.RequestMethods
const RequestLifeCycles = Props.RequestLifeCycles
interface IMockedResponses {
  [slug: string]: AxiosResponse
}
const routes: IBaseApiRoute[] = [
  {
    slug: 'getName',
    description: 'Getting user name',
    url: '/api/name',
    method: RequestMethods.GET,
    auth: false
  },
  {
    slug: 'getSurname',
    description: 'Getting surname',
    url: '/api/surname',
    method: RequestMethods.POST,
    auth: false
  },
  {
    slug: 'getPassword',
    description: 'Getting password',
    url: '/api/password',
    method: RequestMethods.POST,
    auth: true
  },
  {
    slug: 'getExternalResource',
    description: 'Example of external path',
    url: 'http:
    method: RequestMethods.POST,
    auth: false
  }
]
const mockResponses: IMockedResponses = {
  exampleSuccess: {
    status: 200,
    statusText: 'success',
    config: {},
    headers: {},
    data: {}
  },
  successWithAuthorisation: {
    status: 200,
    statusText: 'success',
    config: {},
    headers: {
      'Bearer': 'xxx'
    },
    data: {}
  },
  successWithPayload: {
    status: 200,
    statusText: 'success',
    config: {},
    headers: {
      'x-example': '123'
    },
    data: {
      john: 'doe'
    }
  },
  error: {
    status: 500,
    statusText: 'error',
    config: {},
    headers: {},
    data: {
      john: 'doe'
    }
  },
  errorWithMessage: {
    status: 401,
    statusText: 'error',
    config: {},
    headers: {},
    data: {
      message: 'payload-incorrect'
    }
  }
}
describe('Plugin: Agent', () => {
  const mockAxios = new MockAdapter(axios)
  it('initialises a plugin instance', () => {
    expect(() => new AgentHelper(routes, {})).not.toThrow(Error)
  })
  describe('make request', () => {
    const agent = new AgentHelper(routes, {})
    it('make successful request to a GET route', async () => {
      mockAxios.onGet(routes[0].url).reply(200, mockResponses.success)
      const [err, res] = await to(agent.make('getName'))
      expect(res).toHaveProperty('status')
      expect(res?.status).toEqual(200)
      expect(err).toBeNull()
    })
    it('make successful request to a POST route', async () => {
      mockAxios.onPost(routes[1].url).reply(200, mockResponses.success)
      const [err, res] = await to(agent.make(routes[1].slug))
      expect(res).toHaveProperty('status')
      expect(res?.status).toEqual(200)
      expect(err).toBeNull()
    })
    it('throws an error if you do not provide a token to a route that requires authentication', async () => {
      mockAxios.onPost(routes[1].url).reply(200, mockResponses.successWithAuthorisation)
      const [err, res] = await to(agent.make('getPassword'))
      expect(err).toHaveProperty('message')
      expect(err?.message).toContain('Token not found but the route')
      expect(res).not.toBeDefined()
    })
    it('make successful request to a POST route that requires authentication with token', async () => {
      mockAxios.onPost(routes[2].url).reply(200, mockResponses.successWithAuthorisation)
      const [err, res] = await to(agent.make(routes[2].slug, { token: 'abc123' }))
      expect(res).toHaveProperty('config')
      expect(res?.config).toHaveProperty('headers')
      expect(JSON.stringify(res?.config.headers)).toContain('\"Authorization\":\"Bearer abc123\"')
    })
    it('successfully passes the payload in the request', async () => {
      const payload = {
        hello: 'world',
        page: 'index'
      }
      mockAxios.onPost(routes[1].url).reply(200, mockResponses.exampleSuccess)
      const [err, res] = await to(agent.make(routes[1].slug, { data: payload }))
      expect(res).toHaveProperty('config')
      expect(res?.config.data).toEqual(JSON.stringify(payload))
    })
    it('throws 404 error if route slug is not found (not provided in routes)', async () => {
      const [err, res] = await to(agent.make('getNonExisting'))
      expect(err).toHaveProperty('message')
      expect(err?.message).toEqual('Route not found!')
    })
    it('displays custom error message returned by an endpoint', async () => {
      mockAxios.onGet(routes[0].url).reply(200, mockResponses.errorWithMessage)
      const [err, res] = await to(agent.make(routes[0].slug))
      expect(res).toHaveProperty('data')
      expect(res?.data.data.message).toEqual(mockResponses.errorWithMessage.data.message)
    })
  })
  it('removes baseURL if the url contains external protocol', async () => {
    const agent = new AgentHelper(routes, {
      baseURL: 'http:
    })
    mockAxios.onPost(routes[3].url).reply(200, mockResponses.exampleSuccess)
    const [err, res] = await to(agent.make('getExternalResource'))
    expect(res).toHaveProperty('config')
    expect(res?.config).toHaveProperty('url')
    expect(res?.config.baseURL).toEqual('')
    expect(res?.config.url).toEqual(routes[3].url)
  })
  it('adds a baseURL if the route contains an uri', async () => {
    const baseURL = 'http:
    const agent = new AgentHelper(routes, {
      baseURL
    })
    mockAxios.onGet(routes[0].url).reply(200, mockResponses.exampleSuccess)
    const [err, res] = await to(agent.make(routes[0].slug))
    expect(res).toHaveProperty('config')
    expect(res?.config).toHaveProperty('baseURL')
    expect(res?.config.baseURL).toEqual(baseURL)
  })
  describe('Agent Request', () => {
    it('set an idle request', () => {
      const req = request(RequestLifeCycles.idle)
      expect(req.lifeCycle).toEqual(RequestLifeCycles.idle)
      expect(req.data).toEqual({})
      expect(req.status).toBeNull()
      expect(req.statusText).toBeNull()
      expect(req.headers).toBeNull()
    })
    it('set a triggered request', () => {
      const req = request(RequestLifeCycles.triggered)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.triggered,
        status: null,
        statusText: null,
        headers: null,
        data: {}
      })
    })
    it('set a completed request (success)', async () => {
      const agent = new AgentHelper(routes, {})
      const response = mockResponses.successWithPayload
      mockAxios.onGet(routes[0].url).reply(200, response)
      const [err, res] = await to(agent.make(routes[0].slug))
      expect(res).toHaveProperty('status')
      expect(res?.status).toEqual(200)
      const req = request(RequestLifeCycles.completed, res)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.completed,
        status: 200,
        statusText: 'success',
        headers: response.headers,
        data: response.data
      })
    })
    it('set a completed request (error from the api)', async () => {
      const agent = new AgentHelper(routes, {})
      const response = mockResponses.error
      mockAxios.onGet(routes[0].url).reply(200, response)
      const [err, res] = await to(agent.make(routes[0].slug))
      expect(res).toHaveProperty('status')
      expect(res?.status).toEqual(200) 
      const req = request(RequestLifeCycles.completed, res)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.completed,
        status: 500,
        statusText: 'error',
        headers: response.headers,
        data: response.data
      })
    })
    it('set a completed request (error from the network)', async () => {
      let error
      const agent = new AgentHelper(routes, {})
      mockAxios.onGet(routes[0].url).networkError()
      try {
        await agent.make(routes[0].slug)
      } catch (e) {
        error = e
      }
      const req = request(RequestLifeCycles.completed, error)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.completed,
        status: 500,
        statusText: 'error',
        message: 'axios-error',
        headers: null,
        data: {
          message: 'Network Error'
        }
      })
    })
    it('set a completed request, error with custom message', async () => {
      const agent = new AgentHelper(routes, {})
      const response = mockResponses.errorWithMessage
      mockAxios.onGet(routes[0].url).reply(200, response)
      const [err, res] = await to(agent.make(routes[0].slug))
      expect(res).toHaveProperty('status')
      expect(res?.status).toEqual(200)
      const req = request(RequestLifeCycles.completed, res)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.completed,
        status: 401,
        statusText: 'error',
        headers: response.headers,
        message: 'payload-incorrect',
        data: response.data
      })
    })
    it('set a processed request', () => {
      const req = request(RequestLifeCycles.processed)
      expect(req).toEqual({
        lifeCycle: RequestLifeCycles.processed,
        status: null,
        statusText: null,
        headers: null,
        data: {}
      })
    })
  })
})
