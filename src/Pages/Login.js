
import React, { Component } from "react";
import { useNavigate, redirect } from "react-router-dom";
import { toast } from 'react-toastify';
function Login() {

  const Navigate = useNavigate();
  const handleLogin = (event) => {
    let form = document.querySelectorAll('#Loginform')[0];
    let UserName = document.getElementById("UserName").value;
    let Password = document.getElementById("Password").value;
    if (!form.checkValidity()) {
      form.classNameList.add('was-validated');
    } else {
      fetch(process.env.REACT_APP_WSurl + 'api/Users/Login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ UserName: UserName, Password: Password }),
      }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson != null) {
            sessionStorage.setItem("UserData", JSON.stringify(responseJson[0]));
            window.location.href = "/Dashboard";
          } else {
            toast.error('User name or password is incorrect. Please try again', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            return false;
          }
        }).catch((error) => toast.error('User name or password is incorrect. Please try again'));
    }
  }

  return (
    <main>
      <div className="container">

        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                <div className="d-flex justify-content-center py-3">
                  <a href="index.html" className="logo d-flex align-items-center w-auto">
                    <img src="images/logo.png" alt="" />
                    {/*  <span className="d-none d-lg-block">NiceAdmin</span> */}
                  </a>
                </div>

                <div className="card mb-3">

                  <div className="card-body">

                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                      <p className="text-center small">Enter your username & password to login</p>
                    </div>

                    <form className="row g-3" autoComplete="false" id="Loginform" novalidate>

                      <div className="col-12">
                        <label htmlFor="yourUsername" className="form-label">Username</label>
                        <div className="input-group has-validation">
                          <span className="input-group-text" id="inputGroupPrepend">@</span>
                          <input type="text" name="username" className="form-control required" id="UserName" required />
                          <div className="invalid-feedback">Please enter your username.</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="yourPassword" className="form-label">Password</label>
                        <input type="password" name="password" className="form-control" id="Password" required />
                        <div className="invalid-feedback">Please enter your password!</div>
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                          <label className="form-check-label" for="rememberMe">Remember me</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100" onClick={handleLogin} type="button">Login</button>
                      </div>
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
}
export default Login;