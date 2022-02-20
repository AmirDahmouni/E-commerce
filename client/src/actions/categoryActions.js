import Axios from 'axios';
import {
 CATEGORY_LIST_REQUEST,CATEGORY_LIST_SUCCESS, CATEGORY_LIST_FAIL} from "../constants/categoryConstants";
 
const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });
    const {data}  = await Axios.get('/api/products/categories');
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CATEGORY_LIST_FAIL, payload: error.message });
  }
};

export default listCategories