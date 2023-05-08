import React, { useEffect, useState ,Suspense, lazy} from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
import Pagination from "./Pagination";
const Login =lazy(() => import("./Pages/Login"));
const Dashboard =lazy(() => import("./Pages/Dashboard"));
const Profile =lazy(() => import("./Pages/Profile"));
const Parameters =lazy(() => import("./Pages/Parameters"));
const AirQuality =lazy(() => import("./Pages/AirQuality"));
const DataReport=lazy(() => import("./Pages/DataReport"));
const StasticsReport=lazy(() => import("./Pages/StasticsReport"));
const Adduser=lazy(() => import("./Pages/Adduser"));
const AddStation=lazy(() => import("./Pages/AddStation"));
const AddDevice=lazy(() => import("./Pages/AddDevice"));
const AddParameter=lazy(() => import("./Pages/AddParameter"));
const UserLogHistory=lazy(() => import("./Pages/UserLogHistory"));
const PredefinedCharts=lazy(() => import("./Pages/PredefinedCharts"));
const DetailedAnalysisReports=lazy(() => import("./Pages/DetailedAnalysisReports"));
const GsiModbusDrivers=lazy(() => import("./Pages/GsiModbusDrivers"));
const Calibration=lazy(()=> import("./Pages/Calibration"));

function App() {
    const [location, setlocation] = useState(window.location.pathname);
    
  return (
  <div>
  <BrowserRouter basename={process.env.REACT_APP_BASE_URL}> 
    <ToastContainer />
    {location!="/"?<Header />:""}
    {location!="/"?<Sidenavbar />:""}
  <Suspense fallback={<div>Loading...</div>}>
      <Routes>
      <Route   path="/" exact element={<Login />} />
      <Route   path="/Dashboard" exact element={<Dashboard />} />
      <Route   path="/Profile" exact element={<Profile />} />
      <Route   path="/Parameters" exact element={<Parameters />} />
      <Route   path="/AirQuality" exact element={<AirQuality />} />
      <Route   path="/DataReport" exact element={<DataReport />} />
      <Route   path="/StatisticalReport" exact element={<StasticsReport />} />
      <Route   path="/Adduser" exact element={<Adduser />} />
      <Route   path="/AddStation" exact element={<AddStation />} />
      <Route   path="/AddDevice" exact element={<AddDevice />} />
      <Route   path="/AddParameter" exact element={<AddParameter />} />
      <Route   path="/UserLogHistory" exact element={<UserLogHistory />} />
      <Route   path="/PredefinedCharts" exact element={<PredefinedCharts />} />
      <Route   path="/DetailedAnalysisReports" exact element={<DetailedAnalysisReports />} />
      <Route   path="/GsiModbusDrivers" exact element={<GsiModbusDrivers />} />
      <Route   path="/Calibrations"  exact element={<Calibration />}/>
      </Routes>
      </Suspense>
  </BrowserRouter>
  </div>
  );
}

export default App;
