import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => localStorage.getItem("token");

// Configuração padrão do header Authorization
const authHeader = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// cria novo serviço
export const createService = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/services`, data, {
      headers: authHeader(),
    });
    return res.data.data; 
  } catch (err) {
    console.error("Erro ao criar serviço:", err);
    throw err;
  }
};

// atualiza serviço
export const updateService = async (id, data) => {
  try {
    const res = await axios.put(`${API_URL}/services/${id}`, data, {
      headers: authHeader(),
    });
    return res.data.data; 
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
    throw err;
  }
};

// deleta serviço
export const deleteService = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/services/${id}`, {
      headers: authHeader(),
    });
    return res.data.message; 
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
    throw err;
  }
};

// buscar serviço por id
export const getServiceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/services/${id}`, {
      headers: authHeader(),
    });
    return res.data.data; 
  } catch (err) {
    console.error("Erro ao buscar serviço por ID:", err);
    throw err;
  }
};

// buscar serviços filtrados
export const getFilteredServices = async (filters) => {
  try {
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

    const res = await axios.get(`${API_URL}/services/filter`, {
      headers: authHeader(),
      params,
    });

    return res.data.data; 
  } catch (err) {
    console.error("Erro ao buscar serviços filtrados:", err);
    throw err;
  }
};

// obter total do dia
export const getTotalDay = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/total/day`, {
      headers: authHeader(),
    });
    return res.data.total;
  } catch (err) {
    console.error("Erro ao obter total do dia:", err);
    throw err;
  }
};

// obter total do mês
export const getTotalMonth = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/total/month`, {
      headers: authHeader(),
    });
    return { total: res.data.total, quantidade: res.data.quantidade };
  } catch (err) {
    console.error("Erro ao obter total do mês:", err);
    throw err;
  }
};

// obter dados da semana
export const getWeek = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/week`, {
      headers: authHeader(),
    });
    return res.data.dadosSemana;
  } catch (err) {
    console.error("Erro ao obter dados da semana:", err);
    throw err;
  }
};

// obter últimos serviços cadastrados
export const getLastServices = async () => {
  try {
    const res = await axios.get(`${API_URL}/services/last`, {
      headers: authHeader(),
    });
    return res.data.ultimos;
  } catch (err) {
    console.error("Erro ao obter últimos serviços:", err);
    throw err;
  }
};
