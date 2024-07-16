import { Link, useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { authActions } from "../../store/authReducer";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const Groups = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [showAddGroupForm, setshowAddGroupForm] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_IP}/admin/getgroups`,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data.success) {
          console.log("groups = ", res.data.groups);
          setGroups(res.data.groups);
        }
      } catch (error) {
        console.log("Error while fetching groups: ", error.response.data.error);
        toast.error("Failed to fetch groups.");
      }
    };

    fetchGroups();
  }, []);

  const logoutHandler = () => {
    if(confirm('Want to logOut ?')){
      dispatch(authActions.logout());
      toast.success('Logged out successfully.')
      history.push('/login')
    }
  }

  const addGroupHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      groupName: formData.get("groupname"),
    };
    if (payload.groupName.trim().length === 0) {
      toast.error("Invalid Group name!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_IP}/admin/addgroup`,
        payload,
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        console.log("group = ", res.data.groupInfo);
        setGroups((prevGroups) => [...prevGroups, res.data.groupInfo]);
      }
    } catch (error) {
      console.log("Error while creating group : ", error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto md:p-6 h-full">
      <div className="dark:border dark:border-gray-700 flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="py-3 px-4 bg-gradient-to-b from-violet-600 to-violet-900 flex justify-between">
          <p className="text-xl font-bold leading-tight tracking-tight text-white">
            GroupChat
          </p>
          <span className="flex gap-4">
            <p
              className="text-white cursor-pointer hover:underline"
              onClick={() => setshowAddGroupForm((prev) => !prev)}
            >
              Add Group
            </p>
            <p className="text-white cursor-pointer hover:underline" onClick={logoutHandler}>LogOut</p>
          </span>
        </div>
        {showAddGroupForm && (
          <div className="p-4 border-b border-gray-300 dark:border-gray-600 flex flex-col">
            <span
              className="cursor-pointer ml-auto text-gray-900 dark:text-gray-100 border border-violet-500 px-2 py-1 rounded"
              onClick={() => setshowAddGroupForm(false)}
            >
              Close
            </span>
            <form className="flex flex-col gap-3" onSubmit={addGroupHandler}>
              <label
                htmlFor="groupname"
                className="text-lg text-gray-900 dark:text-gray-200"
              >
                Enter Group Name :{" "}
              </label>
              <input
                type="text"
                name="groupname"
                id="groupname"
                placeholder="Name of Group"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-violet-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <button
                type="submit"
                className="ml-auto px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                Add Group
              </button>
            </form>
          </div>
        )}
        <div className="flex-1 p-4 overflow-y-auto ">
          {/* group list */}
          <h2 className="text-xl font-bold leading-tight tracking-tight text-violet-700 dark:text-violet-400 mb-4 border-b border-b-gray-300 dark:border-b-gray-600 py-3">My Groups</h2>
          {groups.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No groups available.
            </p>
          ) : (
            <div className="flex">
              {groups.map((group) => (
                <Link
                  key={group.groupId}
                  to={`/chat?groupId=${group.groupId}&groupName=${group.groupName}`}
                  className="mb-2 px-2 py-4 w-full border rounded dark:border-gray-600 text-gray-800 dark:text-gray-300 text-xl font-medium hover:bg-gray-100 hover:dark:bg-gray-700"
                >
                  {group.groupName}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
