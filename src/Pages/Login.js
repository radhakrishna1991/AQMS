import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import bcrypt from 'bcryptjs';
import CommonFunctions from "../utils/CommonFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

//function Login() {

const Login = ({ handleAuthentication }) => {
  //const Navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("rememberedUsername");
    const storedPassword = localStorage.getItem("rememberedPassword");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e) => {
    // debugger;
    e.preventDefault();
    setLoading(true);
    if (rememberMe) {
      localStorage.setItem("rememberedUsername", username);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
    let form = document.querySelectorAll("#Loginform")[0];
    let UserName = document.getElementById("UserName").value;
    let Password = document.getElementById("Password").value;
    //const token = jwt.sign({ userId: 'JWTAuthenticationServer' }, 'Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Hdx', { expiresIn: '1h' });

    //Password=await handleEncrypt(Password);
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
    } else {
      fetch(CommonFunctions.getWebApiUrl() + "api/Users/Login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserName: UserName, Password: Password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data != null && data.users != null) {
            sessionStorage.setItem("UserData", JSON.stringify(data.users[0]));
            sessionStorage.setItem("Token", data.token);
            var currentDate = new Date();
            currentDate.setMinutes(
              currentDate.getMinutes() + data.tokenExpirationTime - 1
            );
            sessionStorage.setItem("TokenExpTime", currentDate);
            window.location.href =
              process.env.REACT_APP_BASE_URL + "/Dashboard";
          } else {
            toast.error(
              "User name or password is incorrect. Please try again",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              }
            );
            setLoading(false);
            return false;
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            "Unable to connect Database. Please contact adminstrator"
          );
        });
    }
  };

  /* const handleEncrypt = async (password) => {

    // Generate a salt (number of rounds determines the complexity)
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    
    // Hash the password with the salt
    const encryptedPassword = await bcrypt.hash(password, salt);

    return encryptedPassword ;
  } */
  const forgotPassword = () => {
    window.location.href = process.env.REACT_APP_BASE_URL + "/ForgotPassword";
  };

  const redirectToReset = () => {
    window.location.href = process.env.REACT_APP_BASE_URL + "/ResetPassword";
  };
  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-3">
                  <a
                    href="index.html"
                    className="logo d-flex align-items-center w-auto"
                  >
                    <img src="images/logo.png" alt="" />
                    {/*  <span className="d-none d-lg-block">NiceAdmin</span> */}
                  </a>
                </div>

                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      <p className="text-center small">
                        Enter your username & password to login
                      </p>
                    </div>

                    <form
                      className="row g-3"
                      autoComplete="false"
                      id="Loginform"
                      onSubmit={handleLogin}
                    >
                      <div className="col-12">
                        <label htmlFor="yourUsername" className="form-label">
                          Username
                        </label>
                        <div className="input-group has-validation">
                          <span
                            className="input-group-text"
                            id="inputGroupPrepend"
                          >
                            @
                          </span>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            id="UserName"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                          />
                          <div className="invalid-feedback">
                            Please enter your username.
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="yourPassword" className="form-label">
                          Password
                        </label>
                        <div>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            className="form-control"
                            id="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span
                            className="password-toggle-icon"
                            onClick={togglePasswordVisibility}
                          >
                            <FontAwesomeIcon
                              icon={passwordVisible ? faEyeSlash : faEye}
                            />
                          </span>
                        </div>
                        <div className="invalid-feedback">
                          Please enter your password!
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="remember"
                            value="true"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      {/*  <div className="col-6" style={{textAlign:"right"}}>
                        <a className="form-check-label" style={{cursor:"pointer"}} onClick={redirectToReset}>Reset Password</a>
                      </div> */}
                      <div className="col-12">
                        <button className="btn btn-primary w-100" type="submit">
                          {loading ? (
                            <span className="spinner-border text-light spinner-border-sm"></span>
                          ) : (
                            "Login"
                          )}
                        </button>
                      </div>
                      {/* <div className="col-6">
                         <a className="form-check-label" style={{cursor:"pointer"}} onClick={forgotPassword}>Forgot Password?</a>
                      </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
export default Login;
