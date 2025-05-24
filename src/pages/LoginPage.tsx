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

//   return (
//     <div className="flex items-center justify-center min-h-screen !bg-gray-100">
//     <div className="!bg-white p-8 shadow-lg rounded-lg w-96 text-center">
//       <h1 className="text-3xl font-bold mb-4 text-black">Sign in to Your Account</h1>
//       <Button onClick={signInWithGoogle} variant="google" className="!flex items-center justify-center space-x-2 w-full py-3 text-white">
//         <FcGoogle className="text-xl"/>
//         <span>Sign in with Google</span>
//       </Button>
//     </div>
//     </div>
//   );
// };
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div className="bg-white dark:bg-gray-800 p-8 shadow-xl rounded-xl w-full max-w-sm text-center transition-colors">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Sign in to Your Account
      </h1>
      
      <Button
        onClick={signInWithGoogle}
        variant="google"
        className="w-full flex items-center justify-center gap-3 py-3 text-gray-400 hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition"
      >
        <FcGoogle className="text-2xl" />
        <span className="font-medium">Sign in with Google</span>
      </Button>
    </div>
  </div>
  );
};

export default LoginPage;
