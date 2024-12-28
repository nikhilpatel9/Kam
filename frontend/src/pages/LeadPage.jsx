import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import OrderSection from "../component/OrderSection";
import PostCard from "../component/LeadCard";
export default function LeadPage() {
    const { leadSlug}=useParams();
    const [loading,setLoading ]= useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error,setError]=useState(false);
    const [lead,setLead]=useState(null);
    const [recentPosts,setRecentPosts] =useState(null);

    useEffect(()=>{
        const fetchLeads = async ()=>{
            try {
                setLoading(true);
                const res = await fetch(`/api/lead/getleads?slug=${leadSlug}`);
                const data=await res.json();
                if(!res.ok){
                    setError(true);
                    setLoading(false);
                    return;
                }
                if(res.ok){
                    setLead(data.leads[0]);
                    setLoading(false);
                    setError(false);
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchLeads();
    },[leadSlug]);
    useEffect(() => {
        try {
          const fetchRecentPosts = async () => {
            const res = await fetch(`/api/lead/getleads?limit=3`);
            const data = await res.json();
            if (res.ok) {
              setRecentPosts(data.leads);
            }
          };
          fetchRecentPosts();
        } catch (error) {
          console.log(error.message);
        }
      }, []);
    if(loading) return (
    <div className="flex justify-center items-center min-h-screen">
        <Spinner size='xl'/>
    </div>)
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto
        lg:text-4xl">{lead && lead.title}</h1>
        <Link to={`/search?category=${lead && lead.category}`} 
        className='self-center mt-5'>
        <Button color='gray' pill size='xs'>{lead && lead.category}</Button>
        </Link>
        <img src={lead && lead.image} alt={lead && lead.title} className="mt-5 mx-auto p-3 max-h-[500px] w-2/3 object-center"/>
        <div className="flex justify-between p-3 border-b border-slate-500
        mx-auto w-full max-w-2xl text-xs">
            <span className="text-red-500">Your daily call limit for A order is 10 call only.</span>
            
            <span>
            {lead &&
              new Date(lead.createdAt).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true, // Use true for 12-hour clock or false for 24-hour clock
              })}
            </span>
        </div>
        <div className ='p-3 max-w-2xl mx-auto w-full post-content  border-slate-500' dangerouslySetInnerHTML={{__html:lead && lead.content}}>

        </div>
        <div className="p-3 max-w-2xl mx-auto w-full">
          <h2 className="text-lg font-semibold text-center mb-4">Contact Details</h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-b border-slate-300 py-4 px-3">
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-medium text-gray-600">Email ID</h3>
              <p className="text-base text-gray-300">{lead && lead.email ? lead.email : "Not available"}</p>
            </div>
            <div className="flex flex-col items-start">
              <h3 className="text-sm font-medium text-gray-600">Phone No.</h3>
              <p className="text-base text-gray-300">{lead && lead.phone ? lead.phone : "Not available"}</p>
            </div>
          </div>
        </div>
        <OrderSection leadId={lead._id} />
        <div className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-xl mt-5">Recent Restaurants</h1>
            <div className="flex flex-wrap gap-5 mt-4 justify-center transition-all">
            {
                recentPosts &&
                recentPosts.map((lead)=>(
                    <PostCard key={lead._id} lead={lead}/>
                    ))
            }
            </div>
        </div>
        </main>
  )
}