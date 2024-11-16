"use client";
import { useEffect, useState } from "react";
import axios from "axios";

async function postUser(name, email) {
  try {
    const res = await axios.post("http://backend:5000/users", { name, email });
    console.log(res)
    return res.data
  } catch (err) {
    console.log(err);
  }
}

async function getUsers() {

  try {
    const res = await axios.get("http://backend:5000/users");
    console.log(res)
    return res.data;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching users" };
  }
}

async function searchUsers(name) {

  console.log(name)

  try {
    const res = await axios.post("http://backend:5000/search", { name });
    console.log(res)
    return res.data;
  } catch (err) {
    console.log(err);
    return { message: "Error fetching users" };
  }
}

async function delUser(id) {
  try {
    const res = await axios.delete(`http://backend:5000/users/${id}`);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
}

async function putUser(name, email, id) {
  try {
    const res = await axios.put(`http://backend:5000/users/${id}`, {
      name,
      email,
    });
    return res.data
  } catch (err) {
    console.log(err);
  }
}

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [results, setResults] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    getUsers()
    .then(res => {
      console.log(res)
      setResults(res)
    })
    .catch(err => console.log(err))
  }, [])

  const handlePost = async (e) => {
    e.preventDefault();
    const newUser = await postUser(name, email)
    // console.log(newUser)
    setResults([...results, newUser])
    setName("");
    setEmail("");
    setError("")
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const returnedUser = await searchUsers(searchName)

    if(returnedUser.message){
      setError(returnedUser.message)
    }
    else {
      setResults(results.filter(val => val.id === returnedUser.id ? returnedUser : null ));
      setError("")
    }
    
    setSearchName("");
  };

  const handleDelete = async (id) => {
    await delUser(id);
    setResults(results.filter((val) => val.id !== id));
    setError("")
  };

  const handlePut = async (e) => {
    e.preventDefault();
    const updatedUser = await putUser(newName, newEmail, updateId);
    setResults(results.map(val => { return val.id === updatedUser.id ? updatedUser : val }))
    setNewName("");
    setNewEmail("");
    setUpdateId(null);
    setShowEdit(false);
    setError("")
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">CRUD Operations App</h1>

        {/* Add User Form */}
        <form onSubmit={handlePost} className="mb-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            Add User
          </button>
        </form>

        {/* Search User Form */}
        <form onSubmit={handleSearch} className="mb-6 space-y-4">
          <div>
            <label
              htmlFor="searchName"
              className="block text-gray-700 font-medium"
            >
              Search Name:
            </label>
            <input
              type="text"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {/* Edit User Form */}
        {showEdit && (
          <form onSubmit={handlePut} className="mb-6 space-y-4">
            <div>
              <label
                htmlFor="newName"
                className="block text-gray-700 font-medium"
              >
                New Name:
              </label>
              <input
                type="text"
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label
                htmlFor="newEmail"
                className="block text-gray-700 font-medium"
              >
                New Email:
              </label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Update User
            </button>
          </form>
        )}

        {error && (
          <span className="text-red-500">{error}</span>
        )}
        {/* User List */}
        <ul className="space-y-4">
          {results.length > 0 ? results.map((result) => (
            <li
              key={result.id}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
            >
              <span className="text-gray-800">
                {result.name} - {result.email}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(result.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowEdit(!showEdit);
                    setUpdateId(result.id);
                    setError("")
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
            </li>
          )) : null}
        </ul>
      </div>
    </main>
  );
}
