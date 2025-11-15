import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthenLayout";
import LoginScreen from "./page/LoginScreen";
import RegisterScreen from "./page/RegisterScreen";
import HomeLayout from "./layouts/HomeLayout";
import HomeScreen from "./page/HomeScreen";
import PackageDetail from "./page/PackageDetail";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
// import { PrivateRoute, PublicRoute } from "./routes/Guard";
import { useLoadUser } from "./hooks/useLoadUser";
import DashboardScreen from "./page/DashboardScreen";
import AdminLayout from "./layouts/AdminLayout";
import UsersScreen from "./page/UsersScreen";
import ProductScreen from "./page/PackageScreen";

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
          <Route path="/register" element={<RegisterScreen />} />
        </Route>

        <Route
          element={
            // <PrivateRoute>
            <HomeLayout />
            // </PrivateRoute>
          }
        >
          {/* <Route path="/" element={<HomeLayout />} />
          <Route path="/home" element={<HomeLayout />} /> */}
          <Route index element={<HomeScreen />} />
          <Route path="/home" element={<HomeScreen />} />

          <Route path="/package/:id" element={<PackageDetail />} />
        </Route>
        <Route element={<AdminLayout />}> 
          <Route path="/admin" element={<DashboardScreen />} />
          <Route path="/admin/dashboard" element={<DashboardScreen />} />
          <Route path="/admin/users" element={<UsersScreen />} />
          <Route path="/admin/products" element={<ProductScreen />} />
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
