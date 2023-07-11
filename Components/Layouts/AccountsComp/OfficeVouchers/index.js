import React, { useEffect, useReducer } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { incrementTab } from '/redux/tabs/tabSlice';
import Router from 'next/router';

function recordsReducer(state, action){
    switch (action.type) {
      case 'set': {
        return {
            ...state, ...action.payload
        }
      }
      default: return state 
    }
};

const initialState = {
  records: [{Employee:""}],
  load:false,
};

const OfficeVouchers = ({voucherList}) => {
    const [ state, dispatch ] = useReducer(recordsReducer, initialState);
    const dispatchNew = useDispatch();
    const set = (payload) => dispatch({type:"set", payload:payload});

  useEffect(() => {
    console.log(voucherList);
    set({records:voucherList})
  }, [voucherList])
  
  return (
    <div className='base-page-layout'>
    <Row>
        <Col md={11}></Col>
        <Col md={1}>
            <button className='btn-custom'
                onClick={()=>{
                    dispatchNew(incrementTab({"label":"Office Voucher","key":"3-8","id":"new"}))
                    Router.push(`/accounts/officeVouchers/new`)
                }}
            >Create</button>
        </Col>
    </Row>
    <Row>
    <div className='mt-3' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
        <thead>
          <tr>
            <th>Sr.</th><th>Paid To</th><th>Requested By</th><th>Amount</th><th>Created By</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
        {
        state.records.map((x, index) => {
        return (
        <tr key={index} className='f row-hov'
          onClick={() => {
            dispatchNew(incrementTab({
              "label": "Office Voucher",
              "key": "3-8",
              "id":x.id
            }))
            Router.push(`/accounts/officeVouchers/${x.id}`)
          }}
        >
          <td>{index + 1}</td>
          <td>
            <span className='blue-txt fw-7'>{x.Employee.name}</span>
          </td>
          <td>{x.requestedBy} </td>
          <td> PKR {x.amount} </td>
          <td>{x.preparedBy} </td>
          <td> {x.approved?<span style={{color:'green'}}>Approved</span>:<span style={{color:'silver'}}>Un-Approved</span>}</td>
        </tr>
          )
        })}
        </tbody>
      </Table>
    </div>
    </Row>
    </div>
  )
}

export default OfficeVouchers