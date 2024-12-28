import { useLocation } from 'react-router-dom'
import { useState ,useEffect } from 'react'
import DashSidebar from '../component/DashSlidebar';
import DashProfile from '../component/DashProfile';
import DashLead from '../component/DashLead';

 import DashOrders from '../component/DashOrders';
import DashUsers from '../component/DashUsers';
import DashboardComp from '../component/DashboardComp';
import DashMessages from '../component/DashMessages';

export default function Dashboard() {
  const location =useLocation();
  const [tab,setTab] =useState('');
  useEffect(() => {
    const urlParams =new URLSearchParams(location.search)
    const tabFromUrl =urlParams.get('tab');
    if(tabFromUrl)
      {
        setTab(tabFromUrl);
      }
  },[location.search]);
  return (
   <div className='min-h-screen flex flex-col md:flex-row'>
    <div className='md:w-56'>
      {/* {} */}
      <DashSidebar/>
      </div>
      {/* {} */}
      {tab==='profile' && <DashProfile/>}
      {/* {} */}
      {tab==='leads' &&<DashLead/>}
      {/* {} */}
      {tab==='users'&&<DashUsers/>}
      {/* {} */}
      {tab=== 'orders' && <DashOrders/>}
      {/* {} */}
      {tab==='dash' &&<DashboardComp/>}
      {/* {} */}
      {tab==='messages' && <DashMessages/>}
     
  </div>
    
  )
}