import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import LoginScreen from "./page/LoginScreen";
import HomeLayout from "./layouts/HomeLayout";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import { PrivateRoute, PublicRoute } from "./routes/Guard";
import { useLoadUser } from "./hooks/useLoadUser";

function App() {
  useLoadUser();
  return (
    <>
      <Routes>
        <Route
          element={
            // <PublicRoute>
            <AuthLayout />
            // </PublicRoute>
          }
        >
          <Route path="/login" element={<LoginScreen />} />
        </Route>

        <Route
          element={
            // <PrivateRoute>
            <HomeLayout />
            // </PrivateRoute>
          }
        >
          <Route path="/" element={<HomeLayout />} />
          <Route path="/home" element={<HomeLayout />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        toastClassName="bg-white shadow-lg rounded-lg p-4 sm:p-5 text-sm sm:text-base"
      />
    </>
  );
}

export default App;
