
/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

export default function Order({ order, onCall, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(order.content);
  const { currentUser } = useSelector((state) => state.user);

  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [isDelivered, setIsDelivered] = useState(false);

  const intervalRef = useRef(null); // Use useRef to hold the interval ID and prevent resetting

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${order.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [order]);

  useEffect(() => {
    // Check if the interval has already been set by looking at localStorage
    const timerStart = localStorage.getItem(`order_${order._id}_timerStarted`);

    if (timerStart) {
      // If timer has already started, calculate the remaining time
      const timeElapsed = Math.floor((Date.now() - parseInt(timerStart)) / 1000);
      const remainingTime = Math.max(3600 - timeElapsed, 0);
      setTimeRemaining(remainingTime);

      // If the timer is finished
      if (remainingTime === 0) {
        setIsDelivered(true);
      }
    } else {
      // Set the timer for the first time when the order is created
      localStorage.setItem(`order_${order._id}_timerStarted`, Date.now().toString());

      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(intervalRef.current);
            setIsDelivered(true);
            return 0;
          }
        });
      }, 1000);
    }

    // Cleanup the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [order]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(order.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/order/editOrder/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(order, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm bg-gray-50 dark:bg-gray-800 rounded-md shadow-md">
      <div className="flex-shrink-0 mr-4">
        <img
          className="w-12 h-12 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-2 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(order.createdAt).fromNow()}
          </span>
          <div className="ml-auto text-xs font-semibold  text-red-600">
            {!isDelivered ? `Time Left: ${formatTime(timeRemaining)}` :  "Order Delivered"}
          </div>
        </div>
        {isEditing ? (
          <>
            <Textarea
              className="mb-2 border rounded-md"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="p-3 mb-2 border rounded-md bg-white dark:bg-gray-700">
              <p className="text-gray-600 dark:text-gray-300">{order.content}</p>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {order.numberOfCalls < 10 ? (
                  <>
                    <Button
                      type="button"
                      gradientDuoTone="purpleToBlue"
                      onClick={() => onCall(order._id)}
                      className="text-gray-100"
                    >
                      Call
                    </Button>
                  </>
                ) : (
                  <p className="text-red-600">You have reached your daily call limit for this order.</p>
                )}
                <p
                  className={`${
                    order.numberOfCalls === 10
                      ? "text-red-500 font-bold"
                      : "text-blue-500"
                  }`}
                >
                  {order.numberOfCalls > 0 &&
                    `${order.numberOfCalls} ${
                      order.numberOfCalls === 1 || 0 ? "call" : "calls"
                    }`}
                </p>
              </div>
              {currentUser &&
                (currentUser._id === order.userId || currentUser.isAdmin) && (
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(order._id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
