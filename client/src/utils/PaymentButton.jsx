import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
function PaymentButton(props) {
  
  useEffect(()=>{
   console.log(props.order)
  },[])
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [product, setproduct] = useState({
    price:parseInt(props.order.totalPrice),
    shipping:props.order.shipping,
    
  });
  const [Token, setToken] = useState({
    id:userInfo._id,
    email:userInfo.email
  });
  
 
  const makePayment=async()=>{
    
    const body={product,token:Token};
    try{
      const {data} = await axios.post("/api/payment",body)
      const paymentResult={
        payerID:Token.id ,
        orderID: props.order._id,
        paymentID: data.id
      }
      props.pay(paymentResult)
      return data
    }
    catch(error)
    {
      console.log("response",error.response,"status",error.response.status)
    }
  }
    return <StripeCheckout 
    currency="USD"
    amount={product.price*100}
    name="Stripe"
    token={makePayment}
    stripeKey="pk_test_51J5pbGAJx5tuHbI4hJuzouvJy87Ok9Enu1rks5ETwJevsdZimG30PtiJ2iQyjpBu5LGwkkvxjG5LuXZFTRuoIAGI00dF6LJrAu" >
      <button type="button" className="button primary">Pay with Card </button>

      </StripeCheckout>



  }

export default PaymentButton;
