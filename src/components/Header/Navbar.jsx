import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../HeaderCSS/Navbar.css";
import { useSelector } from "react-redux";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
const DesktopNavbar = () => {
  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  console.log(cartItems);
  return (
    <header>
      <div className="logo-brand">
        <NavLink to="/">Thai Chilly China</NavLink>
      </div>
      <nav>
        <ul className="text-centers">
          <li className=" active" title="Home">
            <NavLink exact to="/">
              <GoHome size={30} />
            </NavLink>
          </li>
          <li title="Menu">
            <NavLink to="/menu">
              <MdOutlineRestaurantMenu size={30} />
            </NavLink>
          </li>
          <li title="Cart" className="desktop-cart">
            {cartItems && cartItems.length >= 1 ? (
              <span>{cartItems.length}</span>
            ) : (
              <></>
            )}

            <NavLink to="/cart">
              <IoCartOutline size={30} />
            </NavLink>
          </li>
          <li title="Search">
            <NavLink to="/search">
              <IoSearch size={30} />
            </NavLink>
          </li>

          <li title="Account">
            <NavLink to="/account/profile">
              {user ? (
                <img src={user.avatar && user.avatar.url} alt="pp" />
              ) : (
                <span className="material-symbols-outlined fs-3 mt-2">
                  account_circle
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const MobileNavbar = () => {
  const { cartItems } = useSelector((state) => state.cart);
  return (
    <nav className="navbar">
      <ul>
        <li title="Home">
          <NavLink className="nav-item" exact to="/">
            <GoHome size={30} />
          </NavLink>
        </li>
        <li title="Menu">
          <NavLink className="nav-item" to="/menu">
            <MdOutlineRestaurantMenu size={30} />
          </NavLink>
        </li>
        <li title="Cart" className="mobile-cart">
          {cartItems && cartItems.length >= 1 ? (
            <span>{cartItems.length}</span>
          ) : (
            <></>
          )}
          <NavLink to="/cart">
            <IoCartOutline size={30} />
          </NavLink>
        </li>
        <li title="Account">
          <NavLink className="nav-item" to="/account">
            <VscAccount size={30} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <>{isMobile ? <MobileNavbar /> : <DesktopNavbar />}</>;
};

export default Navbar;
