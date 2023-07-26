import React, { useState, useEffect } from 'react';
import { Row, Col } from "react-bootstrap";
import AWBCalculator from './AWBCalculator';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import CSVReader from 'react-csv-reader'

const Main = ({sessionData}) => {

    const companyId = useSelector((state) => state.company.value);

    useEffect(() => {
        if(sessionData.isLoggedIn==false){
          Router.push('/login')
        }
    }, [sessionData]);

  return (
    <div className='base-page-layout'>
      <Row>
        {companyId==3 && <AWBCalculator/>}
        {companyId!=3 && 
          <div>
            {/* Select & Add Tabs to get Started */}
            <CSVReader 
                onFileLoaded={async(data, fileInfo, originalFile) => {
                    let parentAccounts = [];
                    let tempAccounts = [];
                    await data.forEach((x,i)=>{
                        if(i<1590){
                            tempAccounts.push({
                                code:x[0]?.trim(),
                                title:x[2]?.trim(),
                                account:x[4]?.trim(),
                                group:x[3]?.trim(),
                                subCategory:x[5]?.trim()
                            })
                        }else{
                            return;
                        }
                    })
                    tempAccounts.forEach((x)=>{
                        if(x.group=="Group" ){
                            parentAccounts.push({
                                title:x.title,
                                editable:"1",
                                CompanyId:1,
                                subCategory:x.subCategory,
                                AccountId:
                                    x.account=="Asset"?
                                    3:
                                    x.account=="Liability"?
                                    4:
                                    x.account=="Expense"?
                                    1:
                                    x.account=="Income"?
                                    2:5,
                                 childs:[],
                            })
                        }else if(x.group!="Group" && parentAccounts.length>0){
                            parentAccounts[parentAccounts.length-1].childs.push({
                                title:x.title,
                                subCategory:x.subCategory,
                                editable:"1"
                            });
                        }
                    })
                    console.log(parentAccounts);
                }}
            />
          </div>
        }
      </Row>
    </div>
  )
}

export default Main