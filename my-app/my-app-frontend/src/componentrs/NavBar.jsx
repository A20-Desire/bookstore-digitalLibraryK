import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "./Login";
import Logout from "./Logout";
import { useAuth } from "../context/Authprovider";
import LanguageSwitcher from "./LanguageSwitcher";

function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = useMemo(() => {
    const items = [
      { to: "/", label: t("nav.home"), auth: false },
      { to: "/about", label: t("nav.about"), auth: false },
      { to: "/contact", label: t("nav.contact"), auth: false },
      { to: "/translate", label: t("nav.translate"), auth: false },
    ];

    if (isAuthenticated) {
      items.splice(1, 0, { to: "/books", label: t("nav.books"), auth: true });
      items.push({ to: "/community", label: t("nav.community"), auth: true });
      items.push({ to: "/search", label: t("nav.search"), auth: true });
    }

    if (user?.role === "admin") {
      items.push({ to: "/admin", label: t("nav.admin"), auth: true });
      items.push({ to: "/analytics", label: t("nav.analytics"), auth: true });
    } else if (user?.role === "moderator") {
      items.push({ to: "/analytics", label: t("nav.analytics"), auth: true });
    }

    return items;
  }, [isAuthenticated, user?.role, t]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-base-200 bg-base-100 transition-shadow dark:border-slate-700 dark:bg-slate-900 ${
        sticky ? "shadow-md" : ""
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-pink-500">
            NDU DigitalLibrary
          </Link>

          <nav className="hidden items-center lg:flex">
            <ul className="flex items-center gap-4 text-sm font-medium">
              {navLinks.map((item) => (
                <li key={item.to}>
                  <Link className="hover:text-pink-500" to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <form className="hidden items-center gap-2 rounded-full border px-3 py-1 text-sm md:flex" onSubmit={handleSearchSubmit}>
              <input
                className="bg-transparent outline-none"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t("search.title")}
              />
            </form>
          )}

          <LanguageSwitcher />

          <button
            aria-label="Toggle theme"
            className="btn btn-ghost btn-circle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19Z" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <Logout />
          ) : (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => document.getElementById("my_modal_3")?.showModal()}
              >
                {t("auth.login")}
              </button>
              <Login />
            </>
          )}

          <div className="lg:hidden">
            <details className="dropdown dropdown-end">
              <summary className="btn btn-ghost btn-circle">
                <span className="sr-only">Menu</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </summary>
              <ul className="menu dropdown-content rounded-box bg-base-100 p-2 shadow-md" role="menu">
                {navLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
