import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_SAVE_REQUEST,
  PRODUCT_SAVE_SUCCESS,
  PRODUCT_SAVE_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_REVIEW_SAVE_REQUEST,
  PRODUCT_REVIEW_SAVE_FAIL,
  PRODUCT_REVIEW_SAVE_SUCCESS,
  PRODUCT_LIST_TOP_REQUEST,
  PRODUCT_LIST_TOP_SUCCESS,
  PRODUCT_LIST_TOP_FAIL
} from '../constants/productConstants';
import axios from 'axios';
import Axios from 'axios';


const getTopProducts=()=>async(dispatch,getState)=>{

  try {
    dispatch({ type: PRODUCT_LIST_TOP_REQUEST });
    
        const { data } = await axios.get('/api/products/topsold');
    dispatch({ type: PRODUCT_LIST_TOP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_TOP_FAIL, payload: error.message });
  }

}

const offlinelistProducts = (category = '',searchKeyword = '',sortOrder = '') => async (dispatch,getState) => {
  
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
        const { data } = await axios.get(
      '/api/products?category=' +
        category +
        '&searchKeyword=' +
        searchKeyword +
        '&sortOrder=' +
        sortOrder
    );
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
};

const onlinelistProducts=()=>async(dispatch,getState)=>{
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { userSignin: { userInfo }} = getState();
        const { data } = await axios.get('/api/products/cache',{
        headers: {
          authorization: userInfo.token,
        }
      });
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
}


const saveProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_SAVE_REQUEST, payload: product });
    const { userSignin: { userInfo },} = getState();
    if (!product._id) {
      const { data } = await Axios.post('/api/products', product, {
        headers: {
          authorization: userInfo.token,
        }
      });
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    } else {
      const { data } = await Axios.put(
        '/api/products/' + product._id,
        product,
        {
          headers: {
            authorization:userInfo.token,
          }
        }
      );
      dispatch({ type: PRODUCT_SAVE_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({ type: PRODUCT_SAVE_FAIL, payload: error.message });
  }
};

const offlineDetailsProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    const { userSignin: { userInfo },} = getState();

    const { data } = await axios.get('/api/products/' + productId);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
};

const onlineDetailsProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    const { userSignin: { userInfo }} = getState();

    const { data } = await axios.get('/api/products/cache/' + productId,{
        headers: {
          authorization: userInfo.token,
        }
      });
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
};



const deleteProdcut = (productId) => async (dispatch, getState) => {
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    const { data } = await axios.delete('/api/products/' + productId, {
      headers: {
        authorization:userInfo.token,
      },
    });
    dispatch({ type: PRODUCT_DELETE_SUCCESS, payload: data, success: true });
  } catch (error) {
    dispatch({ type: PRODUCT_DELETE_FAIL, payload: error.message });
  }
};

const saveProductReview = (productId, review) => async (dispatch, getState) => {
  try {
    const {
      userSignin: {
        userInfo: { token },
      },
    } = getState();
    dispatch({ type: PRODUCT_REVIEW_SAVE_REQUEST, payload: review });
    const { data } = await axios.post(
      `/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          authorization: token,
        },
      }
    );
    dispatch({ type: PRODUCT_REVIEW_SAVE_SUCCESS, payload: data });
  } catch (error) {
    // report error
    dispatch({ type: PRODUCT_REVIEW_SAVE_FAIL, payload: error.message });
  }
};

export {
  getTopProducts,
  onlinelistProducts,
  offlinelistProducts,
  onlineDetailsProduct,
  offlineDetailsProduct,
  saveProduct,
  deleteProdcut,
  saveProductReview,
};
