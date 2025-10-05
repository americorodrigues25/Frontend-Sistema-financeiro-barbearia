import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";

// icons
import { MdHome } from "react-icons/md";
import { IoDuplicate } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

export default function Nav() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

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
    <div className="flex min-h-screen">
      <aside className="w-72 bg-gray-900 text-white px-4 py-10 flex flex-col justify-between fixed h-screen">
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
            <div className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3">
              <MdHome className="inline mr-3 text-lg" />
              <Link to="/home" className="text-base">
                Home
              </Link>
            </div>
            <div className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3">
              <IoDuplicate className="inline mr-3" />
              <Link to="/novo-servico" className="text-base">
                Novo Serviço
              </Link>
            </div>
            <div className="flex items-center pl-2 border-l-4 border-transparent hover:border-amber-500 hover:text-amber-500 transition-all duration-150 ease-in-out shadow-lg py-3">
              <FaSearch className="inline mr-3" />
              <Link to="/busca" className="text-base">
                Busca Avançada
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

      {/* Conteúdo que muda */}
      <main className="flex-1 p-6 bg-gray-200 ml-72">
        <Outlet />
      </main>
    </div>
  );
}
