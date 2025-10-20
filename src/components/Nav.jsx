import { useEffect, useState, useContext } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";

// icons
import { MdHome, MdMenu, MdClose, MdSettings } from "react-icons/md";
import { IoDuplicate } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

// context
import { AuthContext } from "../context/AuthContext";

export default function Nav() {
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("name");

    if (!isLoggedIn || !token) {
      navigate("/");
    } else {
      setName(user);
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Botão hamburguer (visível apenas no mobile) */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
      >
        {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {!menuOpen && (
        <p className="lg:hidden fixed top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-md px-4">
          Olá, {name}
        </p>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white px-4 py-10 flex flex-col justify-between transform transition-transform duration-300 z-40
        ${menuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="./img/logo.jpg"
              alt="Logo barbearia"
              className="rounded-full w-40"
            />
          </div>
          <h2 className="text-xl font-bold mb-6 text-center">
            BARBEARIA DO CABEÇA
          </h2>
          <nav className="flex flex-col gap-3">
            <Link
              to="/home"
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3 w-full"
            >
              <MdHome className="inline mr-3 text-lg" />
              <span className="text-base">Home</span>
            </Link>
            <Link
              to="/novo-servico"
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3 w-full"
            >
              <IoDuplicate className="inline mr-3" />
              <span className="text-base">Novo Serviço</span>
            </Link>
            <Link
              to="/busca"
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3 w-full"
            >
              <FaSearch className="inline mr-3" />
              <span className="text-base">Busca Avançada</span>
            </Link>
            <Link
              to="/configuracoes"
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3 w-full"
            >
              <MdSettings className="inline mr-3" />
              <span className="text-base">Configurações</span>
            </Link>
          </nav>
        </div>

        <div className="text-center mx-10">
          <button
            onClick={handleLogout}
            className="bg-amber-500 hover:bg-amber-600 transition duration-100 ease-in text-gray-900 py-2 px-4 rounded w-full shadow-lg font-bold"
          >
            SAIR
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 bg-gray-200 mt-16 h-full lg:mt-0 lg:ml-72 overflow-x-hidden">
        <Outlet />
      </main>

    </div>
  );
}
