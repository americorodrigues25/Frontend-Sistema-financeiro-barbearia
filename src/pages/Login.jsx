// state
import { useState } from "react";

// api
import API from "../api/api";

// router
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-3 md:mx-0 md:w-96 bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-200"
      >
        <div className="mb-6">
          <div className="w-32">
            <img
              src="./img/logo.jpg"
              alt="Logo barbearia"
              className="rounded-full shadow-md"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded-md border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-4 p-3 rounded-md border border-gray-300 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
        />

        <button
          type="submit"
          className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 transition-all"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
