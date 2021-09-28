import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';

import { useSelector,useDispatch } from 'react-redux';
import Header from "./utils/Header";
import ProtectedRoute from "./utils/ProtectedRoute"
import HomeScreen from './components/HomeScreen';
import ProductScreen from './components/ProductScreen';
import CartScreen from './components/CartScreen';
import SigninScreen from './components/SigninScreen';
import RegisterScreen from './components/RegisterScreen';
import ProductsScreen from './components/ProductsScreen';
import ShippingScreen from './components/ShippingScreen';
import PaymentScreen from './components/PaymentScreen';
import PlaceOrderScreen from './components/PlaceOrderScreen';
import OrderScreen from './components/OrderScreen';
import ProfileScreen from './components/ProfileScreen';
import OrdersScreen from './components/OrdersScreen';
import listCategories from "./actions/categoryActions"
function App() {
 

  const dispatch = useDispatch();
 
 
  const categories=useSelector((state)=>state.categories)
  const {loading,categories:categoriesList}=categories

  
  const closeMenu = () => {
    document.querySelector('.sidebar').classList.remove('open');
  };

  useEffect(() => {
    dispatch(listCategories());
    
    return () => {
      //
    };
  }, []);
  
  return (
    <BrowserRouter>
      <div className="grid-container">
        <Header/>
        <aside className="sidebar">
          <h3>Shopping Categories</h3>
          <button className="sidebar-close-button" onClick={closeMenu}>
            x
          </button>
          <ul className="categories">
          {(categoriesList) && (
            categoriesList.map(category=>
              <li><Link to={`/category/${category}`}>{category}</Link></li>
             )
          )}
          </ul>
        </aside>
        <main className="main">
          <div className="content">
            <ProtectedRoute path="/orders" component={OrdersScreen} />
            <ProtectedRoute path="/profile" component={ProfileScreen} />
            <ProtectedRoute path="/order/:id" component={OrderScreen} />
            <ProtectedRoute path="/products" component={ProductsScreen} />
            <ProtectedRoute path="/shipping" component={ShippingScreen} />
            <ProtectedRoute path="/payment" component={PaymentScreen} />
            <ProtectedRoute path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/category/:id" component={HomeScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
          </div>
        </main>
        <footer className="footer">E-commerce 2020-2021</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
