import React, { useState } from "react";

// bibliotecas externas
import toast, { Toaster } from "react-hot-toast";

// api  
import { createService } from "../api/serviceApi";

const NewService = () => {
  const [formData, setFormData] = useState({
    tipo: "",
    valor: "",
    data: "",
  });
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <header className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-gray-900 text-white p-4 rounded-t shadow-md mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Serviços</h2>
        <span className="text-sm opacity-70">Novo Serviço</span>
      </header>

      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-white rounded-b shadow-md p-4 sm:p-6 flex flex-col mx-auto">
        <Toaster position="top-right" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
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
              <option value="Cabelo">Cabelo</option>
              <option value="Cabelo + Barba">Cabelo + Barba</option>
              <option value="Pezinho">Pezinho</option>
              <option value="Sobrancelha">Sobrancelha</option>
              <option value="Luzes">Luzes</option>
              <option value="Platinado">Platinado</option>
              <option value="Hidratação">Hidratação</option>
              <option value="Alisamento">Alisamento</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
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

          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
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

          <div className="flex w-full justify-center md:justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition disabled:opacity-60"
            >
              {loading ? "Cadastrando..." : "Cadastrar Serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewService;
