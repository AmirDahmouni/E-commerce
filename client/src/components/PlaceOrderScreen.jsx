import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../utils/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import points from "../utils/points.png"
import {ORDER_RESET} from "../constants/orderConstants"
import {resetCart } from "../actions/cartActions";
function PlaceOrderScreen(props) {

  const cart = useSelector(state => state.cart);
  const orderCreate = useSelector(state => state.orderCreate);
  const { loading, success, error, order } = orderCreate;

  const { cartItems, shipping, payment } = cart;
  if (!shipping.address) {
    props.history.push("/shipping");
  } else if (!payment.paymentMethod) {
    props.history.push("/payment");
  }
  
  const itemsPrice = (payment.paymentMethod!="points") ? (cartItems.reduce((a, c) => a + c.price * c.qty, 0)) : 0
  const shippingPrice = (payment.paymentMethod!="points") ? (itemsPrice > 1000 ? 0 : 10) : ((cartItems.reduce((a, c) => a + c.points_price * c.qty, 0)) > 1800 ? 0: 10)
  const taxPrice = (payment.paymentMethod!="points") ? 0.15 * itemsPrice : 0
  const totalPrice = (payment.paymentMethod!="points") ? (itemsPrice + shippingPrice + taxPrice) : shippingPrice
  
  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    // create an order
    let pay=payment.paymentMethod
     dispatch(createOrder({
      orderItems: cartItems, shipping, pay, itemsPrice, shippingPrice,
      taxPrice, totalPrice
    }));
    
  }
  useEffect(() => {
    if (success) {
      
      dispatch({type:ORDER_RESET})
      
      props.history.push("order/" + order._id);
    }

  }, [success]);

  return <div>
    <CheckoutSteps step1 step2 step3 step4 ></CheckoutSteps>
    <div className="placeorder">
      <div className="placeorder-info">
        <div>
          <h3>
            Shipping
          </h3>
          <div>
            {cart.shipping.address}, {cart.shipping.city},
          {cart.shipping.postalCode}, {cart.shipping.country},
          </div>
        </div>
        <div>
          <h3>Payment</h3>
          <div>
            Payment Method: {cart.payment.paymentMethod}
          </div>
        </div>
        <div>
          <ul className="cart-list-container">
            <li>
              <h3>
                Shopping Cart
          </h3>
              <div>
                Price
          </div>
            </li>
            {
              cartItems.length === 0 ?
                <div>
                  Cart is empty
          </div>
                :
                cartItems.map(item =>
                  <li>
                    <div className="cart-image">
                      <img src={item.images[0]} alt="product" />
                    </div>
                    <div className="cart-name">
                      <div>
                        <Link to={"/product/" + item.product}>
                          {item.name}
                        </Link>

                      </div>
                      <div>
                        Qty: {item.qty}
                      </div>
                    </div>
                    <div className="cart-price">
                      ${item.price}
                      <br/><img src={points} height="20" width="20"/>  {item.points_price}
                    </div>
                  </li>
                )
            }
          </ul>
        </div>
      </div>
      <div className="placeorder-action">
        <ul>
          <li>
            <button className="button primary full-width" onClick={placeOrderHandler} >Place Order</button>
          </li>
          <li>
            <h3>Order Summary</h3>
          </li>
          <li>
            <div>Items</div>
            <div>${itemsPrice}</div>
          </li>
          <li>
            <div>Shipping</div>
            <div>${shippingPrice}</div>
          </li>
          <li>
            <div>Tax</div>
            <div>${taxPrice}</div>
          </li>
          <li>
            <div>Order Total</div>
            {
              (payment.paymentMethod!="points") &&  <div>${totalPrice}</div>
            }
            
            {(payment.paymentMethod=="points") &&
            <>
             <div>{cartItems.reduce((a, c) => a + c.points_price * c.qty, 0)}</div>
             
             <img src={points} height="20" width="20" style={{margin:"1"}} /> 
             <div>
               + $ {shippingPrice}
             </div>
             </>
            }
          </li>
        </ul>
      </div>
    </div>
  </div>

}

export default PlaceOrderScreen;