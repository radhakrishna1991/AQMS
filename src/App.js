import React, { useEffect, useState ,Suspense, lazy} from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
import Pagination from "./Pagination";
const Login =lazy(() => import("./Pages/Login"));
const Dashboard =lazy(() => import("./Pages/Dashboard"));
const Profile =lazy(() => import("./Pages/Profile"));
const Parameters =lazy(() => import("./Pages/Parameters"));
const Parameters1 =lazy(() => import("./Pages/Parameters1"));
function App() {
    const [gitHubUsers, setGitHubUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tableRowsPerPage, setTableRowsPerPage] = useState(5);
    const [showlist, setshowlist] = useState(true);
    const [Btntype, setBtntype] = useState("add");
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setlocation] = useState(window.location.pathname);
  
    useEffect(() => {
      fetchUsers();
      getCurrentTableData();
    }, []);
   
    const fetchUsers = () => {
      fetch("https://api.github.com/users")
        .then((response) => response.json())
        .then((data) => setGitHubUsers(data))
        .catch((error) => console.log(error));
    };
    let numberofpages=Math.ceil(gitHubUsers.length / tableRowsPerPage);
    const getCurrentTableData = () => {
      return gitHubUsers.slice(
        currentPage * tableRowsPerPage - tableRowsPerPage,
        currentPage * tableRowsPerPage
      );
    };
  
    const paginateData = (pageNumber,button) => {
        if(button=="prev" && currentPage==1){
            return false;
        }
        if(button=="next" && currentPage==numberofpages){
            return false;
        }
      setCurrentPage(pageNumber);
    };

    const Cleardata=(item)=>{
        setName("");
        setEmail("");
        setPhone("");
    }
    const Setdata=(item)=>{
        setName(item.id);
        setEmail(item.login);
        setPhone(item.login);
    }
    const AddEditData=(type,item)=>{
        setBtntype(type);
        if(type=="add"){
            Cleardata();
        }else if(type=="edit"){
            Setdata(item);
        }
        setshowlist(false);
    }
    const CreateUpdateData=()=>{
        let employeeDetails={ "Name": Name,"Email":Email,"PhoneNumber":phone };
      const requestOptions = {
        method: 'POST',
        body: JSON.stringify(employeeDetails)
    };
    fetch("https://localhost:44319/Employee/InsertEmployeeData",requestOptions)
        .then((response) => response.json())
        .then((data) => setGitHubUsers(data))
        .catch((error) => console.log(error));
        setshowlist(false);
    }

    const CancelData=()=>{
        setshowlist(true);
        Cleardata();
    }
  return (
  <div>
  <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
    {location!="/"?<Header />:""}
    {location!="/"?<Sidenavbar />:""}
  <Suspense fallback={<div>Loading...</div>}>
      <Routes>
      <Route   path="/" exact element={<Login />} />
      <Route   path="/Dashboard" exact element={<Dashboard />} />
      <Route   path="/Profile" exact element={<Profile />} />
      <Route   path="/Parameters" exact element={<Parameters1 />} />
      
      </Routes>
      </Suspense>
  </BrowserRouter>
  </div>
  );
}

export default App;
