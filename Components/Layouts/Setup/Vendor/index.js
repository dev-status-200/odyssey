import { Row, Col, Table } from 'react-bootstrap';
import React, { useEffect, useReducer } from 'react';
import Router from 'next/router';
import { HistoryOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import axios from 'axios';

function recordsReducer(state, action){
    switch (action.type) {
      case 'toggle': { 
        return { ...state, [action.fieldName]: action.payload } 
      }
      case 'create': {
        return {
            ...state,
            edit: false,
            visible: true,
        }
      }
      case 'history': {
        return {
            ...state,
            edit: false,
            viewHistory:true,
            visible: true,
        }
      }
      case 'edit': {
        return {
            ...state,
            selectedRecord:{},
            edit: true,
            visible: true,
            selectedRecord:action.payload
        }
      }
      case 'modalOff': {
        let returnVal = { ...state, visible: false, edit: false, viewHistory:false };
        state.edit?returnVal.selectedRecord={}:null
        return returnVal
      }
      default: return state 
    }
}

const initialState = {
    records: [],
    history:[],
    // Editing Records
    selectedRecord:{},
    oldRecord:{},
};

const Vendor = ({sessionData, vendorData}) => {

  useEffect(()=>{ if(sessionData.isLoggedIn==false) Router.push('/login') }, [sessionData]);
  const dispatchNew = useDispatch();

  const [ state, dispatch ] = useReducer(recordsReducer, initialState);
  const { records } = state;

  useEffect(() => {
    setRecords();
  }, [])

  const setRecords = () => {
    console.log(vendorData.result)
    dispatch({type:'toggle', fieldName:'records', payload:vendorData.result});
  }

  const getHistory = async(recordid,type) => {
    dispatch({type:'toggle', fieldName:'load', payload:true});
    dispatch({ type: 'history'})
    await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_HISTORY,{
      headers:{ recordid:recordid, type:type }
    }).then((x)=>{
      setTimeout(async() => {
        dispatch({type:'toggle', fieldName:'load', payload:false});
        dispatch({type:'toggle', fieldName:'history', payload:x.data.result});
    }, 2000);
    })
  }

  return (
    <div className='base-page-layout'>
    <Row>
      <Col><h5>Vendors</h5></Col>
      <Col>
        <button className='btn-custom right' 
          onClick={()=>{
            dispatchNew(incrementTab({"label":"Vendor","key":"2-8","id":"new"}));
            Router.push(`/setup/vendor/new`);
          }}>Create
        </button>
      </Col>
    </Row>
    <hr className='my-2' />
    <Row style={{maxHeight:'69vh',overflowY:'auto', overflowX:'hidden'}}>
    <Col md={12}>
      <div className='table-sm-1 mt-3' style={{maxHeight:500, overflowY:'auto'}}>
        <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Contact Persons</th>
            <th>Telephones</th>
            <th>Address</th>
            <th>History</th>
          </tr>
        </thead>
        <tbody>
        {
          records.map((x, index) => {
          return (
          <tr key={index} className='f row-hov'
            onClick={()=>{
              dispatchNew(incrementTab({"label":"Vendor","key":"2-8","id":x.id}));
              Router.push(`/setup/vendor/${x.id}`);
            }}
          >
            <td className='blue-txt fw-7'>{x.name}</td>
            <td>{x.types?.split(", ").map((z, i)=>{
              return(<div key={i} className="party-types">{z}</div>)
            })}</td>
            <td>
              {x.person1} {x.mobile1}<br/>
              {x.person2} {x.mobile2}<br/>
            </td>
            <td>
              {x.telephone1}<br/>
              {x.telephone2}
            </td>
            <td>
              {x.address1?.slice(0,30)}<br/>
              {x.address2?.slice(0,30)}<br/>
            </td>
            <td>
              Created By: <span className='blue-txt fw-5'>{x.createdBy}</span>
            </td>
          </tr>
          )
        })}
        </tbody>
        </Table>
      </div>
    </Col>
    </Row>
    </div>
  )
}

export default Vendor