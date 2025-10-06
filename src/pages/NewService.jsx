import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createService } from "../api/serviceApi"; 

const NewService = () => {
  const [formData, setFormData] = useState({
    tipo: "",
    valor: "",
    data: "",
  });
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem ] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataParaEnviar = {
      tipo: formData.tipo,
      valor: parseFloat(formData.valor),
      ...(formData.data && { data: formData.data }),
    };

    try {
      const response = await createService(dataParaEnviar);

      const novoServico = response.data;
      toast.success(
        <div className="flex flex-col">
          <span className="font-bold">Cadastrado com sucesso!</span>
          <span>Serviço: {novoServico.tipo}</span>
          <span>Valor: R${novoServico.valor.toFixed(2)}</span>
        </div>,
        { duration: 6000 }
      );

      setFormData({ tipo: "", valor: "", data: "" });
    } catch (error) {
      toast.error("Falha no cadastro do serviço.", { duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gray-100 min-h-screen p-6">
      {/* Header do sistema */}
      <header className="w-full max-w-5xl bg-gray-900 text-white p-4 rounded-t shadow-md mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">Serviços</h1>
        <span className="text-sm opacity-70">Novo Serviço</span>
      </header>

      {/* Card do formulário */}
      <div className="w-full max-w-5xl bg-white rounded-b shadow-md p-6 flex flex-col mx-auto">
        <Toaster position="top-right" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Tipo e Valor em linha */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/4 text-gray-700 font-medium mb-1 sm:mb-0">
              Tipo de Serviço:
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="">Selecione...</option>
              <option value="Corte Adulto">Corte Adulto</option>
              <option value="Corte Infantil">Corte Infantil</option>
              <option value="Barba Simples">Barba Simples</option>
              <option value="Combo (Corte + Barba)">
                Combo (Corte + Barba)
              </option>
              <option value="Tintura">Tintura</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/4 text-gray-700 font-medium mb-1 sm:mb-0">
              Valor (R$):
            </label>
            <input
              type="number"
              name="valor"
              value={formData.valor}
              onChange={handleChange}
              step="0.01"
              placeholder="Ex: 45.00"
              required
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <label className="w-full sm:w-1/4 text-gray-700 font-medium mb-1 sm:mb-0">
              Data do Serviço:
            </label>
            <input
              type="datetime-local"
              name="data"
              value={formData.data}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            />
          </div>

          {/* Botão de envio */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar Serviço"}
            </button>
          </div>
        </form>

        {/* Mensagem de sucesso/erro */}
        {mensagem && (
          <div
            className={`mt-3 px-3 py-2 text-sm text-white transition-opacity duration-500 ${
              mensagem.type === "success" ? "bg-green-500/90" : "bg-red-500/90"
            } rounded`}
          >
            {mensagem.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewService;
