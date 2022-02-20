
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector} from 'react-redux';
import points from "../utils/points.png"

export default function Header()
{
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    
    const openMenu = () => {
        document.querySelector('.sidebar').classList.add('open');
      };
      
    return(

   <header className="header">
          <div className="brand">
            <button onClick={openMenu}>&#9776;</button>
            <Link to="/">Shopping</Link>
          </div>
          <div className="header-links">
            
            {userInfo ? (
              <>
              
              {!userInfo.isAdmin && 
                  <React.Fragment><img src={points} height="35" width="35"/>
                                  <Link to="/cart">{userInfo.points}</Link> </React.Fragment>  }
              <Link to="/profile">{userInfo.name}</Link>
              </>
            ) : (
              <Link to="/signin">Sign In</Link>
            )}
            {userInfo && userInfo.isAdmin && (
              <div className="dropdown">
                <a href="#">Admin</a>
                <ul className="dropdown-content">
                  <li>
                    <Link to="/orders">Orders</Link>
                    <Link to="/products">Products</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>


    )
}


