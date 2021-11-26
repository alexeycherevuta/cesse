import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Route, Switch, Redirect, HashRouter, BrowserRouter } from 'react-router-dom'
import { IBaseWebAppRoute } from './intf/IBaseWebAppRoute'
import { IBaseWebAppProps } from './intf/IBaseWebAppProps'
interface IBootstrapProps {
  router: 'browser' | 'hash'
  appProps: IBaseWebAppProps 
  routes: IBaseWebAppRoute[]
}
class Bootstrap extends React.Component<IBootstrapProps, {}> {
  public constructor(props: IBootstrapProps) {
    super(props)
  }
  public render(): JSX.Element {
    const { routes } = this.props
    const components = (
      <Switch>
        {routes.map((route: IBaseWebAppRoute, index: number) => this.renderRoute(route, index))}
      </Switch>
    )
    return this.props.router === 'browser'
      ? <BrowserRouter>{components}</BrowserRouter>
      : <HashRouter>{components}</HashRouter>
  }
  private renderRoute = (route: IBaseWebAppRoute, index: number): JSX.Element => {
    if (route.redirectTo) {
      return (
        <Redirect
          from={route.uri}
          to={route.redirectTo}
        />
      )
    }
    const appProps: any = { 
      ...this.props.appProps,
      route: {...route}
    }
    const Container = route.container
    const Component = route.component
    const Layout = route.layout
    let FinalComponent: any
    if (Container && Layout) {
      FinalComponent = (
        <Container {...appProps}>
          <Layout>
            <Component />
          </Layout>
        </Container>
      )
    } else if (Container && !Layout) {
      FinalComponent = (
        <Layout {...appProps}>
          <Component />
        </Layout>
      )
    } else if (!Container && Layout) {
      FinalComponent = (
        <Container {...appProps}>
          <Component />
        </Container>
      )
    } else {
      FinalComponent = (
        <Component {...appProps} />
      )
    }
    const routeProps: any = {
      key: `r_${index}`,
      component: () => FinalComponent
    }
    if (route.uri) {
      routeProps.path = route.uri
    }
    if (route.exact) {
      routeProps.exact = route.exact
    }
    return <Route {...routeProps} />
  }
}
export default Bootstrap as React.ComponentType<any>
