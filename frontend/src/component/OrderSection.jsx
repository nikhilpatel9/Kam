/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Order from './Order';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function OrderSection({ leadId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [order, setOrder] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (order.length > 300) {
      return;
    }
    try {
      const res = await fetch('/api/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: order,
          leadId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrder('');
        setCommentError(null);
        setOrders([data, ...orders]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await fetch(`/api/order/getLeadOrders/${leadId}`);
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    getOrders();
  }, [leadId]);

  const handleCall = async (orderId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`/api/order/callOrder/${orderId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(
          orders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  calls: data.calls,
                  numberOfCalls: data.numberOfCalls,
                }
              : order
          )
        );
      } else {
        const error = await res.json();
        console.log(error.message); // Display this message to the user if necessary
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  const handleEdit = async (order, editedContent) => {
    setOrders(
      orders.map((c) => (c._id === order._id ? { ...c, content: editedContent } : c))
    );
  };

  const handleDelete = async (orderId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/order/deleteOrder/${orderId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to Order.
          <Link className="text-blue-500 hover:underline" to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Add a Order with your order details and address contact information.."
            rows="4"
            maxLength="300"
            onChange={(e) => setOrder(e.target.value)}
            value={order}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-xs text-gray-400">
              {order.length > 0 && `${order.length}/300`}
            </p>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              disabled={!order}
            >
              Place Order
            </Button>
          </div>
        </form>
      )}
      {commentError && (
        <Alert
          className="mt-5"
          icon={HiOutlineExclamationCircle}
          color="failure"
        >
          <span>
            <p>
              <span className="font-medium">Error:</span> {commentError}
            </p>
          </span>
        </Alert>
      )}
      <div className="flex flex-col divide-y gap-1 border-t border-teal-600 mt-3">
        {orders.map((order) => (
          <Order
            key={order._id}
            order={order}
            onEdit={handleEdit}
            onCall={handleCall}
            onDelete={() => {
              setOrderToDelete(order._id);
              setShowModal(true);
            }}
          />
        ))}
      </div>
      <Modal
        dismissible
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <Modal.Header>Delete Order</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={() => handleDelete(orderToDelete)}
          >
            Confirm
          </Button>
          <Button
            outline
            gradientDuoTone="purpleToBlue"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// import { Alert, Button, Modal, Textarea } from 'flowbite-react';
// import { useEffect, useState } from 'react';
// import { useSelector} from 'react-redux';
// import { Link ,useNavigate} from 'react-router-dom';
// import Order from './Order';
// import {HiOutlineExclamationCircle} from 'react-icons/hi'

// export default function OrderSection({ leadId }) {
//     const {currentUser}=useSelector((state)=> state.user);
//     const [order,setOrder]=useState('');
//     const [commentError,setCommentError]= useState(null);
//     const [orders,setOrders]=useState([]);
//     const [showModal,setShowModal]=useState(false);
//     const [orderToDelete,setOrderToDelete]=useState(null);
//     const navigate=useNavigate();
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (order.length > 300) {
//           return;
//         }
//         try {
//             const res = await fetch('/api/order/create', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   content: order,
//                   leadId,
//                   userId: currentUser._id,
//                 }),
//               });
//               const data = await res.json();
//               if (res.ok) {
//                 setOrder('');
//                 setCommentError(null);
//                 setOrders([data, ...orders]);
//               }
//         } catch (error) {
//             setCommentError(error.message);
//         }
          
        
//       };

//   useEffect(()=>{
//     const getComments = async () => {
//       try {
//         const res = await fetch(`/api/order/getLeadOrders/${leadId}`);
//           const data = await res.json();
//           setOrders(data);
//           } catch (error) {
//             console.error(error);
//             }
//     }
//     getComments();
//   },[leadId]) 
//  const handleCall =async (orderId)=>{
//   try {
//     if(!currentUser){
//       navigate('/sign-in');
//       return;
//     }
//     const res = await fetch(`/api/order/callOrder/${orderId}`, {
//       method: 'PUT',
//           });
//           if(res.ok){
//             const data = await res.json();
//             setOrders(orders.map((comment) => 
//               order._id === orderId ? {
//               ...order,
//               calls: data.calls,
//               numberOfCalls: data.calls.length,
//               }:
//               comment
//               ));
//             }
          
//   } catch (error) {
//     console.log(error);
//   }
//  }
//  const handleEdit =async (comment,editedContent)=>{
//   setOrders(
//     orders.map((c) => c._id === order._id ? { ...c, content: editedContent } : c)
//   )
  
//  };
//  const handleDelete = async (orderId)=>{
//   setShowModal(false);
//   try {
//     if(!currentUser){
//       navigate('/sign-in');
//       return;
//     }
//     const res = await fetch(`/api/order/deleteOrder/${orderId}`, {
//       method: 'DELETE',
//       });
//       if(res.ok){
//         const data = await res.json();
//         setOrders(orders.filter((order) => order._id !== orderId));

//         }
//   } catch (error) {
//     console.log(error);
//   }
//  }
//   return (
//     <div className='max-w-2xl mx-auto w-full p-3'>
//         { currentUser ?
//         (
//             <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
//                 <p>Signed in as:</p>
//                 <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt=''/>
//                 <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
//                 @{currentUser.username}</Link>
//             </div>
//         ):(
//             <div className='text-sm text-teal-500 my-5 flex gap-1'>
//                 You must be signed in to comment.
//                 <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
//                 Sign In</Link>
//             </div>
//         )}
//         {currentUser &&(
//             <form onSubmit={handleSubmit} className='border border-teal-500
//             rounded-md p-3'>
//                 <Textarea placeholder='Add a comment...'
//                 rows='3'
//                 maxLength='200'
//                 onChange={(e)=> setOrder(e.target.value)}
//                 value={order}
//                 />
//                 <div className=' flex justify-between items-center mt-5'>
//                     <p className='text-gray-500 text-sm'>{200-order.length} characters remaining</p>
//                     <Button outline
//                     gradientDuoTone='purpleToBlue'
//                     type='submit'
//                     >Submit</Button>
//                 </div>
//                 {commentError &&(
//                 <Alert color='failure' className='mt-5'>
//                 {commentError}
//                 </Alert>
//                  )
//                 }
               
//             </form>
//         )}
//         {orders.length === 0 ? (
//           <p className='text-sm my-5'>No comments yet!</p>
//         ) : (
//           <>
//             <div className='text-sm my-5 flex items-center gap-1'>
//               <p>Comments</p>
//               <div className='border border-gray-400 py-1 px-2 rounded-sm'>
//                 <p>{orders.length}</p>
//               </div>
//             </div>
//             {orders.map((order) => (
//               <Order
//                 key={order._id}
//                 order={order}
//                 onCall={handleCall}
//                 onEdit={handleEdit}
//                 onDelete={(orderId)=>{
//                   setShowModal(true);
//                   setOrderToDelete(orderId);
//                 }}
//               />
//             ))}
//         </>
        
//         )}
//         <Modal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         popup
//         size='md'
//       >
//         <Modal.Header />
//         <Modal.Body>
//           <div className='text-center'>
//             <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
//             <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
//               Are you sure you want to delete this comment?
//             </h3>
//             <div className='flex justify-center gap-4'>
//               <Button color='failure' onClick={()=>handleDelete(orderToDelete)}>
//                 Yes, I am sure
//               </Button>
//               <Button color='gray' onClick={() => setShowModal(false)}>
//                 No, cancel
//               </Button>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   )
// }



