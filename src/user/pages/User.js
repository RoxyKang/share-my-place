import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  // if we add the async to the useEffect function like
  // useEffect(async() => {}) it'll always return a promise --> useEffect doesn't like this
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // fetch()'s default request type is GET
        // and we don't need to setup headers/body because GET doesn't need one
        const responseData = await sendRequest("http://localhost:4000/api/users");
        setLoadedUsers(responseData.users);
      } catch (error) {}
    };

    fetchUsers();
    // when the dependency array is empty, the function will only be run once
    // so it's important to have useCallback wrapping sendRequest, so that it won't be recreated when useHttpClient reruns
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
