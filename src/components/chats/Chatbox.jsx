import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { chatActions } from "../../store/chatReducer";
import { toast } from "react-toastify";

const Chatbox = () => {
  const messages = useSelector((state) => state.chats.messages);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const groupId = query.get("groupId");
  const groupName = query.get("groupName");

  const [input, setInput] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [memberForm, setMemberForm] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    let fetchTimeout;

    const fetchAllChat = async (lastId) => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/chat/all`,
          {
            params: { lastId, groupId },
            headers: { Authorization: token },
          }
        );
        if (res.data.messages.length > 0) {
          console.log("Fetched messages:", res.data.messages.length);
          dispatch(chatActions.setMessages(res.data.messages));
        }
      } catch (error) {
        console.log(
          "Error while fetching chat:",
          error.response.data?.error || error.message
        );
        toast.error(
          error.response.data?.error || "Error fetching chat messages."
        );
      } finally {
        // Set up the next fetch
        fetchTimeout = setTimeout(() => {
          const oldMessages =
            JSON.parse(localStorage.getItem("messages")) || [];
          const lastId =
            oldMessages.length > 0
              ? oldMessages[oldMessages.length - 1].id
              : undefined;
          console.log("Last message ID:", lastId);
          fetchAllChat(lastId);
        }, 1000);
      }
    };

    // Initial fetch
    fetchAllChat();

    return () => clearTimeout(fetchTimeout);
  }, [dispatch]);

  useEffect(() => {
    async function fetchMembers() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/admin/groupmembers`,
          { params: { groupId }, headers: { Authorization: token } }
        );
        console.log("--------members-------", res.data.groupMembers);
        setGroupMembers(res.data.groupMembers.users);
      } catch (error) {
        console.log(
          "Error while fetching members : ",
          error.response.data.error
        );
        toast.error(error.response.data.error);
      }
    }

    fetchMembers();
  }, []);

  const sendChat = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER_IP}/chat/send`,
          { message: input, groupId },
          { headers: { Authorization: token } }
        );
        dispatch(chatActions.addMessage(res.data.message));
      } catch (error) {
        console.log(
          "Error while sending message : ",
          error.response.data.error
        );
        toast.error(error.response.data.error);
      }

      setInput("");
    }
  };

  const addMemberHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      userEmail: formData.get("memberemail"),
      admin: formData.get("memberadmin") ? true : false,
      groupId:groupId,
    };
    // console.log('--------------------',payload);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_IP}/admin/groupmembers`,
        payload,
        { headers: { Authorization: token } }
      );
      console.log('new user----------',res.data);
      setGroupMembers(prev=>[...prev,res.data.newUser])
      toast.success(res.data.message)
    } catch (error) {
      console.log("Error while adding member : ", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto md:p-6 h-full">
      <div className="dark:border dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="py-3 px-4 bg-gradient-to-b from-violet-600 to-violet-900 flex justify-between">
          <p className="text-xl font-bold leading-tight tracking-tight text-white">
            {groupName}
          </p>
          <span className="flex gap-4">
            <p
              className="text-white cursor-pointer hover:underline"
              onClick={() => {
                setMemberForm(true);
              }}
            >
              Members
            </p>
            <Link
              className="text-white cursor-pointer hover:underline"
              to="/groups"
            >
              All groups
            </Link>
          </span>
        </div>

        {memberForm && (
          <>
            <div className="p-4 border-b border-gray-300 dark:border-gray-600 flex flex-col">
              <span
                className="cursor-pointer ml-auto text-gray-900 dark:text-gray-100 border border-violet-500 px-2 py-1 rounded"
                onClick={() => setMemberForm(false)}
              >
                Close
              </span>

              <form className="flex flex-col gap-3" onSubmit={addMemberHandler}>
                <h2 className="text-xl font-bold leading-tight tracking-tight text-violet-700 dark:text-violet-400 border-b border-b-gray-300 dark:border-b-gray-600 py-3">
                  Add Member
                </h2>
                <label
                  htmlFor="memberemail"
                  className="text-lg text-gray-900 dark:text-gray-200"
                >
                  Enter Member Email :{" "}
                </label>
                <input
                  type="email"
                  name="memberemail"
                  id="memberemail"
                  placeholder="Email"
                  required
                  className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <div className="flex items-center mb-4">
                  <input
                    id="memberadmin"
                    name="memberadmin"
                    type="checkbox"
                    value="admin"
                    className="w-5 h-5 text-violet-600 bg-gray-100 border-gray-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="memberadmin"
                    className="ms-4 text-lg text-gray-900 dark:text-gray-200"
                  >
                    Admin Rights
                  </label>
                </div>
                <button
                  type="submit"
                  className="ml-auto px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  Add Member
                </button>
              </form>
            </div>

            <div className="p-4 flex flex-col overflow-y-auto">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-violet-700 dark:text-violet-400 mb-4 border-b border-b-gray-300 dark:border-b-gray-600 py-3">
                Members
              </h2>
              <ul className="">
                {groupMembers?.map((member) => (
                  <li
                    key={member.id}
                    className="p-4 w-full border rounded dark:border-gray-600 hover:bg-gray-100 hover:dark:bg-gray-700 flex items-center justify-between"
                  >
                    <span className="text-gray-800 dark:text-gray-300 text-xl font-medium">
                      {member.name}
                    </span>
                    {member.groupmembers.isAdmin && (
                      <span className=" text-gray-100 text-xs px-1 bg-violet-600 rounded font-bold">
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {!memberForm && (
          <>
            <div className="flex-1 p-4 overflow-y-auto ">
              {/* messages */}
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${
                      msg.userId == userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs break-words px-4 py-2 rounded-lg shadow ${
                        msg.userId == userId
                          ? "bg-gradient-to-br from-violet-500 to-violet-700 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                      }`}
                    >
                      <p className="font-medium">{msg.sender}</p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-gray-300 dark:border-gray-600">
              <form className="flex" onSubmit={sendChat}>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-700 text-white rounded-r-lg hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
