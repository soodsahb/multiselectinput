import { useRef, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import Pill from "./components/Pill";
import React from "react";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeSuggestion, setactiveSuggestion] = useState(0);

  //handle duplicate suggestion with set

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());
  const inputRef = useRef(null);

  const fetchUsers = async () => {
    setactiveSuggestion(0);
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    await fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const handleSelectedUser = (user) => {
    console.log(user);
    setSelectedUsers([...selectedUsers, user]);
    setSearchTerm("");
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSuggestions([]);
    inputRef.current.focus();
  };
  console.log(selectedUsers);

  const handleRemoveUser = (user) => {
    const newSelectedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser !== user
    );
    setSelectedUsers(newSelectedUsers);

    const updatedEmails = new Set(selectedUserSet);
    updatedEmails.delete(user.email);
    setSelectedUserSet(updatedEmails);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setactiveSuggestion((prev) =>
        prev < suggestions.users.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setactiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeSuggestion >= 0 &&
      activeSuggestion < suggestions.users.length
    ) {
      console.log("inside enter");
      handleSelectedUser(suggestions.users[activeSuggestion]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => (
          <Pill
            user={user}
            key={user.email}
            onClick={() => handleRemoveUser(user)}
          ></Pill>
        ))}

        {/* input field with suggested options */}
        <div>
          <input
            type="text"
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search for a user ..."
            onKeyDown={handleKeyDown}
          />
          {/* Search Suggestions */}
          <ul className="suggestions-list">
            {suggestions?.users?.map((user, index) => {
              return !selectedUserSet.has(user.email) ? (
                <li
                  key={user.email}
                  onClick={() => handleSelectedUser(user)}
                  className={index === activeSuggestion ? "selected" : ""}
                >
                  <img src={user.image} alt="user-image" />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
