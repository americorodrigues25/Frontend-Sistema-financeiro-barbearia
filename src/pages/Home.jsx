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

const API_URL = "http://localhost:5000/api/services";

export default function Home() {
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

  // controle modal
  const [showModal, setShowModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [formData, setFormData] = useState({ tipo: "", valor: "", data: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 3000); // desaparece após 3s
  };

  // 🔄 função centralizada para buscar dashboard
  const fetchDashboard = async () => {
    try {
      const resDia = await axios.get(`${API_URL}/total/day`);
      if (resDia.data.success) setTotalDia(resDia.data.total);

      const resMes = await axios.get(`${API_URL}/total/month`);
      if (resMes.data.success) {
        setTotalMes(resMes.data.total);
        setQuantidadeMes(resMes.data.quantidade);
      }

      const resSemana = await axios.get(`${API_URL}/week`);
      if (resSemana.data.success) setDadosSemana(resSemana.data.dadosSemana);

      const resUltimos = await axios.get(`${API_URL}/last`);
      if (resUltimos.data.success) setUltimosServicos(resUltimos.data.ultimos);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    }
  };

  // formata data para input type=date
  const formatDateInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 🔄 carregamento inicial
  useEffect(() => {
    fetchDashboard();
  }, []);

  // abrir modal de edição
  const openEditModal = (service) => {
    setEditService(service);
    setFormData({
      tipo: service.tipo,
      valor: service.valor,
      data: formatDateInput(service.data),
    });
    setShowModal(true);
  };

  // função abrir modal de delete
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // enviar edição
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

  // confirmar delete
  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await handleDeleteService(serviceToDelete._id);
      await fetchDashboard(); // atualiza sem reload
      setShowDeleteModal(false);
      showToast("Serviço excluído com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir serviço", "error");
    }
  };

  return (
    <div className="md:px-10 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Dashboard Barbearia
      </h1>

      {/* Cards Totais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-20 mb-6">
        <div className="bg-gray-900 p-4 rounded shadow-xl h-32">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-base font-semibold text-white">Diário</h2>
            <div className="bg-white p-1 rounded-full">
              <MdAttachMoney className="text-gray-900 text-xl" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-white text-center">
            R$ {totalDia.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow-xl h-32">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-base font-semibold text-gray-900">Mensal</h2>
            <div className="bg-gray-900 p-1 rounded-full">
              <MdAttachMoney className="text-white text-xl" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 text-center">
            R${totalMes.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow-xl h-32">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Serviços
            </h2>
            <div className="bg-gray-900 p-1 rounded-full">
              <MdContentCut className="text-white text-xl" />
            </div>
          </div>
          <p className="text-[28px] font-bold text-gray-900 text-center">
            {quantidadeMes}
          </p>
        </div>
      </div>

      {/* Últimos serviços cadastrados */}
      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <h2 className="text-base font-bold mb-3 text-gray-900">
          Últimos Serviços Cadastrados
        </h2>

        {/* Tabela - visível apenas em telas médias ou maiores */}
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
                  <td className="py-2 px-3">R$ {s.valor.toFixed(2)}</td>
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

        {/* Cards - visível apenas no mobile */}
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
                <p className="text-gray-800 font-medium">R$ {s.valor.toFixed(2)}</p>
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

      {/* Gráfico de valores da semana com total */}
      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <div className="flex flex-wrap justify-between items-center mb-2 px-2">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Valores da Semana
          </h2>
          <p className="text-sm md:text-base font-bold text-gray-900">
            Total: R$
            {dadosSemana.reduce((acc, d) => acc + d.total, 0).toFixed(2)}
          </p>
        </div>

        <div className="w-full h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosSemana}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" style={{ fill: "#1f2937" }} />
              <YAxis style={{ fill: "#1f2937" }} />
              <Tooltip />
              <Bar dataKey="total" fill="#1f2937" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de serviços da semana */}
      <div className="bg-white p-4 rounded shadow-xl mb-10">
        <div className="flex flex-wrap justify-between items-center mb-2 px-2">
          <h2 className="text-base font-bold text-gray-900 mb-1">
            Serviços da Semana
          </h2>
          <p className="text-sm md:text-base font-bold text-gray-900">
            Total: {dadosSemana.reduce((acc, d) => acc + d.quantidade, 0)}
          </p>
        </div>

        <div className="w-full h-52 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dadosSemana}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              barCategoryGap="25%"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" style={{ fill: "#1f2937" }} />
              <YAxis
                style={{ fill: "#1f2937" }}
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
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
