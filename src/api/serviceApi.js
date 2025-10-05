import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

// Criar novo serviço
export const createService = async (data) => {
  try {
    const res = await axios.post(API_URL, data, {
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
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Erro ao atualizar serviço:", err);
    throw err;
  }
};

// Deletar serviço
export const deleteService = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
    throw err;
  }
};

// Buscar serviço (exemplo)
export const getServiceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Erro ao buscar serviço:", err);
    throw err;
  }
};
