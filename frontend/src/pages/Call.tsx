import { useEffect, useState } from "react";
import "../assets/style/call.css";
import UserToCall from "../ui/call/UserToCall";
import { type User } from "../utils/@types";
import { useAppContext } from "../contexts/AppContext";
import UserToRespond from "../ui/call/UserToRespond";
import VideoCallStore from "../stores/VideoCallStore";
import { BASE_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Call = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { auth } = useAppContext();
  const pendingCalls = VideoCallStore((state) => state.pendingCalls);
  const navigateTo = useNavigate();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch(BASE_URL.concat("/users"), {
          method: "GET",
          mode: "cors",
        });

        if (response.ok) {
          const _users = await response.json();
          setUsers(_users);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getAllUsers();
  }, []);

  return (
    <main>
      <header>
        <Link to="/register" className="button">
          Register
        </Link>
        {auth && (
          <button
            className="button"
            onClick={async () => {
              try {
                const response = await fetch(
                  BASE_URL.concat(`/delete-account/${auth.id}`),
                  {
                    method: "DELETE",
                    mode: "cors",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.ok) {
                  navigateTo("/register");
                  localStorage.removeItem("meeterAuth");
                }
              } catch (e) {
                enqueueSnackbar("An error occurred, please retry !");
              }
            }}
          >
            Delete Account
          </button>
        )}
      </header>
      <div className="center list__calls">
        <ul className="list__users">
          <h2>Call these users</h2>
          {users.map((user) => {
            if (user.id !== auth?.id) {
              return <UserToCall key={user.id} user={user} />;
            }
          })}
        </ul>

        <ul className="list__users">
          <h2>Pick up the phone</h2>
          {pendingCalls.map((call) => {
            const { caller } = call;
            if (caller?.id !== auth?.id) {
              return <UserToRespond key={caller.id} user={caller} />;
            }
          })}
        </ul>
      </div>
    </main>
  );
};

export default Call;
