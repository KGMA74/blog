"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAppSelector } from "../redux/hooks";
import useLogout from "../hooks/useLogout";
import { FaSpinner, FaBars, FaTimes } from "react-icons/fa";
import { useRetrieveUserQuery } from "../redux/features/authApiSlice";

const Header = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const {data: me} = useRetrieveUserQuery();
    const { onClickLogout, isLoading } = useLogout();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full flex items-center justify-between px-5 md:px-10 lg:px-[100px] py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
            {/* Logo */}
            <Link href="/" aria-label="Go to homepage" className="flex items-center">
                <Logo />
            </Link>

            {/* Menu Burger pour mobile */}
            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Champ de recherche centré
            <div className="flex-grow flex justify-center">
                <div className="w-full max-w-lg">
                    <Search onSearch={handleSearch} />
                </div>
            </div> */}
            
            {/* Navigation */}
            <nav className={`absolute md:static top-[60px] left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none md:flex items-center gap-4 p-5 md:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}>
                <div className="flex flex-col md:flex-row gap-3 items-center w-full md:w-auto">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={onClickLogout}
                                className="text-black border border-gray-300 px-5 py-2 transition duration-150 hover:bg-gray-100 rounded-md flex items-center gap-1 w-full md:w-auto"
                                disabled={isLoading}
                            >
                                Déconnexion
                                {isLoading && <FaSpinner className="animate-spin ml-2" />}
                            </button>

                           { me?.is_superuser &&
                            <Link
                                href="/admin"
                                className="text-white border border-gray-300 px-5 py-2 transition duration-150 hover:bg-blue-100 bg-blue-500 rounded-md w-full md:w-auto text-center"
                            >
                                Nouvel article +
                            </Link>
                           }
                        </>
                    ) : (
                        <Link
                            href="/auth/login-register"
                            className="text-white border border-gray-300 px-4 py-2 transition duration-150 hover:bg-gray-100 bg-blue-500 rounded-md w-full md:w-auto text-center"
                        >
                            Me connecter
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
