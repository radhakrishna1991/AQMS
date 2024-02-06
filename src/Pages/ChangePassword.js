
import React from "react";
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs';
import CommonFunctions from "../utils/CommonFunctions";
function ChangePassword() {

    const $ = window.jQuery;
    const user = JSON.parse(sessionStorage.getItem('UserData'));
    const Passwordvalidation = function (Password, NewPassword, ConfirmPassword) {
      let isvalid = true;
      let form = document.querySelectorAll('#ForgotPWD')[0];
      if (Password == "") {
          form.classList.add('was-validated');
          isvalid = false;
      } else if (NewPassword == "") {
        form.classList.add('was-validated');
        isvalid = false;
      } else if (NewPassword.length<8) {
        form.classList.add('was-validated');
        $("#lblPassword")[0].style.display="block";
        isvalid = false;
      } else if (ConfirmPassword == "") {
        form.classList.add('was-validated');
        isvalid = false;
      } else if (NewPassword != ConfirmPassword) {            
          $("#lblbothmatch")[0].style.display="block";            
          isvalid = false;
      }
      return isvalid;
    }

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      let form = document.querySelectorAll('#ForgotPWD')[0];
      let UserId = user.id;
      let Password = document.getElementById("Password").value;
      let NewPassword = document.getElementById("NewPassword").value;
      let ConfirmPassword = document.getElementById("confirmNewPassword").value;
      
      $("#lblbothmatch")[0].style.display="none"; 
      $("#lblPassword")[0].style.display="none";  
      let validation = Passwordvalidation(Password, NewPassword, ConfirmPassword);
      if (!validation) {
          return false;
      }
    
     // NewPassword=await handleEncrypt(NewPassword);
      fetch(CommonFunctions.getWebApiUrl() + 'api/Users/ResetPassword', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          //body: JSON.stringify({ UserName: UserName, Password: Password, NewPassword: NewPassword }),
          body: JSON.stringify({ ID: UserId, Password: Password, NewPassword: NewPassword }),
        }).then((response) => response.json())
          .then((responseJson) => {
            if (responseJson.passwordReset != 'resetfailled') {
              let form = document.querySelectorAll('#ForgotPWD')[0];
                  form.classList.remove('was-validated');
             document.getElementById("Password").value = "";
             document.getElementById("NewPassword").value = "";
             document.getElementById("confirmNewPassword").value = "";
              toast.success('Password Changed Successfully');
            //  window.location.href =process.env.REACT_APP_BASE_URL+ "/Login";
            } else if(responseJson.passwordReset == 'resetfailled'){
              toast.error('Given Password is not valid. Please try again.', {
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
            }else {
              toast.error('Unable to change the password. Please contact adminstrator.', {
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
          }).catch((error) => 
            toast.error('Unable to change the password. Please contact adminstrator.')
            );
  };
  const handleEncrypt = async (password) => {
      // Generate a salt (number of rounds determines the complexity)
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      // Hash the password with the salt
      const encryptedPassword = await bcrypt.hash(password, salt);
      return encryptedPassword ;
  }

  return (
    <main id="main" className="main">
      <div className="container">
    <div className="pagetitle d-flex justify-content-between">
        <h1>Change Password</h1>
      </div>

      <section className="section dashboard">
        <div className="container mt-3">
      <form className="row g-3 mt-3" autoComplete="false" id="ForgotPWD" novalidate>

    <div className="col-12">
      <label htmlFor="yourPassword" className="form-label">Old Password</label>
      <input type="password" name="password" className="form-control" id="Password" placeholder="Enter password" required />
      <div className="invalid-feedback">Please enter your old password</div>
    </div>

    <div className="col-12">
      <label htmlFor="yourNewPassword" className="form-label">New Password</label>
      <input type="password" name="password" className="form-control" id="NewPassword" placeholder="Enter new password" required />
      <div className="invalid-feedback">Please enter your new password</div>
      <div id="lblPassword" style={{display:"none"}} className="invalid-feedback">Password must contain 8 charecters</div>
    </div>
    <div className="col-12">
      <label htmlFor="yourConfirmNewPassword" className="form-label">Confirm New Password</label>
      <input type="password" name="password" className="form-control" placeholder="Enter confirm new password" id="confirmNewPassword" required />
      <div className="invalid-feedback">Please enter Confrim new password</div>                        
      <div id="lblbothmatch" style={{display:"none"}} className="invalid-feedback">New Password and Confirm Password should Match</div>
    </div>
    <div className="col-md-12 text-center">
      <button className="btn btn-primary" onClick={handleSubmit} type="button">Change Password</button>
    </div>
      </form>
      </div>
        </section>
        </div>
        </main>
  );
}
export default ChangePassword;