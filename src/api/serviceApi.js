import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Criar novo serviço
export const createService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/services`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data; // aqui volta o { success: true, data: {...} }
  } catch (err) {
    console.error("Erro ao criar serviço:", err);
    throw err;
  }
};

// Atualizar serviço
export const updateService = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/services/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
    throw err;
  }
};

// Deletar serviço
export const deleteService = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/services/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
    throw err;
  }
};

// Buscar serviço (exemplo)
export const getServiceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/services/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar serviço:", err);
    throw err;
  }
};

export const getFilteredServices = async (filters) => {
  const params = {};

  if (filters.tipo) params.tipo = filters.tipo;
  
  if (filters.dataInicio && filters.dataFim) {
    const inicio = new Date(filters.dataInicio);
    inicio.setHours(0, 0, 0, 0);

    const fim = new Date(filters.dataFim);
    fim.setHours(23, 59, 59, 999);

    params.dataInicio = inicio.toISOString();
    params.dataFim = fim.toISOString();
  }

  const response = await axios.get(`${API_URL}/services/filter`, { params });
  return response.data.data;
};
