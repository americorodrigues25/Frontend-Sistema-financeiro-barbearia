import React, { useState } from "react";

// bibliotecas externas
import { Toaster } from "react-hot-toast";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";

// APIs
import { getFilteredServices } from "../api/serviceApi";

// utils
import ExportPDF from "../utils/ExportPdf";

// Hook centralizado para edição/exclusão
import useServiceManager from "../hook/useServiceManager";

// Modais
import EditServiceModal from "../components/modals/EditServiceModal";
import DeleteServiceModal from "../components/modals/DeleteServiceModal";

registerLocale("pt-BR", ptBR);

const AdvancedSearch = () => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
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

  const [hasSearched, setHasSearched] = useState(false);


  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setHasSearched(true);

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
      showToast("Erro ao buscar serviços", "error");
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

  // Hook de edição/exclusão
  const {
    selectedService,
    formData,
    setFormData,
    isEditOpen,
    isDeleteOpen,
    isSubmitting,
    openEditModal,
    handleEditSubmit,
    openDeleteModal,
    handleDeleteConfirm,
    setIsEditOpen,
    setIsDeleteOpen,
  } = useServiceManager(handleSearch, showToast);

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gray-100 min-h-screen px-4 sm:px-6 md:px-8 py-6">
      <header className="w-full max-w-5xl bg-gray-900 text-white p-4 rounded-t shadow-md mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Relatório de Serviços</h2>
        <span className="text-sm opacity-70">Busca Avançada</span>
      </header>

      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl bg-white rounded-b shadow-md p-4 sm:p-6 flex flex-col mx-auto">
        <Toaster position="top-right" />

        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label className="w-full md:w-1/3 text-gray-700 font-medium mb-1 md:mb-0">
              Tipo de Serviço:
            </label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
            >
              <option value="todos">Todos</option>
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
              Período:
            </label>
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
                  ? `Período: ${filters.dataInicio.toLocaleDateString(
                    "pt-BR"
                  )} até ${filters.dataFim.toLocaleDateString("pt-BR")}`
                  : "Período: Todos"
              }
            />
          </div>
        </form>

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
                      R${" "}
                      {Number(item.valor).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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

            {/* paginação */}
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

        {hasSearched && !results.length && !loading && (
          <p className="text-center text-gray-500 mt-8">
            Nenhum serviço encontrado.
          </p>
        )}
      </div>

      <EditServiceModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        service={selectedService}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      <DeleteServiceModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        service={selectedService}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
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
