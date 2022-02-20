import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder,payOrderByPoints,payShipping} from '../actions/orderActions';
import PaymentButton from '../utils/PaymentButton';
import points from "../utils/points.png"
import {USER_DECREMENT_POINTS} from "../constants/userConstants"
import {ORDER_PAY_RESET} from "../constants/orderConstants"
import {resetCart} from "../actions/cartActions";
import {USER_INCREMENT_POINTS} from "../constants/userConstants"

function OrderScreen(props) {

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderDetails = useSelector(state => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay, error: errorPay } = orderPay;
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (successPay) {
      dispatch({type:ORDER_PAY_RESET})
      props.history.push("/profile");
    } else {
      dispatch(detailsOrder(props.match.params.id));
      
    }
    return () => {
    };
  }, [successPay]);

  const handleSuccessPayment = (paymentResult) => {
    
    if(order.payment.paymentMethod=="card")
    {
      const points=Math.round(order.orderItems.reduce((a, c) => a + Number(c.price*c.qty), 0)*27/100)
      console.log(points)
      dispatch({type:USER_INCREMENT_POINTS,payload:points})
      dispatch(payOrder(order, paymentResult))
    }
    else if(order.payment.paymentMethod=="points")
    {  
      const pointsProducts=order.orderItems.reduce((a, c) => a + Number(c.points_price * c.qty), 0)
      dispatch({type:USER_DECREMENT_POINTS,payload:pointsProducts})
      dispatch(payShipping(order,{...paymentResult,pointsProducts}))
    }
    dispatch(resetCart())
  }

  const handlePayment=()=>{
    const points=order.orderItems.reduce((a, c) => a + Number(c.points_price * c.qty), 0)
    const paymentResult={
        payerID:userInfo._id ,
        orderID: order._id,
        paymentID: userInfo._id+"-"+userInfo.points,
        points
    }
    dispatch(payOrderByPoints(order,paymentResult))
    dispatch({type:USER_DECREMENT_POINTS,payload:points})
    dispatch(resetCart())
  }

 

  

  return loading ? <div>Loading ...</div> : error ? <div>{error}</div> :

    <div>
      <div className="placeorder">
        <div className="placeorder-info">
          <div>
            <h3>
              Shipping
          </h3>
            <div>
              {order.shipping.address}, {order.shipping.city},
          {order.shipping.postalCode}, {order.shipping.country},
          </div>
            <div>
              {order.isDelivered ? "Delivered at " + order.deliveredAt : "Not Delivered."}
            </div>
          </div>
          <div>
            <h3>Payment</h3>
            <div>
              Payment Method: {order.payment.paymentMethod}
            </div>
            <div>
              {order.isPaid ? "Paid at " + order.paidAt : "Not Paid."}
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
                order.orderItems.length === 0 ?
                  <div>
                    Cart is empty
          </div>
                  :
                  order.orderItems.map(item =>
                    <li key={item._id}>
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
            <li className="placeorder-actions-payment">
              {loadingPay && <div>Finishing Payment...</div>}
              {errorPay && <div>error Payment !</div>}
              {!order.isPaid && order.payment.paymentMethod=="card" && order.totalPrice<=999999.99 &&
                <PaymentButton  
                  order={order}
                  pay={handleSuccessPayment}
                  />
              }
              {
                !order.isPaid && order.payment.paymentMethod=="points" && order.shippingPrice==0 &&
                <button className="button primary full-width" onClick={handlePayment}>PAY</button>
              }
              {
                !order.isPaid && order.payment.paymentMethod=="card" && order.totalPrice>999999.99 &&
                <button className="button primary full-width" >Amount more than $999,999.99 </button>
              }
              {
                !order.isPaid && order.payment.paymentMethod=="points" && order.shippingPrice!=0 &&
                <PaymentButton pay={handleSuccessPayment}
                  order={order}
                   />
              }
            </li>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>${order.itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>${order.shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>${order.taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>${order.totalPrice}</div>
            </li>
          </ul>



        </div>

      </div>
    </div>

}

export default OrderScreen;