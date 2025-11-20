import { useGSAP } from "@gsap/react";
import gsap, { Expo } from "gsap";
import React, { useRef, useState, useContext } from "react";
import { DataContext } from "../../context/DataProvider";
import { auth, googleProvider } from "../../firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = localStorage.getItem("redirectAfterLogin") || "/";
  // console.log(from)
  const {user, setUser, fetchCart} = useContext(DataContext)

  const gsapcreate = useRef();
  const gsapWel = useRef();
  const gsapLogin = useRef();
  const gsapHii = useRef();

  const [loginX, setloginX] = useState("0%");
  const [loginZ, setloginZ] = useState(10);

  const [hiiX, sethiiX] = useState("0%");
  const [hiiZ, sethiiZ] = useState(10);

  const [createX, setcreateX] = useState("0%");
  const [createZ, setcreateZ] = useState(0);

  const [welX, setwelX] = useState("0%");
  const [welZ, setwelZ] = useState(0);
  const [showLogin, setShowLogin] = useState(true);


  useGSAP(() => {
    gsap.to(gsapLogin.current, {
      x: loginX,
      duration: 1.5,
      zIndex: loginZ,
      ease: "sine.inOut",
    });
  }, [loginX, loginZ]);

  useGSAP(() => {
    gsap.to(gsapHii.current, {
      x: hiiX,
      duration: 1.5,
      zIndex: hiiZ,
      ease: "power3.inOut",
    });
  }, [hiiX, hiiZ]);
  useGSAP(() => {
    gsap.to(gsapcreate.current, {
      x: createX,
      duration: 1.5,
      zIndex: createZ,
      ease: "sine.inOut",
    });
  }, [createX, createZ]);

  useGSAP(() => {
    gsap.to(gsapWel.current, {
      x: welX,
      duration: 1.5,
      zIndex: welZ,
      ease: "power3.inOut",
    });
  }, [welX, welZ]);

  function handleAnimation() {
    setcreateX("100%");
    setcreateZ(20);
    sethiiZ(0);
    setwelX("-100%");
    setwelZ(20);
    setloginZ(0);
    setloginX("100%");
    sethiiX("-100%");
  }

  function handleAnimation2() {
    setloginX("0%");
    setloginZ(20);
    setwelZ(0);
    sethiiX("0%");
    sethiiZ(20);
    setcreateZ(0);
    setcreateX("0%");
    setwelX("0%");
  }

  // function GlowingButton() {
  //   return (
  //     <button
  //       className=" border-blue-500 border-4 w-[35%] text-blue-500 font-bold py-2 px-4 rounded-xl transition duration-1000 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_5px_rgba(59,130,246,1)] hover:bg-blue-700 hover:text-white hover:border-blue-700"
  //       onClick={handleAnimation}
  //     >
  //       SIGN UP
  //     </button>
  //   );
  // }
  // function GlowingButton2() {
  //   return (
  //     <button
  //       className=" border-blue-500 border-4 w-[35%] text-blue-500 font-bold py-2 px-4 rounded-xl transition duration-1000 ease-in-out transform hover:scale-105 hover:shadow-[0_0_15px_5px_rgba(59,130,246,1)] hover:bg-blue-700 hover:text-white hover:border-blue-700"
  //       onClick={handleAnimation2}
  //     >
  //       SIGN IN
  //     </button>
  //   );
  // }
 
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const res = await fetch(apiUrl + "/api/user/firebase-login",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token}),
        credentials: "include",
      });

      const data = await res.json();
      // console.log(data)
      setUser(data)
      // fetchCart()
       localStorage.removeItem("redirectAfterLogin");
       navigate(from);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const [UserVal, setUserVal] = useState("user");
  function handlefunction() {
    UserVal === "" ? "user" : UserVal;
  }

  const [createFormData, setCreateFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    errFields: "",
    errUsername: "",
    errEmail: "",
  });

  const handleCreateChange = (e) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
    setErrorMessage({
      errFields: "",
      errUsername: "",
      errEmail: "",
    });
  };
  // console.log(createFormData);

  const handleSubmitCreate = async (e) => {
    e.preventDefault();

    if (
      !createFormData.username ||
      !createFormData.email ||
      !createFormData.password
    ) {
      return setErrorMessage({ errFields: "please fill all fields" });
    }

    try {
      //response is a object that contains http response, including status, header, and data returned by server
      const response = await fetch(
         apiUrl + "/api/user/createUser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createFormData),
        }
      );
      const result = await response.json();
      // console.log("success", result);
      if (!response.ok) {
        setErrorMessage({
          ...errorMessage,
          errUsername: result.errusername,
          errEmail: result.erremail,
        });
      } else {
         setUser(result)
        localStorage.removeItem("redirectAfterLogin");
       navigate(from);
      }
    } catch (error) {
      console.log("error", error);
    }

    setCreateFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  const [loginFormData, setLoginFormData] = useState({
    loginId: "",
    password: "",
  });
  const [errorMessage1, setErrorMessage1] = useState({
    errLoginFields: "",
    errLogin: "",
  });
  const handleLoginChange = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
    setErrorMessage1({
      errLoginFields: "",
      errLogin: "",
    });
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    if (!loginFormData.loginId || !loginFormData.password) {
      return setErrorMessage1({ errLoginFields: "please fill all fields" });
    }

    try {
      //response is a object that contains http response, including status, header, and data returned by server
      const response = await fetch( apiUrl + "/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
        credentials: "include",
      });
      const result = await response.json();
      // console.log("success", result);
      if (!response.ok) {
        setErrorMessage1({ errLogin: result.message });
        setLoginFormData({
          loginId: "",
          password: "",
        });
      } else {
        setUser(result)
        localStorage.removeItem("redirectAfterLogin");
       navigate(from);
      }
    } catch (error) {
      console.log("error", error);
    }
    setLoginFormData({
      loginId: "",
      password: "",
    });
  };

  return (
<>
  <div className="min-h-screen w-full flex justify-center items-center bg-slate-900 py-10">

    <div className="w-[95vw] md:w-[80vw] lg:w-[50vw] bg-white rounded-2xl shadow-xl overflow-hidden">

      {/* Header Tabs */}
      <div className="flex w-full bg-gray-200">
        <button
          onClick={() => setShowLogin(true)}
          className={`w-1/2 py-3 text-lg font-semibold transition ${
            showLogin ? "bg-white" : "bg-gray-200"
          }`}
        >
          Sign In
        </button>

        <button
          onClick={() => setShowLogin(false)}
          className={`w-1/2 py-3 text-lg font-semibold transition ${
            !showLogin ? "bg-white" : "bg-gray-200"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* FULL WIDTH FORM PANEL */}
      <div className="p-8">

        {/* ================= SIGN IN ================ */}
        {showLogin && (
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-gray-200 p-3 rounded-lg hover:ring"
            >
              <i className="ri-google-fill text-xl" />
              Login with Google
            </button>

            <p className="text-center mt-5">Login with Username / Email</p>

            <input
              type="text"
              placeholder="Enter Username/Email"
              name="loginId"
              className="w-full bg-gray-200 p-3 rounded-lg mt-4"
              value={loginFormData.loginId}
              onChange={handleLoginChange}
            />

            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="w-full bg-gray-200 p-3 rounded-lg mt-4"
              value={loginFormData.password}
              onChange={handleLoginChange}
            />

            {errorMessage1.errLoginFields && (
              <p className="text-red-500 text-center mt-3">
                {errorMessage1.errLoginFields}
              </p>
            )}

            {errorMessage1.errLogin && (
              <p className="text-red-500 text-center mt-1">
                {errorMessage1.errLogin}
              </p>
            )}

            <button
              onClick={handleSubmitLogin}
              className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:scale-105 transition"
            >
              SIGN IN
            </button>
          </div>
        )}

        {/* ================= SIGN UP ================ */}
        {!showLogin && (
          <div className="w-full">
            <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 bg-gray-200 p-3 rounded-lg hover:ring"
            >
              <i className="ri-google-fill text-xl" />
              Continue with Google
            </button>

            <p className="text-center mt-5">Register With Email</p>

            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              className="w-full bg-gray-200 p-3 rounded-lg mt-4"
              value={createFormData.username}
              onChange={handleCreateChange}
            />

            {errorMessage.errUsername && (
              <p className="text-red-500 text-right">{errorMessage.errUsername}</p>
            )}

            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              className="w-full bg-gray-200 p-3 rounded-lg mt-4"
              value={createFormData.email}
              onChange={handleCreateChange}
            />

            {errorMessage.errEmail && (
              <p className="text-red-500 text-right">{errorMessage.errEmail}</p>
            )}

            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="w-full bg-gray-200 p-3 rounded-lg mt-4"
              value={createFormData.password}
              onChange={handleCreateChange}
            />

            {errorMessage.errFields && (
              <p className="text-red-500 text-center mt-2">
                {errorMessage.errFields}
              </p>
            )}

            <button
              onClick={handleSubmitCreate}
              className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:scale-105 transition"
            >
              SIGN UP
            </button>
          </div>
        )}

      </div>
    </div>
  </div>
</>

  );
};

export default LoginPage;
