import { updateService, deleteService } from "../api/serviceApi";

// Edita serviço
export const handleEditService = async (id, data) => {
  try {
    const res = await updateService(id, data); 
    return res;
  } catch (err) {
    console.error("Erro ao editar serviço:", err);
    throw err;
  }
};

// Deleta serviço
export const handleDeleteService = async (id) => {
  try {
    const res = await deleteService(id); 
    return res;
  } catch (err) {
    console.error("Erro ao deletar serviço:", err);
    throw err;
  }
};
