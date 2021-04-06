import axios, { AxiosResponse } from 'axios'
import MockAdapter from 'axios-mock-adapter'
import to from 'await-to-js'
import { Props, Client } from '../../..'
import { IBaseApiRoute } from '../../..'
const AgentHelper = Client.Helpers.Agent
const request = Client.Helpers.Request
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
describe('Helper: Request', () => {
  const mockAxios = new MockAdapter(axios)
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
