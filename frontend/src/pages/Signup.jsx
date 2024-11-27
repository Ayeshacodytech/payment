import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../Componenets/BottomWarning";
import { Button } from "../Componenets/Button";
import { Heading } from "../Componenets/Heading";
import { InputBox } from "../Componenets/InputBox";
import { Subheading } from "../Componenets/SubHeading";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [username, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          firstName,
          lastName,
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Sign up failed, Please check your credentials and try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-blue-400 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-blue-300 w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <Subheading label={"Enter your details to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder={"John"}
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setlastName(e.target.value);
            }}
            placeholder={"Cena"}
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setuserName(e.target.value);
            }}
            placeholder={"johncena@gmail.com"}
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder={"1234456"}
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={handleSignup}
              label={loading ? "Signing up..." : "Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
