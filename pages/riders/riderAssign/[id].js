//import { useRouter } from 'next/router';
import axios from "axios";
import { Table, Row, Col, Spinner } from 'react-bootstrap';


// import SeJobCopy from '../../../Components/Layouts/SE/SeJobCopy';

const riderID = ({riderData, tasks}) => {
  console.log(tasks)
  return (
    <div className='dashboard-styles'>
    <div className='base-page-layout'>
    <Row>
    <Col md={12}>
      <Row>
      <Col><h5>Tasks</h5></Col>
      </Row>
      <div className='my-2' style={{backgroundColor:'silver', height:1}}></div>
    </Col>
    {tasks.length>0 && <Col md={12}>
    <div className='' style={{maxHeight:500, overflowY:'auto'}}>
      <Table className='tableFixHead'>
      <thead><tr><th>Sr.</th><th>Title</th><th>Details</th><th>Assigned By</th>
      <th>Assigned On</th>
      </tr></thead>
      <tbody>
      {tasks.map((x, index) => {
      return (
      <tr key={index} className='f row-hov'>
        <td>{index + 1}</td>
        <td><span className='blue-txt fw-5'>{x.title}</span></td>
        <td>{x.details}</td>
        <td>{x.assignedBy.name}</td>
        <td>{ x.createdAt.slice(0, 10 )}</td>
      </tr>
      )})}
      </tbody>
      </Table>
      </div>
    </Col>}
    {tasks.length == 0 && <div className='p-5 text-center'><Spinner/></div>}
    </Row>
  </div>
  </div>
  )
}
export default riderID



export async function getServerSideProps(context) {
  const { params } = context;
  let riderData = '';
  let tasks = []

  if(params.id!="new"){
    
    // riderData = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_EMPLOYEE_ID_AND_NAME,{})

    tasks = await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_EMPLOYEE_TASK,{
      headers:{ "id": `${params.id}` }
    }).then((x)=>x.data.result);
    // if (!riderData.id) {
    //   return {
    //     notFound: true
    //   }
    // }
  }
  return {
    props: { riderData:riderData, tasks:tasks }
  }
}