import React from "react";
import { BrowserRouter as Router , Routes , Route } from "react-router-dom"; 
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Overview from "./pages/Mapping/Overview";
import AddSem from "./pages/Mapping/AddSem";



const routes = (
  <Router>
    <Routes>
      <Route path="/login" exact element={<Login/>}/>
      <Route path="/register" exact element={<SignUp/>}/>
      <Route path="/dashboard" exact element={<Dashboard/>}>
        <Route path="overview" exact element={<Overview/>}/>
        <Route path="addSem" exact element={<AddSem/>}/>
      </Route> 
    </Routes>
  </Router>
);


const App = () => {
  return (
    <>
      {routes}
    </>
  );
};

export default App;
