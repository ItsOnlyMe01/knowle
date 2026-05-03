import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Button from "./Button";
import Notifications from "./Notifications";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext.jsx";

// Click outside hook
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
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-textSecondary hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownContainerRef = useRef(null);

  useOnClickOutside(dropdownContainerRef, () => setOpenDropdown(null));

  const toggleDropdown = (category) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const closeMenus = () => {
    setOpenDropdown(null);
  };

  // SAME structure, just safe
  const navStructure = useMemo(
    () =>
      [
        {
          category: t("header.growth"),
          condition: user,
          links: [
            { to: "/projects", label: t("header.projects"), condition: user },
          ],
        },
      ].filter((item) => item.condition),
    [t, user, i18n.language],
  );

  const renderNavLinks = () => (
    <>
      {/* Home */}
      <NavLink
        to="/"
        onClick={closeMenus}
        className="px-3 py-2 rounded-md text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/10"
      >
        {t("header.home")}
      </NavLink>

      {/* Dropdown */}
      {(navStructure || []).map((item) => (
        <div key={item.category} className="relative">
          <button
            onClick={() => toggleDropdown(item.category)}
            className="px-3 py-2 rounded-md text-sm font-medium text-textSecondary hover:text-primary hover:bg-primary/10 flex items-center"
          >
            {item.category}
          </button>

          {openDropdown === item.category && (
            <ul className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg z-20 py-1">
              {(item.links || [])
                .filter((link) => link.condition)
                .map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm text-textSecondary hover:text-primary hover:bg-gray-100"
                    >
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
    <header className="bg-surface shadow-md sticky top-0 z-30">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          Knowle
        </Link>

        {/* Center nav */}
        <div className="flex items-center space-x-2" ref={dropdownContainerRef}>
          {renderNavLinks()}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Notifications />
              <Button onClick={logout} variant="outline">
                {t("header.logout")}
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>{t("header.login")}</Button>
            </Link>
          )}
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default Header;
