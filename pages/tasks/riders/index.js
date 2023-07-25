import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Table, Row, Col, Spinner } from 'react-bootstrap';
import MediumModal from '/Components/Shared/Modals/MediumModal';
import CreateOrEdit from '/Components/Layouts/Setup/Employees/CreateOrEdit';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { incrementTab } from '/redux/tabs/tabSlice';
import { Input, Empty, Radio, Modal } from 'antd';
import { LuBike } from "react-icons/lu";
import InputComp from '/Components/Shared/Form/InputComp'
import { useForm } from 'react-hook-form';
import cookies from 'js-cookie';
import openNotification from '/Components/Shared/Notification';

const initialState = {
  riders: [],
  visible: false,
  EmployeeId:"",
  load : false
}

const reducers = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}


const Employees = ({}) => {

  const [state, dispatch] = useReducer(reducers, initialState)
  const company = useSelector((state) => state.company.companies);
  const { register, control, handleSubmit, reset } = useForm({});
  const dispatchNew = useDispatch();

  const getEmployees = async() => {
    console.log("Function Hit")
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_RIDERS).then((x)=>{
      if(x.data.status=='success'){
        dispatch({type : "SET_DATA" , payload:  {riders: x.data.result}});
      }
    })
  }

  useEffect(() => {
    getEmployees();
    return () => { }
  }, [])

  const onSubmit = async(data) => {
    const assignedById = await cookies.get("loginId")
    await axios.post(process.env.NEXT_PUBLIC_CLIMAX_POST_TASK, {assignedById, ...data, EmployeeId:state.EmployeeId}).then((x) => {
      dispatch({type:"SET_DATA", payload:{load:true}})
      console.log({x})
      if(x.status=='200'){
        dispatch({type:"SET_DATA", payload:{visible:false, load: false}})
        openNotification('Success', `Task Assigned Successfully!`, 'green')
    }else{
      console.log("error")
      dispatch({type:"SET_DATA", payload:{visible:false, load: false}})

        openNotification('Failure', `Something Went Wrong. Please Try Again`, 'red')
    }

    })
    };

  return (
  <div className='dashboard-styles'>
    <div className='base-page-layout'>
      <Row>
      <Col md={12}>
        <Row>
        <Col><h5>Riders</h5></Col>
        </Row>
        <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
      </Col>
      {state.riders.length>0 && <Col md={12}>
      <div className='' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead><tr><th>Name</th><th>Contact</th><th>Current Status</th></tr></thead>
        <tbody>
        {state.riders.map((x, index) => {
        return (
        <tr key={index} className='f row-hov'
          onClick={()=>{
            dispatchNew(incrementTab({"label":"Rider Tasks List","key":"6-2","id":x.id}))
            Router.push(`/tasks/riders/riderAssign/${x.id}`)
        }}>
          <td className='blue-txt fw-5 fs-18'><LuBike/> <span className='mx-2'> {x.name}</span></td>
          <td>{x.contact}</td>
          <td></td>
        </tr>
        )})}
        </tbody>
        </Table>
        </div>
      </Col>}
      {state.riders.length == 0 && <div className='p-5 text-center'><Spinner/></div>}
      </Row>
    </div>
    {/* <Modal open={state.visible} 
      onOk={() => dispatch({type:"SET_DATA", payload:{ visible:true}})} 
      onCancel={() => dispatch({type:"SET_DATA", payload: { visible :false}})}
      width={"50%"}
      footer={false}
      centered={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col md={12}>
        <InputComp register={register} name='title' control={control} label='Title' />
        </Col>
        <Col md={12} className='py-1'>
          <InputComp  register={register} name='details' control={control} label='Details' />
        </Col>
      </Row>
      <hr/>
      <button type="submit"  className='btn-custom'>
        { !state.load ? `Assign Task` : <Spinner/> }
      </button>
        <button type="button"  className='btn-custom mx-1'  onClick={()=>{
          
        }}>
        View Task
      </button>
      </form>
    </Modal> */}
  </div>
  )
}

export default Employees