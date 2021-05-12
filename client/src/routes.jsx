import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import RoutesPageMatcher from './RoutesPageMatcher';
export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect exact={true} from='/' to='/home' />
        <Route exact={false} path='/:page' component={RoutesPageMatcher} />
      </Switch>
    </BrowserRouter>
  );
};
