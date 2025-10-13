import { useEffect, useState } from "react";

import {
  handleEditService,
  handleDeleteService,
} from "../handlers/serviceHandlers";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// icons
import { MdAttachMoney, MdContentCut } from "react-icons/md";
import { FaEdit, FaTrash } from "react-icons/fa";

// components
import EditServiceModal from "../components/modals/EditServiceModal";
import DeleteServiceModal from "../components/modals/DeleteServiceModal";

// api
const API_URL = process.env.REACT_APP_API_URL;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalDia, setTotalDia] = useState(0);
  const [totalMes, setTotalMes] = useState(0);
  const [quantidadeMes, setQuantidadeMes] = useState(0);
  const [dadosSemana, setDadosSemana] = useState([]);
  const [ultimosServicos, setUltimosServicos] = useState([]);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // modal
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({ tipo: "", valor: "", data: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000);
  };

  // buscar dados do dashboard
  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const [resDia, resMes, resSemana, resUltimos] = await Promise.all([
        axios.get(`${API_URL}/services/total/day`),
        axios.get(`${API_URL}/services/total/month`),
        axios.get(`${API_URL}/services/week`),
        axios.get(`${API_URL}/services/last`),
      ]);

      if (resDia.data.success) setTotalDia(resDia.data.total);

      if (resMes.data.success) {
        setTotalMes(resMes.data.total);
        setQuantidadeMes(resMes.data.quantidade);
      }

      if (resSemana.data.success) setDadosSemana(resSemana.data.dadosSemana);

      if (resUltimos.data.success) setUltimosServicos(resUltimos.data.ultimos);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      // 2b. DESLIGA O LOADER DEPOIS QUE TUDO TERMINA (Sucesso ou Falha)
      setIsLoading(false);
    }
  };

  const formatDateInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openEditModal = (service) => {
    setEditService(service);
    setFormData({
      tipo: service.tipo,
      valor: service.valor,
      data: formatDateInput(service.data),
    });
    setShowModal(true);
  };

  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const submitEdit = async () => {
    if (!editService) return;

    try {
      await handleEditService(editService._id, formData);
      await fetchDashboard(); // atualiza tudo sem reload
      setShowModal(false);
      showToast("Serviço atualizado com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar serviço", "error");
    }
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await handleDeleteService(serviceToDelete._id);
      await fetchDashboard();
      setShowDeleteModal(false);
      showToast("Serviço excluído com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir serviço", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-xl text-gray-700">Carregando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-10 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Dashboard Barbearia
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-6">
        <div className="bg-gray-900 p-4 rounded shadow-xl h-32 flex flex-col justify-between items-center text-center overflow-hidden">
          <div className="flex justify-between items-start w-full mb-5">
            <h2 className="text-base font-semibold text-white">Diário</h2>
            <div className="bg-white p-1 rounded-full">
              <MdAttachMoney className="text-gray-900 text-xl" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-white text-center">
            R${" "}
            {totalDia.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow-xl h-32 flex flex-col justify-between items-center text-center overflow-hidden">
          <div className="flex justify-between items-start w-full mb-3">
            <h2 className="text-base font-semibold text-gray-900">Mensal</h2>
            <div className="bg-gray-900 p-1 rounded-full">
              <MdAttachMoney className="text-white text-xl" />
            </div>
          </div>
          <p className="font-bold text-gray-900 text-center break-words leading-tight text-[28px]">
            R${" "}
            {totalMes.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow-xl h-32 flex flex-col justify-between items-center text-center overflow-hidden">
          <div className="flex justify-between items-start w-full mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Serviços</h2>
            <div className="bg-gray-900 p-1 rounded-full">
              <MdContentCut className="text-white text-xl" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 text-center">
            {quantidadeMes}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <h2 className="text-base font-bold mb-3 text-gray-900">
          Últimos Serviços Cadastrados
        </h2>

        <div className="hidden sm:block">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-3 text-gray-700">Serviço</th>
                <th className="py-2 px-3 text-gray-700">Valor</th>
                <th className="py-2 px-3 text-gray-700">Data</th>
                <th className="py-2 px-3 text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ultimosServicos.map((s) => (
                <tr key={s._id} className="border-b">
                  <td className="py-2 px-3">{s.tipo}</td>
                  <td className="py-2 px-3">
                    R${" "}
                    {s.valor.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 px-3">
                    {new Date(s.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-2 px-3 flex gap-3">
                    <button
                      onClick={() => openEditModal(s)}
                      className="text-gray-900 hover:text-gray-950"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(s)}
                      className="text-gray-900 hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards - mobile */}
        <div className="flex flex-col gap-4 sm:hidden">
          {ultimosServicos.map((s) => (
            <div
              key={s._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900">{s.tipo}</span>
                <span className="text-sm text-gray-700">
                  {new Date(s.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-800 font-medium">
                  R$ {s.valor.toFixed(2)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(s)}
                    className="text-gray-900 hover:text-gray-950"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openDeleteModal(s)}
                    className="text-gray-900 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditServiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        service={editService}
        formData={formData}
        setFormData={setFormData}
        onSubmit={submitEdit}
      />

      <DeleteServiceModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        service={serviceToDelete}
        onConfirm={confirmDelete}
      />

      {/* Graficos */}
      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <div className="flex flex-wrap justify-between items-center mb-2 px-2">
          <div className="text-gray-900 font-semibold mb-2 text-sm sm:text-base text-center">
            Valores da Semana
          </div>
          <p className="text-xs sm:text-base text-center text-gray-600 mb-4">
            Total: R$
            {dadosSemana.reduce((acc, d) => acc + d.total, 0).toFixed(2)}
          </p>
        </div>

        <div className="w-full h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosSemana}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" style={{ fill: "#1f2937" }} />
              <YAxis
                style={{ fill: "#1f2937", fontSize: "14px" }}
                domain={[0, (dataMax) => dataMax * 1.2]}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
              />
              <Tooltip />
              <Bar dataKey="total" fill="#1f2937" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <div className="flex flex-wrap justify-between items-center mb-2 px-2">
          <div className="text-gray-900 font-semibold mb-2 text-sm sm:text-base text-center">
            Serviços da Semana
          </div>
          <p className="text-xs sm:text-base text-center text-gray-600 mb-4">
            Total: {dadosSemana.reduce((acc, d) => acc + d.quantidade, 0)}
          </p>
        </div>

        <div className="w-full h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosSemana}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" style={{ fill: "#1f2937" }} />
              <YAxis
                style={{ fill: "#1f2937", fontSize: "14px" }}
                tickFormatter={(value) => Math.round(value)}
              />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
