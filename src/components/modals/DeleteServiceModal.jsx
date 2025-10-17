import { ImSpinner2 } from "react-icons/im";

export default function DeleteServiceModal({
  isOpen,
  onClose,
  service,
  onConfirm,
  isSubmitting, // <--- nova prop
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-gray-900">
          Confirmar Exclusão
        </h2>
        <p className="mb-6 text-gray-700">
          Tem certeza que deseja excluir o serviço{" "}
          <span className="font-semibold">{service?.tipo}</span> no valor de R${" "}
          {service?.valor.toFixed(2)}?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <ImSpinner2 className="animate-spin" /> : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
