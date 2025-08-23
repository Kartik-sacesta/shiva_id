import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./App.css";
import Router from "./app/route/route";
import { useValidateTokenQuery } from "./app/services/api/AuthApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLoggedIn } from "./app/redux/features/Auth/AuthSlice";
// import Home from "./pages/Home";
// import About from "./pages/About";

function App() {
  const { isSuccess, isLoading, isError } = useValidateTokenQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess && !isLoading) {
      dispatch(setLoggedIn(true));
    }

    if (isError && !isLoading) {
      dispatch(setLoggedIn(false));
      navigate("/auth-login");
    }
  }, [isSuccess, isLoading, dispatch, isError, navigate]);

  return (
    <>
      <Router />
    </>
  );
}
export default App;
