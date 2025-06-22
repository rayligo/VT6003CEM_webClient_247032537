import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import * as AuthService from "./services/auth.service";
import UserT from "./types/user.type";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import FlightListApi from "./components/FlightListApi";
import About from "./components/About";
import DetailArticle from "./components/DetailArticle";
import Profile from "./components/Profile";
import FavPage from "./components/favpage";
import HotelListApi from "./components/HotelListApi";
import Copyright from "./components/Copyright";
import logo from "./assets/Wanderlust_Travelsmall.png";
import hotelIcon from "./assets/hotel_icon.png";
import aboutIcon from "./assets/about_icon.png";
import loginIcon from "./assets/login.png";
import RegisterIcon from "./assets/register.png";
import manageHotelsIcon from "./assets/manage_hotels_icon.png";
import adminIcon from "./assets/admin_icon.png";
import flightIcon from "./assets/flight_icon.png";
import PackageListIcon from "./assets/travel_package_icon.png";

import {
  HomeOutlined,
  HeartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import ManageHotels from "./components/ManageHotels";
import HotelAgentsAdmin from "./components/HotelAgentsAdmin";
import PackageList from "./components/PackageList";

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserT | undefined>(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <Router>
      <div className="flex">
        <div className="w-64 bg-gray-800 text-white h-screen p-4">
          <div className="mb-6">
            <img src={logo} alt="Logo" className="h-10 mb-4" />
            <h1 className="text-2xl font-bold">Wanderlust</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                >
                  <HomeOutlined className="mr-2" />
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/flightListApi"
                  className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                >
                  <img src={hotelIcon} alt="Hotel" className="h-5 w-5 mr-1" />
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/hotellistapi"
                  className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                >
                  <img src={flightIcon} alt="Hotel" className="h-5 w-5 mr-1" />
                  Flights
                </Link>
              </li>
              <li>
                <Link
                  to="/PackageList"
                  className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                >
                  <img
                    src={PackageListIcon}
                    alt="Hotel"
                    className="h-5 w-5 mr-1"
                  />
                  PackageList
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                >
                  <img src={aboutIcon} alt="About" className="h-5 w-5 mr-1" />
                  About
                </Link>
              </li>
              {currentUser && (
                <>
                  <li>
                    <Link
                      to="/favpage"
                      className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                    >
                      <HeartOutlined className="mr-2" />
                      Favorites
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                    >
                      <UserOutlined className="mr-2" />
                      Profile
                    </Link>
                  </li>
                  {currentUser.role === "admin" && (
                    <>
                      <li>
                        <Link
                          to="/manage-hotels"
                          className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                        >
                          <img
                            src={manageHotelsIcon}
                            alt="Manage Hotels"
                            className="h-5 w-5 mr-1"
                          />
                          Manage Hotels
                        </Link>
                      </li>

                      <li>
                        <Link
                          to="/hotel-agents-admin"
                          className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                        >
                          <img
                            src={adminIcon}
                            alt="Hotel Agents Admin"
                            className="h-5 w-5 mr-1"
                          />
                          Hotel Agents Admin
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <button
                      onClick={() => {
                        AuthService.logout();
                        setCurrentUser(undefined);
                      }}
                      className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                    >
                      <LogoutOutlined className="mr-2" />
                      Logout
                    </button>
                  </li>
                </>
              )}
              {!currentUser && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                    >
                      <img
                        src={loginIcon}
                        alt="Login"
                        className="h-5 w-5 mr-1"
                      />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="w-full text-left py-2 px-4 rounded hover:bg-indigo-700 hover:text-white block flex items-center"
                    >
                      <img
                        src={RegisterIcon}
                        alt="Register"
                        className="h-5 w-5 mr-1"
                      />
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/:aid" element={<DetailArticle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favpage" element={<FavPage />} />
            <Route path="/hotellistapi" element={<HotelListApi />} />
            <Route path="/flightListApi" element={<FlightListApi />} />
            <Route path="/manage-hotels" element={<ManageHotels />} />
            <Route path="/hotel-agents-admin" element={<HotelAgentsAdmin />} />
            <Route path="/PackageList" element={<PackageList />} />
          </Routes>
          <Copyright />
        </div>
      </div>
    </Router>
  );
}
