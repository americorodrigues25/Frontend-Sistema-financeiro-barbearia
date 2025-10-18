import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Pega o token do localStorage
const getToken = () => localStorage.getItem("token");

// Configura headers com Authorization
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// cria novo serviço
export const createService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/services`, data, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao criar serviço:", err);
    throw err;
  }
};

// atualiza serviço
export const updateService = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/services/${id}`, data, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
    throw err;
  }
};

// deleta serviço
export const deleteService = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/services/${id}`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
    throw err;
  }
};

// buscar serviço por id
export const getServiceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/services/${id}`, {
      headers: authHeaders(),
    });
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

  try {
    const res = await axios.get(`${API_URL}/services/filter`, {
      headers: authHeaders(),
      params,
    });
    return res.data.data; // conforme seu backend retorna
  } catch (err) {
    console.error("Erro ao buscar serviços filtrados:", err);
    throw err;
  }
};

export const getTotalDay = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/total/day`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar total do dia:", err);
    throw err;
  }
};

export const getTotalMonth = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/total/month`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar total do mês:", err);
    throw err;
  }
};

export const getWeek = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/week`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar serviços da semana:", err);
    throw err;
  }
};

export const getLast = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/last`, {
      headers: authHeaders(),
    });
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar últimos serviços:", err);
    throw err;
  }
};
