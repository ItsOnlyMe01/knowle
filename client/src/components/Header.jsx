import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button";
import Notifications from "./Notifications";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext.jsx";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownContainerRef = useRef(null);
  useOnClickOutside(dropdownContainerRef, () => setOpenDropdown(null));

  const toggleDropdown = (category) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const closeMenus = () => {
    setIsDrawerOpen(false);
    setOpenDropdown(null);
  };

  const navStructure = useMemo(
    () =>
      [
        {
          category: "Growth",
          condition: user,
          links: [{ to: "/projects", label: "Projects", condition: user }],
        },
      ].filter((item) => item.condition),
    [user],
  );

  const renderNavLinks = () => (
    <>
      <NavLink to="/">Home</NavLink>

      {(navStructure || []).map((item) => (
        <div key={item.category}>
          <button onClick={() => toggleDropdown(item.category)}>
            {item.category}
          </button>

          {openDropdown === item.category && (
            <ul>
              {(item.links || [])
                .filter((link) => link.condition)
                .map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to}>{link.label}</NavLink>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );

  return (
    <header>
      <nav>
        <Link to="/">Knowle</Link>

        <div ref={dropdownContainerRef}>{renderNavLinks()}</div>

        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
