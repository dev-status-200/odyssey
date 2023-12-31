import React from 'react';
import { Radio, Select, Input, DatePicker, InputNumber } from 'antd';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import AccountSelection from './AccountSelection';
import { getCompanyName, getAccounts } from './states';

const AgentTransactionInfo = ({state, dispatch, payType, invoiceCurrency}) => {

    const set = (a, b) => { dispatch({type:'set', var:a, pay:b}) }
    const companyId = useSelector((state) => state.company.value);

  return (
    <>
    <Row>
        <Col md={5}>
            <div className='grey-txt mb-1 fs-14'>Transaction Mode</div>
            <Radio.Group 
                value={state.transaction} 
                onChange={(e)=>{set('payAccountRecord', {}); set('transaction', e.target.value);}} 
            >
                <Radio value={"Cash"}>Cash</Radio>
                <Radio value={"Bank"}>Bank</Radio>
                <Radio value={"Adjust"}>Adjust</Radio>
            </Radio.Group>
        </Col>

        <Col md={3} className="">
            <div className='grey-txt fs-14'>Date</div>
            <DatePicker size='small' onChange={(e)=>set('date', e)} value={state.date} />
        </Col>

        <Col md={4} className="">
            <div className='grey-txt fs-14'>Sub Type</div>
            <Select size='small'
                defaultValue={state.subType}
                onChange={(e)=> set('subType', e)}
                style={{
                    width:'100%',
                }}
                options={[
                    { value:'Cheque', label:'Cheque' },
                    { value:'Credit Cart', label:'Credit Cart' },
                    { value:'Online Transfer', label:'Online Transfer' },
                    { value:'Wire Transfer', label:'Wire Transfer' },
                    { value:'Cash', label:'Cash' },
                ]}
            />
        </Col>

        <Col md={3} className="mt-3">
            <div className='grey-txt fs-14'>Cheque / Tran #</div>
            <Input size='small' value={state.checkNo} disabled={state.transaction=="Cash"?true:false} onChange={(e)=>set('checkNo',e.target.value)} />
        </Col>

        <Col className="mt-3" md={4}>
            <div className="grey-txt fs-14">{payType=="Recievable"?"Recieving":"Paying"} Account #</div>
            <div className="custom-select-input-small" 
                onClick={async()=>{
                    // set('variable', 'payAccountRecord');
                    // set('visible', true);
                    dispatch({type:'setAll', payload:{
                        variable:'payAccountRecord',
                        visible:true
                    }})
                    let resutlVal = await getAccounts(state.transaction,companyId, 'accounts');
                    //set('accounts', resutlVal);
                    dispatch({type:'setAll', payload:{
                        accounts:resutlVal
                    }})
                }}
            >{
                Object.keys(state.payAccountRecord).length==0?
                <span style={{color:'silver'}}>Select Account</span>:
                <span style={{color:'black'}}>{state.payAccountRecord.title} ~ {getCompanyName(state.payAccountRecord.Parent_Account.CompanyId)}</span>
            }
            </div>
        </Col>
        <Col md={4} className="mt-3">
            <div className='grey-txt fs-14'>On Account</div>
            <Select size='small' 
                defaultValue={state.onAccount}
                onChange={(e)=> set('onAccount', e)}
                style={{
                    width:'100%',
                }}
                options={[
                    { value:'Client', label:'Client' },
                    { value:'Importer', label:'Importer' },
                    { value:'Shipper', label:'Shipper' },
                    { value:'Clearing Agent', label:'Clearing Agent' }
                ]}
            />
        </Col>
        <Col md={8} className="mt-0">
            <div className='grey-txt fs-14'>Drawn At</div>
            <Input size='small'  value={state.drawnAt} onChange={(e)=>set('drawnAt',e.target.value)} />
        </Col>

        <Col md={3} className=""></Col>

        <Col md={3} className="mt-3">
            <div className='grey-txt fs-14'>Bank Charges</div>
            <InputNumber size='small' style={{width:'90%'}} value={state.bankCharges} min="0.0" onChange={(e)=>set('bankCharges', e)} />
        </Col>
        <Col className="mt-3" md={6}>
            <div className="grey-txt fs-14">Bank Charges Account</div>
            <div className="custom-select-input-small" 
                onClick={async()=>{
                    dispatch({type:'setAll', payload:{
                        variable:'bankChargesAccountRecord',
                        visible:true
                    }})
                    // set('variable', 'bankChargesAccountRecord');
                    // set('visible', true);
                    
                    let resutlVal = await getAccounts('Adjust', companyId);
                    dispatch({type:'setAll', payload:{
                        accounts:resutlVal
                    }})
                    //set('accounts', resutlVal);
                }}
            >{
                Object.keys(state.bankChargesAccountRecord).length==0?
                <span style={{color:'silver'}}>Select Account</span>:
                <span style={{color:'black'}}>{state.bankChargesAccountRecord.title}</span>
            }
            </div>
        </Col>
    
    </Row>
    <AccountSelection state={state} dispatch={dispatch} />
    </>
  )
}

export default AgentTransactionInfo