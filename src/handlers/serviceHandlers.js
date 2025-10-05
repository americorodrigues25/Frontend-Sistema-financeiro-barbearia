// serviceHandlers.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/services";

export const handleEditService = async (id, data) => {
  try {
    await axios.put(`${API_URL}/${id}`, data);
  } catch (err) {
    console.error("Erro ao editar serviço:", err);
  }
};

export const handleDeleteService = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
  }
};
