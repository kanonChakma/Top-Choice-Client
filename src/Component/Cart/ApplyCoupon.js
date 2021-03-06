import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyCoupon } from '../../common/coupon';
import { toast } from 'react-toastify';

const ApplyCoupon = ({prevStep,nextStep,setTotalPrice}) => {
    const[coupon,setCoupon]=useState('');
    const{user}=useSelector((state)=>({...state}))
    const[error,setError]=useState("");

    const dispatch=useDispatch();

    const back = e => {
      e.preventDefault();
       prevStep();
    };
    const next = e => {
      e.preventDefault();
      nextStep();
    };
  
    const handleApply=()=>{
        applyCoupon(coupon,user.token)
        .then((res)=>{
           if(res.data.err){
               setError(res.data.err)
               dispatch({
                 type:"APPLY_COUPON",
                 payload:false
             })
           }else{
            console.log(res.data);
           setTotalPrice(res.data);
           setCoupon("")
           dispatch({
               type:"APPLY_COUPON",
               payload:true
           })
           toast.success("Coupon Apllied");
           nextStep()
           }
        })
     }
    return (
      <div className='container'>
      <div className='row'>
          <div className='col-md-7 offset-md-3 mt-5 pt-5'>
          <h4 className='text-center p-3 mb-5'>Aplly Coupon</h4> 
        <input 
           onChange={(e) => {
               setCoupon(e.target.value)
               setError("")
             }} 
           placeholder="Enter Coupon Code"
           className="form-control mt-3"
           value={coupon}            
        />
         <div className='row mt-3'>
            <div className='col-md-4'>
               <button   onClick={back}   class="btn btn-outline-success">Prev</button>
            </div>
            <div className='col-md-4'>
               <button   onClick={next} class="btn btn-outline-info">Skip</button>
            </div>
            <div className='col-md-4'>
               <button  onClick={handleApply} class="btn btn-outline-warning">Apply</button>
            </div>
         </div> 
          <div className='mt-3'>
             {error && <p className='bg-danger p-2 display-5'>{error}</p>}     
          </div>    
          </div>
      </div>
  </div>
    );
};

export default ApplyCoupon;