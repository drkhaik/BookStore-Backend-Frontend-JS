import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { fetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfoUserAction } from './redux/authentication/authenticationSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin';
import OrderPage from './pages/order';


const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}


// const LayoutAdmin = () => {
//   const isAdminRoute = window.location.pathname.startsWith('/admin');
//   const user = useSelector(state => state.authentication.user);
//   const userRole = user.role;

//   return (
//     <>
//       <div className='layout-app'>
//         {isAdminRoute && userRole === 'ADMIN' && <Header />}
//         {/* <Header /> */}
//         <Outlet />
//         <LayoutAdmin />
//         {/* <Footer /> */}
//         {isAdminRoute && userRole === 'ADMIN' && <Footer />}
//       </div>
//     </>
//   )
// }

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.authentication.isLoading)
  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) return;
    const res = await fetchAccount();
    // console.log("check res", res)
    dispatch(fetchInfoUserAction(res.data.user))
  }

  useEffect(() => {
    getAccount();

  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact/",
          element: <ContactPage />,
        },
        {
          path: "book/",
          element: <BookPage />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user/",
          element: <ContactPage />,
        },
        {
          path: "book/",
          element: <BookPage />,
        },
        {
          path: "order/",
          element: <OrderPage />,
        },
      ],
    },
    {
      path: "login/",
      element: <LoginPage />,
    },
    {
      path: "register/",
      element: <RegisterPage />,
    },
  ]);


  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  );
}
