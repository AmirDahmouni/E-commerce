import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactDOM from 'react-dom';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
function PaymentButton(props) {
  

  /*const addPaypalSdk = async () => {
    const result = await axios.get("/api/config/paypal");
    const clientID = result.data;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypal.com/sdk/js?client-id=' + clientID;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    }
    document.body.appendChild(script);
  }*/

  /*const createOrder = (data, actions) => actions.order.create({
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: props.amount
        }
      }
    ]
  });*/

  /*const onApprove = (data, actions) => actions.order
    .capture()
    .then(details => props.onSuccess(data, details))
    .catch(err => console.log(err));*/

  /*useEffect(() => {
    if (!window.paypal) {
      addPaypalSdk();
    }
    return () => {
      //
    };
  }, []);*/

  /*if (!sdkReady) {
    return <div>Loading...</div>
  }*/

  /*const Button = window.paypal.Buttons.driver('react', { React, ReactDOM });

  return <Button {...props} createOrder={(data, actions) => createOrder(data, actions)}
    onApprove={(data, actions) => onApprove(data, actions)} />*/
  useEffect(()=>{
   console.log(props.order)
  },[])
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [product, setproduct] = useState({
    price:props.order.totalPrice*100,
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
      console.log(data)
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
    amount={product.price}
    name="Stripe"
    token={makePayment}
    stripeKey="pk_test_51J5pbGAJx5tuHbI4hJuzouvJy87Ok9Enu1rks5ETwJevsdZimG30PtiJ2iQyjpBu5LGwkkvxjG5LuXZFTRuoIAGI00dF6LJrAu" >
      <button type="button" className="button primary">Pay with Card </button>

      </StripeCheckout>



  }

export default PaymentButton;