import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCart, removeCart, saveAddress } from '../../common/cart';
import OrderSummary from './OrderSummary';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { applyCoupon } from '../../common/coupon';

const Checkout = ({history}) => {
    const{user}=useSelector((state)=>({...state}))
    const[cart,setCart]=useState([]);
    const dispatch=useDispatch();
    const [address, setAdress] = useState('');
    const[saveAdd,setSaveAdd]=useState(false);
    const[coupon,setCoupon]=useState('');
    const[totalPrice,setTotalPrice]=useState(0);
    const[error,setError]=useState("");

    useEffect(()=>{
       getCart(user.token)
       .then((res)=>setCart(res.data.products))
       .catch((err)=>console.log(err));
    },[])
    const handleSaveAdress=()=>{
      saveAddress(user.token,address)
      .then((res)=>{
          if(res.data.ok) toast.success("address saved")
          setAdress('') 
          setSaveAdd(true)
         })
      .catch((err)=>toast.error("error are exis"));
    }
    
    const handleEmpty=()=>{
        if(typeof window!== "undefined"){
           localStorage.removeItem("cart") 
        }
        dispatch({
            type:"ADD_TO_CART",
            payload:[]
        })
        removeCart(user.token)
        .then((res)=>{
          setCart([])
          setTotalPrice(0)
          toast.success("Cart is deleted.Continue Shopping...")
        })
    }
    const handleApply=()=>{
       applyCoupon(coupon,user.token)
       .then((res)=>{
          if(res.data){
            setTotalPrice(res.data);
            setCoupon("")
            dispatch({
                type:"APPLY_COUPON",
                payload:true
            })
          }
          if(res.data.err){
              setError(res.data.err)
              dispatch({
                type:"APPLY_COUPON",
                payload:false
            })
          }
       })
       .catch((err)=>{
           console.log(err);
       })
    }
    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-6'>
                     <h4>Delivary Adress</h4>   
                     <ReactQuill theme="snow" value={address} onChange={setAdress}/>
                     <button disabled={address.length==0} className='btn btn-primary mt-2' onClick={handleSaveAdress}>
                         Save
                     </button>
                     <div>
                         <h4>Aplly Coupon</h4> 
                         <input 
                            onChange={(e) => {
                                setCoupon(e.target.value)
                                setError("")
                              }} 
                            className="form-control"
                            value={coupon}            
                         />
                         <button onClick={handleApply} className='btn btn-primary'>Apply</button>
                         {error && <p className='bg-danger p-2 display-5'>{error}</p>}
                     </div>
                </div>
                <div className='col-md-6'>
                    <h4>Order Summary</h4>
                    <OrderSummary cart={cart}/>
                      {totalPrice>0 && <h4 className='bg-success p-2'>Total After Discount ${totalPrice}</h4>}
                   <div className='row'>
                     <div className='col-md-6'>
                        <button onClick={()=>history.push("/payment")} disabled={!saveAdd || !cart.length} className='btn btn-primary'>
                            PLACE ORDER
                        </button>
                     </div>
                     <div className='col-md-6'>
                        <button disabled={!cart.length}  onClick={handleEmpty} className='btn btn-primary'>
                            EMPTY CART
                        </button>
                     </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;