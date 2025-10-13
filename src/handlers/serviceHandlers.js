// serviceHandlers.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const handleEditService = async (id, data) => {
  try {
    await axios.put(`${API_URL}/services/${id}`, data);
  } catch (err) {
    console.error("Erro ao editar serviço:", err);
  }
};

export const handleDeleteService = async (id) => {
  try {
    await axios.delete(`${API_URL}/services/${id}`);
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
  }
};
