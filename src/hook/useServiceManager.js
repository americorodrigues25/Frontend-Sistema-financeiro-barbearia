import { useState } from "react";
import { handleEditService, handleDeleteService } from "../handlers/serviceHandlers";

export default function useServiceManager(fetchDataCallback, showToast) {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ tipo: "", valor: "", data: "" });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDateInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setFormData({
      tipo: service.tipo,
      valor: service.valor,
      data: formatDateInput(service.data),
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    try {
      const adjustedData = {
        ...formData,
        data: formData.data
          ? new Date(formData.data + "T00:00:00").toISOString()
          : new Date().toISOString(),
      };
      await handleEditService(selectedService._id, adjustedData);
      setIsEditOpen(false);
      await fetchDataCallback();
      showToast("Serviço atualizado com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao atualizar serviço", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (service) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    try {
      await handleDeleteService(selectedService._id);
      setIsDeleteOpen(false);
      await fetchDataCallback();
      showToast("Serviço excluído com sucesso!", "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao excluir serviço", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
