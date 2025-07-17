import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomWarning } from "../Componenets/BottomWarning";
import { Button } from "../Componenets/Button";
import { Heading } from "../Componenets/Heading";
import { InputBox } from "../Componenets/InputBox";
import { Subheading } from "../Componenets/SubHeading";
//import { AuthContext } from "../authentications/authContext"
export const Signin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const handleSignin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://payment-ez9j.onrender.com/api/v1/user/signin",
        {
          username,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Sign in failed, Please check your credentials and try again");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-cyan-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-cyan-200 w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <Subheading label={"Enter your details to sign in"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
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
          {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
          <div className="pt-4">
            <Button
              onClick={handleSignin}
              label={loading ? "Signing in..." : "Sign in"}
              disabled={loading}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
