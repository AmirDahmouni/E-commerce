import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import points from "../utils/points.png"
import { useSelector, useDispatch } from 'react-redux';
import { offlinelistProducts,onlinelistProducts,getTopProducts } from '../actions/productActions';
import Rating from '../utils/Rating';
import {Carousel} from '3d-react-carousal';
import Image from 'react-image-resizer';


function HomeScreen(props) {

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [Slides,setSlides]=useState([]);
  
  const category = props.match.params.id ? props.match.params.id : '';
  
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();

  const topProductsList=useSelector(state=>state.topProducts);
  const {loading:loadingtop,error:errorTop,products:topProducts}=topProductsList;




  
  

  useEffect(()=>{
    dispatch(getTopProducts())
    
    if(userInfo)
    dispatch(onlinelistProducts())
  },[])

  useEffect(() => {
    
    if(userInfo && category=="")
    dispatch(onlinelistProducts())
    else
    dispatch(offlinelistProducts(category))
    return () => {
      //
    };
  }, [category]);

  const submitHandler = (e) => {
   
    dispatch(offlinelistProducts(category, e.target.value, sortOrder));
  };
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
    dispatch(offlinelistProducts(category, searchKeyword, sortOrder));
  };

  
  
  
  return (
    <>
      {category && <h2>{category}</h2>}
      
      <ul className="filter">
        <li>
          <form >
            <input
              name="searchKeyword"
              onChange={submitHandler}
            />
          </form>
        </li>
        <li>
          Sort By{' '}
          <select name="sortOrder" onChange={sortHandler}>
            <option value="lowest">Lowest</option>
            <option value="highest">Highest</option>
          </select>
        </li>
      </ul>
      
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="products">
          {products.map((product) => (
            <li key={product._id}>
              <div className="product">
                <Link to={'/product/' + product._id}>
                  <img
                    className="product-image"
                    src={product.images[0]}
                    alt="product"
                  />
                </Link>
                <div className="product-name">
                  <Link to={'/product/' + product._id}>{product.name}</Link>
                </div>
                <div className="product-brand">{product.brand}</div>
                <div className="product-price">${product.price}</div>
                <div className="product-price">
                   <img src={points} height="20" width="20"/>{product.points_price}
                </div>
                <div className="product-rating">
                  <Rating
                    value={product.rating}
                    text={product.numReviews + ' reviews'}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        
      )}
      {errorTop && <p>error</p>}
      {
        !loadingtop && 
        <>
        <ul className="filter">
          <h1>10 Best selling Products</h1>
        </ul>
        <Carousel 
        slides={ topProducts.map(product=>
                <Link to={'/product/' + product._id}><Image width={500}
                height={240} src={product.images[0]}/></Link>)} 
        autoplay={true} 
        interval={4000} 
        />
        </>
      }
      
      
    </>
  );
}
export default HomeScreen;
