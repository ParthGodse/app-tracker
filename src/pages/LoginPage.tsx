// src/pages/LoginPage.tsx
import { Button } from "../components/ui/button";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {FcGoogle} from "react-icons/fc";

const LoginPage = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen !bg-gray-100">
    <div className="!bg-white p-8 shadow-lg rounded-lg w-96 text-center">
      <h1 className="text-3xl font-bold mb-4">Sign in to Your Account</h1>
      <Button onClick={signInWithGoogle} variant="google" className="!flex items-center justify-center space-x-2 w-full py-3 text-white">
        <FcGoogle className="text-xl"/>
        <span>Sign in with Google</span>
      </Button>
    </div>
    </div>
  );
};

export default LoginPage;
