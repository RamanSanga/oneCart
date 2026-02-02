import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Registration from "./Pages/Registration.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Contact from "./Pages/Contact.jsx";
import Collections from "./Pages/Collections.jsx";
import About from "./Pages/About.jsx";
import Product from "./Pages/Product.jsx";
import Nav from "./component/Nav.jsx";
import ProductDetail from "./Pages/ProductDetail.jsx";
import Cart from "./Pages/Cart.jsx";
import PlaceOrder from "./Pages/PlaceOrder.jsx";
import OrderSuccess from "./Pages/OrderSuccess";
import Order from "./Pages/Order.jsx";
import Account from "./Pages/Account.jsx";
import Wishlist from "./Pages/Wishlist";
import NotFound from "./Pages/NotFound";
import Ai from "./component/Ai.jsx";

import { userDataContext } from "./context/UserContext.jsx";
import { authDataContext } from "./Context/authContext.jsx";

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <>
      {userData && <Nav />}

      <Routes>
        <Route
          path="/login"
          element={userData ? <Navigate to="/" /> : <Login />}
        />

        <Route
          path="/signup"
          element={userData ? <Navigate to="/" /> : <Registration />}
        />

        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/about"
          element={userData ? <About /> : <Navigate to="/login" />}
        />

        <Route
          path="/contact"
          element={userData ? <Contact /> : <Navigate to="/login" />}
        />

        <Route
          path="/collection"
          element={userData ? <Collections /> : <Navigate to="/login" />}
        />

        <Route
          path="/product"
          element={userData ? <Product /> : <Navigate to="/login" />}
        />

        <Route
          path="/productdetail/:id"
          element={userData ? <ProductDetail /> : <Navigate to="/login" />}
        />

        <Route
          path="/cart"
          element={userData ? <Cart /> : <Navigate to="/login" />}
        />

        <Route
          path="/placeorder"
          element={userData ? <PlaceOrder /> : <Navigate to="/login" />}
        />

        <Route
          path="/ordersuccess"
          element={userData ? <OrderSuccess /> : <Navigate to="/login" />}
        />

        <Route
          path="/orders"
          element={userData ? <Order /> : <Navigate to="/login" />}
        />

        <Route
          path="/account"
          element={userData ? <Account /> : <Navigate to="/login" />}
        />

        <Route
          path="/wishlist"
          element={userData ? <Wishlist /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Ai />
    </>
  );
}

export default App;
