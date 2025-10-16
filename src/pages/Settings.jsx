import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import ChangePasswordModal from "../components/modals/ChangePasswordModal";
import { ImSpinner2 } from "react-icons/im";

const API_URL = process.env.REACT_APP_API_URL;

export default function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ name: "", username: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
        setNewName(response.data.name);
      } catch (error) {
        toast.error("Erro ao carregar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/auth/update-name`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, name: response.data.name }));
      toast.success("Nome atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar nome");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center">
          <ImSpinner2 className="animate-spin text-gray-900 text-4xl mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <header className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-gray-900 text-white p-4 rounded-t shadow-md mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Configurações</h2>
        <span className="text-sm opacity-70">Editar</span>
      </header>

      {/* Formulário */}
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-white rounded-b shadow-md p-4 sm:p-6 flex flex-col mx-auto">
        <Toaster position="top-right" />

        <div className="flex justify-center mb-6">
          <img
            src="./img/logo.jpg"
            alt="Logo barbearia"
            className="w-32 h-32 rounded-full shadow-md"
          />
        </div>

        <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
              Usuário:
            </label>
            <input
              type="text"
              value={userData.username}
              readOnly
              className="flex-1 bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
              Nome:
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              Salvar Alterações
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-amber-600 hover:underline font-semibold"
            >
              Alterar senha
            </button>
          </div>
        </form>
      </div>

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
