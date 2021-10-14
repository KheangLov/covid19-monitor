import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Main from './components/Main'
import Signup from './components/Signup'
import ScrollToTop from './components/ScrollTop'
import Cards from './components/Cards'
import PageNotFound from './components/PageNotFound';
import Dashboard from './components/Dashboard';

export default () => {  
  return (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/dashboard' component={ Dashboard } />
          <Route exact path='/data-list' component={ Cards } />
          <Route exact path='/auth' component={ Signup } />   
          <Route exact component={ PageNotFound } />       
        </Switch>
      </ScrollToTop>
    </HashRouter>
  );
}