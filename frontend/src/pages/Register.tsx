import { useState } from "react";
import "../assets/style/register.css";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { lsWrite } from "../lib/ls.io";
import { type User } from "../utils/@types";
import { BASE_URL } from "../utils/constants";
import { enqueueSnackbar } from "notistack";

const Register = () => {
  const navigateTo = useNavigate();

  const [user, setUser] = useState<User>({
    name: "",
    id: "",
  });

  const [request, setRequest] = useState<"idle" | "pending" | "error">("idle");

  const register = async () => {
    try {
      setRequest("pending");

      if (user.name.trim().length === 0 || user.id.trim().length === 0) {
        alert("Please, do submit valid data.");
        setRequest("idle");
        return;
      }

      const response = await fetch(BASE_URL.concat("/register-user"), {
        body: JSON.stringify(user),
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Store the user in localStorage
        lsWrite("meeterAuth", user);
        // Navigate to the list of users
        navigateTo("/");
      }
    } catch (e) {
      setRequest("error");
      enqueueSnackbar("An error occurred, please retry !");
    }
  };

  return (
    <main className="center">
      <div className="register">
        <h2>Register</h2>

        <div className="wrap__input">
          <label htmlFor="id">Username</label>
          <input
            type="text"
            name="name"
            value={user.name}
            placeholder="Enter a name"
            disabled={request === "pending"}
            onChange={(e) => {
              setUser((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
        </div>

        <div className="wrap__input">
          <label htmlFor="id">Public ID</label>
          <input
            type="text"
            name="id"
            value={user.id}
            disabled={request === "pending"}
            placeholder="Click here to generate"
            onClick={() => {
              setUser((prev) => ({ ...prev, id: nanoid() }));
            }}
            readOnly
          />
        </div>

        <button
          type="button"
          disabled={request === "pending"}
          className="submit"
          onClick={register}
        >
          Register
        </button>
      </div>
    </main>
  );
};

export default Register;
