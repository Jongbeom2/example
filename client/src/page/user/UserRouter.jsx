import React from 'react';
import { Route, Switch } from 'react-router';
import UserMain from './UserMain';
import UserEdit from './UserEdit';
const UserRouter = () => {
  return (
    <Switch>
      <Route
        exact={true}
        path={`/:page/:userId`}
        render={() => {
          return <UserMain />;
        }}
      />
      <Route
        exact={true}
        path={`/:page/:userId/edit`}
        render={() => {
          return <UserEdit />;
        }}
      />
    </Switch>
  );
};
export default UserRouter;
