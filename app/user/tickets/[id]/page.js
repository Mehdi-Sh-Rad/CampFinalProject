"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import io from "socket.io-client";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Link from "next/link";

const ChatTicket = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [newMessage, setNewMessage] = useState(""); // Stores the current input
  const [socket, setSocket] = useState(null); // WebSocket connection
  const [error, setError] = useState(null);

  // Establish WebSocket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: "/api/socket",
      transports: ["websocket"],
      query: { ticketId: id },
    });
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      console.log(messages);
    });

    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/tickets/${id}/messages`);
        if (!response.ok) throw new Error("تیکت یافت نشد");
        const data = await response.json();
        setMessages(data.message);

      } catch (err) {
        setError(err.message);
      }
    };
    fetchMessages();

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [id]);


  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = { text: newMessage, sender: "User" };

    try {
      // Emit the message to the WebSocket server
      socket.emit("sendMessage", message);

      // Save the message in the database
      const response = await fetch(`/api/tickets/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!response.ok) throw new Error("Failed to save message");

      // Update the page
      setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error saving message:", error.message);
    }
  };

  // Format date to Persian calendar
  const formatToPersianDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const persianDate = new DateObject({
      date: date,
      calendar: persian,
      locale: persian_fa,
    });
    return persianDate.format("HH:mm - YYYY/MM/DD");
  };


  return (
    <div className="bg-shop-bg dark:bg-[#171a26] min-h-[100vh] flex flex-col">
      <div className="relative h-[180px] min-h-[180px] w-full overflow-hidden rounded-b-xl">
        <h1 className="text-gray-500 absolute z-10 right-8 top-6 font-bold text-xl md:text-3xl">گفتگو با پشتیبانی</h1>
      </div>
      <div className="flex-grow container py-4 px-10 -mt-10 z-50 relative">
        <div className="bg-white py-4 px-4 rounded-lg shadow-xl shadow-[#112692]/5 dark:bg-shop-dark flex flex-col h-full">
          {error && <div className="text-red-500 mb-3">{error}</div>}
          <div className="flex-grow overflow-y-auto p-4 border dark:border-gray-600 rounded">
            <p className="mb-2">همکاران ما بصورت آنلاین آماده پاسخگویی هستند</p>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 p-2 rounded ${msg.sender === "Admin" ? "bg-green-100 text-right" : "bg-gray-100 text-left"
                  }`}
              >
                <p className="text-sm">{msg.sender === "Admin" ? "پشتیبانی :" : ": کاربر"}</p>
                <p>{msg.text}</p>
                <p className="text-sm mt-2">{msg.timestamp && formatToPersianDate(msg.timestamp)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-grow border dark:bg-shop-dark dark:border-gray-600 dark:text-gray-200 rounded mx-2 px-4 py-2"
              placeholder="پیام خود را بنویسید..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                  e.preventDefault();
                }
              }}
            />
            <div>
              <button
                className="ml-2 bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleSendMessage}
              >
                ارسال
              </button>
              <Link
                className="ml-2 bg-red-600 text-white py-2 px-4 rounded"
                href={"/user/tickets"}
              >
                بازگشت
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTicket;