export default function EditServiceModal({
  isOpen,
  onClose,
  service,
  formData,
  setFormData,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <h2 className="text-lg font-bold mb-4">Editar Serviço</h2>

        <label className="block mb-2">
          Tipo:
          <select
            name="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
            required
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
          >
            <option value="">Selecione...</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Cabelo + Barba">Cabelo + Barba</option>
            <option value="Pezinho">Pezinho</option>
            <option value="Sobrancelha">Sobrancelha</option>
            <option value="Luzes">Luzes</option>
            <option value="Platinado">Platinado</option>
            <option value="Hidratação">Hidratação</option>
            <option value="Alisamento">Alisamento</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="block mb-2">
          Valor:
          <input
            type="number"
            value={formData.valor}
            onChange={(e) =>
              setFormData({
                ...formData,
                valor: parseFloat(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
          />
        </label>

        <label className="block mb-4">
          Data:
          <input
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
