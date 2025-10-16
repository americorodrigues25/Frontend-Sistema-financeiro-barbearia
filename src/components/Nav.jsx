import { useEffect, useState } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";

// icons
import { MdHome, MdMenu, MdClose, MdLock, MdSettings } from "react-icons/md";
import { IoDuplicate } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

// components
import ChangePasswordModal from "./modals/ChangePasswordModal";

export default function Nav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("username");

    if (!token) {
      navigate("/");
    } else {
      setUsername(user);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Botão hamburguer (visível apenas no mobile) */}
      {/* Botão hamburguer */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
      >
        {menuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>

      {/* Texto mostrado apenas quando o menu estiver aberto */}
      {!menuOpen && (
        <p className="lg:hidden fixed top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded-md px-4">
          Olá, {username}
        </p>
      )}

      {/* Menu lateral */}
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
            <div
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3"
            >
              <MdHome className="inline mr-3 text-lg" />
              <Link to="/home" className="text-base">
                Home
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3"
            >
              <IoDuplicate className="inline mr-3" />
              <Link to="/novo-servico" className="text-base">
                Novo Serviço
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3"
            >
              <FaSearch className="inline mr-3" />
              <Link to="/busca" className="text-base">
                Busca Avançada
              </Link>
            </div>
            <div
              onClick={() => setMenuOpen(false)}
              className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3"
            >
              <MdSettings className="inline mr-3" />
              <Link to="/configuracoes" className="text-base">
                Configurações
              </Link>
            </div>
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

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
