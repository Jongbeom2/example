import React from 'react';
import { Route, Switch } from 'react-router';
import RestaurantMain from './RestaurantMain';
import RestaurantDetail from './RestaurantDetail';
const RestaurantRouter = () => {
  return (
    <Switch>
      <Route
        exact={true}
        path={`/:page`}
        render={() => {
          return <RestaurantMain />;
        }}
      />
      <Route
        exact={true}
        path={`/:page/:restaurantId`}
        render={() => {
          return <RestaurantDetail />;
        }}
      />
    </Switch>
  );
};
export default RestaurantRouter;
