import React from 'react';
import Cookie from 'js-cookie';
import { Redirect, Route } from 'react-router';
const AuthRoute = ({ children, ...rest }) => {
  const userId = Cookie.get('_id');
  return (
    <Route
      {...rest}
      render={({ location }) =>
        userId ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
export default AuthRoute;
