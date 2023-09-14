
import React from "react";
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import CommonFunctions from "../utils/CommonFunctions";
function ForgotPassword() {
    const $ = window.jQuery;

    

      const handleSubmit = async(event) => {
        let form = document.querySelectorAll('#ForgotPWD')[0];
        let UserName = document.getElementById("UserName").value;
        let domainurl = window.location.origin + "/";
        if (!form.checkValidity()) {
            form.classNameList.add('was-validated');
        } else {
            fetch(CommonFunctions.getWebApiUrl() + 'api/Users/ForgotPassword', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ UserName: UserName, domainURL: domainurl}),
              }).then((response) => response.json())
                  .then((data) => {
                    if(data!=null){
                        toast.success('Mail sent to the given mail id.please check');
                        window.location.href =process.env.REACT_APP_BASE_URL+ "/Login";
                    }
                    else {
                        toast.error('Given User Name or Mail is not valid. Please try again', {
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
                  }).catch((error) => toast.error('Unable to connect Database. Please contact adminstrator'));
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
                      <h5 className="card-title text-center pb-0 fs-4">Forgot Password</h5>
                      {/* <p className="text-center small">Enter your username & password to login</p> */}
                    </div>

                    <form className="row g-3" autoComplete="false" id="ForgotPWD" novalidate>

                      <div className="col-12">
                        <label htmlFor="yourUsername" className="form-label">User Name</label>
                        <div className="input-group has-validation">
                          <span className="input-group-text" id="inputGroupPrepend">@</span>
                          <input type="text" name="username" className="form-control required" id="UserName" required />
                          <div className="invalid-feedback">Please enter your username.</div>
                        </div>
                      </div>

                    
                      <div className="col-6">
                        <button className="btn btn-primary w-100" onClick={handleSubmit} type="button">Submit</button>
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
export default ForgotPassword;