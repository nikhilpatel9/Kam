/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import LeadCard from '../component/LeadCard';

export default function Home() {
  const [leads, setLeads] = useState([]);
 

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/lead/getleads');
      const data = await res.json();
      setLeads(data.leads);
      //categorizePosts(data.leads);
    }
    fetchPosts();
  }, []);

  
  return (
    <div>
      <div className="relative h-96 bg-gradient-to-r from-purple-500 to-pink-500">
        <img 
          src="https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png" 
          alt="Blog Header" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Welcome to my Management System!</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl">
          Streamline your restaurant lead management with a powerful, all-in-one platform designed to simplify and enhance your workflow.
          </p>
          <Link to='/search' className='mt-8 px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-opacity-90 transition duration-300'>
            Explore All Lead
          </Link>
        </div>
      </div>

      {}

      <div className='max-w-6xl mx-auto p-6 flex flex-col gap-12 py-12'>
        {leads && leads.length > 0 && (
          <div className='flex flex-col gap-8'>
            <h2 className='text-3xl font-bold text-center'>Recent Leads</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {leads.slice(0, 6).map((lead) => (
                <LeadCard key={lead._id} lead={lead} />
              ))}
            </div>
            <Link to={'/search'} className='text-xl text-teal-500 hover:underline text-center font-semibold'>
              View All Leads
            </Link>
          </div>
        )}
      </div>

     {}
     </div>
  
   );
}

