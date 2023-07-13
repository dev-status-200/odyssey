import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';

const Requests = ({sessionData}) => {

  useEffect(() => {
    console.log(sessionData)
    if(sessionData.isLoggedIn==false){
      Router.push('/login')
    }
  }, [sessionData]);


  return (
    <div className='base-page-layout'>
    
    
    
    </div>
  )
}

export default Requests
