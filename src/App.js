import React, {  Suspense, lazy } from "react";
import {  Routes, Route, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
const Login = lazy(() => import("./Pages/Login"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Profile = lazy(() => import("./Pages/Profile"));
const Parameters = lazy(() => import("./Pages/Parameters"));
const AirQuality = lazy(() => import("./Pages/AirQuality"));
const AverageDataReport = lazy(() => import("./Pages/AverageDataReport"));
const StasticsReport = lazy(() => import("./Pages/StasticsReport"));
const StasticsDataReport = lazy(() => import("./Pages/StasticsDataReport"));
const Adduser = lazy(() => import("./Pages/Adduser"));
const AddStation = lazy(() => import("./Pages/AddStation"));
const AddDevice = lazy(() => import("./Pages/AddDevice"));
const AddParameter = lazy(() => import("./Pages/AddParameter"));
const UserLogHistory = lazy(() => import("./Pages/UserLogHistory"));
const PredefinedCharts = lazy(() => import("./Pages/PredefinedCharts"));
const DetailedAnalysisReports = lazy(() => import("./Pages/DetailedAnalysisReports"));
const GsiModbusDrivers = lazy(() => import("./Pages/GsiModbusDrivers"));
const Calibration = lazy(() => import("./Pages/Calibration"));
const AverageAlarm = lazy(() => import("./Pages/AverageAlarm"));
const DataProcessing = lazy(() => import("./Pages/DataProcessing"));
const AppLogHistory = lazy(() => import("./Pages/AppLogHistory"));
const LiveData = lazy(() => import("./Pages/LiveData"));
const DataProcessingClient = lazy(() => import("./Pages/DataProcessingClient"));
const HistoricalData = lazy(() => import("./Pages/HistoricalData"));
const LiveDataReports = lazy(() => import("./Pages/LiveDataReports"));
const DeviceAlarams = lazy(() => import("./Pages/DeviceAlarams"));
const CalibrationDevice=lazy(() => import("./Pages/CalibrationDevice"));
function App() {
  const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  return (
    <div>
      
        {currentUser != null ? <Header /> : ""}
        {currentUser != null ? <Sidenavbar /> : ""}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
          <Route   path="/" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)}  />
          <Route   path="/Login" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
            <Route path="*" exact element={currentUser ==null ? <Login /> : (<Navigate to="/Dashboard" />)} />
            <Route path="/Dashboard" exact element={currentUser !=null ? <Dashboard /> : (<Navigate to="/" />)} />
            <Route path="/Profile" exact element={currentUser !=null ? <Profile />: (<Navigate to="/" />)} />
            <Route path="/AddParameter" exact element={currentUser !=null ? <AddParameter /> : (<Navigate to="/" />)} />
            <Route path="/AirQuality" exact element={currentUser != null ? <AirQuality /> : (<Navigate to="/" />)} />
            <Route path="/AverageDataReport" exact element={currentUser != null ? <AverageDataReport /> : (<Navigate to="/" />)} />
            <Route path="/StatisticalReport" exact element={currentUser != null ? <StasticsReport /> : (<Navigate to="/" />)} />
            <Route path="/StasticsDataReport" exact element={currentUser != null ? <StasticsDataReport /> : (<Navigate to="/" />)} />
            <Route path="/Adduser" exact element={currentUser != null ? <Adduser /> : (<Navigate to="/" />)} />
            <Route path="/AddStation" exact element={currentUser != null ? <AddStation /> : (<Navigate to="/" />)} />
            <Route path="/AddDevice" exact element={currentUser != null ? <AddDevice /> : (<Navigate to="/" />)} />
            <Route path="/CalibrationDevice" exact element={currentUser != null ? <CalibrationDevice /> : (<Navigate to="/" />)} />
            <Route path="/Parameters" exact element={currentUser != null ? <Parameters /> : (<Navigate to="/" />)} />
            <Route path="/UserLogHistory" exact element={currentUser != null ? <UserLogHistory /> : (<Navigate to="/" />)} />
            <Route path="/PredefinedCharts" exact element={currentUser != null ? <PredefinedCharts /> : (<Navigate to="/" />)} />
            <Route path="/DetailedAnalysisReports" exact element={currentUser != null ? <DetailedAnalysisReports /> : (<Navigate to="/" />)} />
            <Route path="/GsiModbusDrivers" exact element={currentUser != null ? <GsiModbusDrivers /> : (<Navigate to="/" />)} />
            <Route path="/Calibrations" exact element={currentUser != null ? <Calibration /> : (<Navigate to="/" />)} />
            <Route path="/AverageAlarm" exact element={currentUser != null ? <AverageAlarm /> : (<Navigate to="/" />)} />
            <Route path="/DataProcessing" exact element={currentUser != null ? <DataProcessing /> : (<Navigate to="/" />)} />
            <Route path="/AppLogHistory" exact element={currentUser != null ? <AppLogHistory /> : (<Navigate to="/" />)} />
            <Route path="/LiveData" exact element={currentUser != null ? <LiveData /> : (<Navigate to="/" />)} />
            <Route path="/DataProcessingClient" exact element={currentUser != null ? <DataProcessingClient /> : (<Navigate to="/" />)} />
            <Route path="/HistoricalData" exact element={currentUser != null ? <HistoricalData /> : (<Navigate to="/" />)} />
            <Route path="/LiveDataReports" exact element={currentUser != null ? <LiveDataReports /> : (<Navigate to="/Login" />)} />
            <Route path="/DeviceAlarams" exact element={currentUser != null ? <DeviceAlarams /> : (<Navigate to="/" />)} />
          </Routes>
        </Suspense>
      {/* </BrowserRouter> */}
    </div>
  );
};

export default App;



