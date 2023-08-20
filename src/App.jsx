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
import UserTable from './components/Admin/User/UserTable';
import BookTable from './components/Admin/Book/BookTable';
import History from './components/Order/History';
import OrderTable from './components/Admin/Order/OrderTable';
import './App.scss';
import './styles/global.scss';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // console.log("check search Query app", searchQuery);
  return (
    <div className='wrapper'>
      <div className='container'>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className='body-content'>
          <Outlet context={[searchQuery, setSearchQuery]} />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.authentication.isLoading)
  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
      || window.location.pathname === '/'
    ) return;
    const res = await fetchAccount();
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
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order/",
          element: <ProtectedRoute> <OrderPage /> </ProtectedRoute>,
        },
        {
          path: "history/",
          element: <ProtectedRoute> <History /> </ProtectedRoute>,
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
          element: <ProtectedRoute> <UserTable /> </ProtectedRoute>,
        },
        {
          path: "book/",
          element: <ProtectedRoute> <BookTable /></ProtectedRoute>,
        },
        {
          path: "order/",
          element: <ProtectedRoute> <OrderTable /> </ProtectedRoute>,
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
