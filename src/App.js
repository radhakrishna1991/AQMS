import React, {  useState, Suspense, lazy } from "react";
import { Navigate,useNavigate, useRoutes } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import Header from './Layouts/Header';
import Sidenavbar from "./Layouts/Sidenavbar";
import Pagination from "./Pagination";
import { LayoutCssClasses } from "ag-grid-community";
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
const App = () => {
 // const currentUser = JSON.parse(sessionStorage.getItem('UserData'));
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleAuthentication = (isAuthenticated) => {
    setAuthenticated(isAuthenticated);
    navigate('Dashboard');
  };

  const routes = [
    {
      path: '/',
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Login handleAuthentication={handleAuthentication} />
        </Suspense>
      ),
     
    },
    {
      path: 'Dashboard',
      element: authenticated ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Sidenavbar />
          <Dashboard />
        </Suspense>
      ) : (
        <Navigate to="/Login" />
      )
      
    },
    {
      path: 'Profile',
      element: authenticated ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Sidenavbar />
          <Profile />
        </Suspense>
      ) : (
        <Navigate to="/Login" />
      )
      
    },
    {
      path: 'Parameters',
      element: authenticated ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Header />
          <Sidenavbar />
          <Parameters />
        </Suspense>
      ) : (
        <Navigate to="/Login" />
      )
      
    },
    {
      path: 'AirQuality',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AirQuality /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AverageDataReport',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AverageDataReport /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'StatisticalReport',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><StasticsReport /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'StasticsDataReport',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><StasticsDataReport /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'Adduser',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><Adduser /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AddStation',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AddStation /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AddDevice',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AddDevice /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AddParameter',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AddParameter /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'UserLogHistory',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><UserLogHistory /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'PredefinedCharts',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><PredefinedCharts /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'DetailedAnalysisReports',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><DetailedAnalysisReports /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'GsiModbusDrivers',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><GsiModbusDrivers /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'Calibrations',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><Calibration /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AverageAlarm',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AverageAlarm /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'DataProcessing',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><DataProcessing /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'AppLogHistory',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><AppLogHistory /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'LiveData',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><LiveData /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'DataProcessingClient',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><DataProcessingClient /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'HistoricalData',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><HistoricalData /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'LiveDataReports',
      element: authenticated ? (<Suspense fallback={<div>Loading...</div>}><Header /><Sidenavbar /><LiveDataReports /></Suspense>) : (<Navigate to="/Login" />)
    },
    {
      path: 'Login',
      element: ( <Suspense fallback={<div>Loading...</div>}><Login handleAuthentication={handleAuthentication} /></Suspense>)
    },
  ];

 

  const routeResult = useRoutes(routes);

  return (
    <div>
      {routeResult}
    </div>
  );
};

export default App;



