import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../utils/CheckoutSteps';

function PaymentScreen(props) {

  const cart = useSelector(state => state.cart);
  const { cartItems } = cart;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo:{points} } = userSignin;
  
  const [paymentMethod, setPaymentMethod] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod }));
    props.history.push('/placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div className="form">
        <form onSubmit={submitHandler}>
          <ul className="form-container">
            <li>
              <h2>Payment</h2>
            </li>

            <li>
              <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="card"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></input>
                <label for="paymentMethod">Card</label>
              </div>
              
            </li>
           {(
            points >= cartItems.reduce((a, c) => a + Number(c.points_price * c.qty), 0)

           )&& 
            <li>
            <div>
                <input
                  type="radio"
                  name="paymentMethod"
                  id="pointsMethod"
                  value="points"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                ></input>
                <label for="pointsMethod">Points</label>
              </div>
            </li>
           }


           <li>
              <button type="submit" className="button primary">
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
export default PaymentScreen;
