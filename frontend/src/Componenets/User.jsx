import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { jwtDecode } from "jwt-decode";
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
export const Users = ({}) => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const aToken = localStorage.getItem("token");
  const decodedToken = jwtDecode(aToken);
  const currentUserId = decodedToken.userId;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/user/bulk?filter=" +
            filter +
            "&page=" +
            currentPage
        );
        const filteredUsers = response.data.user.filter(
          (user) => user._id !== currentUserId
        );
        setUsers(filteredUsers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    const debouncedFetchUsers = debounce(fetchUsers, 500); // Adjust debounce delay as needed

    debouncedFetchUsers(); // Initial call

    return () => {
      clearTimeout(debouncedFetchUsers); // Clear the debounce timer on component unmount
    };
  }, [filter, currentPage]);
  const navigate = useNavigate();
  const goToPage = (page) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User user={user} navigate={navigate} />
        ))}
      </div>
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page + 1)}
            className="mx-1 px-2 py-1 border rounded bg-gray-200"
          >
            {page + 1}
          </button>
        ))}
      </div>
    </>
  );
};

function User({ user, navigate }) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={(e) => {
            navigate("/sendmoney?id=" + user._id + "&name=" + user.firstName);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
