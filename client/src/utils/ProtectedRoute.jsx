import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from 'react-redux';

function ProtectedRoute({ component: Component, ...restOfProps }) {

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        {
            
            if((props.location.pathname=="/products" || props.location.pathname=="/orders") 
                && !userInfo.isAdmin) return <Redirect to="/signin" />
            else if(userInfo) return <Component {...props} />
            else return <Redirect to="/signin" />
        }
        
      }
    />
  );
}

export default ProtectedRoute;