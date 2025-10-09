import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { FaSearch, FaFilePdf, FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFilteredServices } from "../api/serviceApi";
import ExportPDF from "../utils/ExportPdf";
import {
  handleEditService,
  handleDeleteService,
} from "../handlers/serviceHandlers";
import EditServiceModal from "../components/modals/EditServiceModal";
import DeleteServiceModal from "../components/modals/DeleteServiceModal";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";

registerLocale("pt-BR", ptBR);

const AdvancedSearch = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000); // desaparece após 3s
  };

  const [filters, setFilters] = useState({
    tipo: "todos",
    dataInicio: null,
    dataFim: null,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Estados para modais
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ tipo: "", valor: "", data: "" });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tipo: filters.tipo !== "todos" ? filters.tipo : undefined,
        dataInicio: filters.dataInicio
          ? filters.dataInicio.toISOString()
          : undefined,
        dataFim: filters.dataFim ? filters.dataFim.toISOString() : undefined,
      };

      const data = await getFilteredServices(payload);
      setResults(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
    } finally {
      setLoading(false);
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Ações (editar e excluir)
  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      tipo: service.tipo,
      valor: service.valor,
      data: service.data?.slice(0, 10),
    });
    setIsEditOpen(true);
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await handleEditService(selectedService._id, formData);
      setIsEditOpen(false);
      await handleSearch(); // Recarrega lista
      showToast("Serviço atualizado com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar serviço", "error");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await handleDeleteService(selectedService._id);
      setIsDeleteOpen(false);
      await handleSearch(); // Recarrega lista
      showToast("Serviço excluído com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir serviço", "error");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-4 sm:px-6 md:px-8 py-6">
      <header className="w-full max-w-5xl bg-gray-900 text-white p-4 rounded-t shadow-md mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold">Relatório de Serviços</h1>
        <span className="text-sm opacity-70">Busca Avançada</span>
      </header>

      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-white rounded-b shadow-md p-4 sm:p-6 flex flex-col mx-auto">
        <Toaster position="top-right" />

        {/* Formulário de filtros */}
        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          {/* Tipo de serviço */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">Tipo de Corte:</label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="todos">Todos</option>
              <option value="Corte Adulto">Corte Adulto</option>
              <option value="Corte Infantil">Corte Infantil</option>
              <option value="Barba Simples">Barba Simples</option>
              <option value="Combo (Corte + Barba)">Combo (Corte + Barba)</option>
              <option value="Tintura">Tintura</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Período */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">Período:</label>
            <div className="flex gap-4 flex-1 flex-col sm:flex-row">
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500 mb-1">De:</span>
                <DatePicker
                  locale="pt-BR"
                  selected={filters.dataInicio}
                  onChange={(date) => handleDateChange("dataInicio", date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Data inicial"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-500 mb-1">Até:</span>
                <DatePicker
                  locale="pt-BR"
                  selected={filters.dataFim}
                  onChange={(date) => handleDateChange("dataFim", date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Data final"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                />
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition flex items-center gap-2 disabled:opacity-60 justify-center"
            >
              <FaSearch />
              {loading ? "Buscando..." : "Buscar"}
            </button>
            <ExportPDF
              data={results}
              periodo={
                filters.dataInicio && filters.dataFim
                  ? `Período: ${filters.dataInicio.toLocaleDateString("pt-BR")} até ${filters.dataFim.toLocaleDateString("pt-BR")}`
                  : "Período: Todos"
              }
            />
          </div>
        </form>

        {/* Tabela */}
        {results.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Valor (R$)</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{item.tipo}</td>
                    <td className="px-4 py-2">
                      R$ {Number(item.valor).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <FaEdit
                          className="text-gray-900 hover:text-gray-950 cursor-pointer"
                          onClick={() => openEditModal(item)}
                        />
                        <FaTrash
                          className="text-gray-900 hover:text-red-600 cursor-pointer"
                          onClick={() => openDeleteModal(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginação */}
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {!results.length && !loading && (
          <p className="text-center text-gray-500 mt-8">
            Nenhum serviço encontrado.
          </p>
        )}
      </div>

      {/* Modais */}
      <EditServiceModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        service={selectedService}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
      />

      <DeleteServiceModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        service={selectedService}
        onConfirm={handleDeleteConfirm}
      />

      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
