import { useState } from "react";
import axios from "axios";
import { MdClose } from "react-icons/md";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put("http://localhost:5000/api/auth/change-password", {
        email,
        newPassword,
      });

      setToast({
        show: true,
        message: response.data.message || "Senha alterada com sucesso!",
        type: "success",
      });

      setEmail("");
      setNewPassword("");

      // Fecha o modal após 2.5s, tempo suficiente para ler o toast
      setTimeout(() => {
        setToast({ ...toast, show: false });
        onClose();
      }, 2500);
    } catch (err) {
      setToast({
        show: true,
        message: err.response?.data?.message || "Erro ao tentar trocar a senha.",
        type: "error",
      });

      setTimeout(() => setToast({ ...toast, show: false }), 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={22} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Trocar Senha
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="E-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-amber-500 hover:bg-amber-600 transition duration-150 text-white font-bold py-2 rounded ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>

        {/* Toast dentro do modal */}
        {toast.show && (
          <div
            className={`fixed bottom-5 left-5 right-5 sm:bottom-auto sm:left-auto sm:right-5 sm:top-5 max-w-xs sm:max-w-sm px-4 py-3 rounded shadow text-white ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
