import React from 'react';
import { Route, Switch } from 'react-router';
import RoomMain from './RoomMain';
import RoomDetail from './RoomDetail';
const RoomRouter = () => {
  return (
    <Switch>
      <Route
        exact={true}
        path={`/:page`}
        render={() => {
          return <RoomMain />;
        }}
      />
      <Route
        exact={true}
        path={`/:page/:roomId`}
        render={() => {
          return <RoomDetail />;
        }}
      />
    </Switch>
  );
};
export default RoomRouter;
