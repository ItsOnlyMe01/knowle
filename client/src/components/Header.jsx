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
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
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
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-textSecondary hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646A9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3"
          />
        </svg>
      )}
    </button>
  );
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownContainerRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  useOnClickOutside(dropdownContainerRef, () => setOpenDropdown(null));

  const toggleDropdown = (category) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeMenus = () => {
    setIsDrawerOpen(false);
    setOpenDropdown(null);
  };

  const navStructure = useMemo(
    () =>
      [
        {
          category: t("header.growth"),
          condition: user,
          links: [
            {
              to: "/skill-trees",
              label: t("header.skillTrees"),
              condition: user,
            },
            { to: "/projects", label: t("header.projects"), condition: user },
            {
              to: "/leaderboard",
              label: t("header.leaderboard"),
              condition: user,
            },
          ],
        },
      ].filter((item) => item.condition),
    [t, user, i18n.language],
  );

  const renderNavLinks = (isMobile = false) => (
    <>
      <NavLink to="/" onClick={closeMenus}>
        {t("header.home")}
      </NavLink>

      {navStructure.map((item) => (
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
                    <NavLink to={link.to} onClick={closeMenus}>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );

  return (
    <header className="bg-surface shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/">Knowle</Link>

        <div ref={dropdownContainerRef}>{renderNavLinks()}</div>

        {user ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
