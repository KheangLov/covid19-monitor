import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Main from './components/Main'
import Signup from './components/Signup'
import ScrollToTop from './components/ScrollTop'
import Cards from './components/Cards'

export default props => (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/data-list' component={ Cards } />
          <Route exact path='/auth' component={ Signup } />          
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )