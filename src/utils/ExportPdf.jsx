import React from "react";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportPDF = ({ data, filename = "relatorio.pdf", periodo }) => {
  const handleExport = () => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Serviços", 14, 20);

    // Período filtrado no canto direito
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (periodo) {
      doc.text(periodo, 200, 20, { align: "right" });
    }

    // Linha separadora abaixo do cabeçalho
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25); // de x=14 até x=196 na posição y=25

    const tableColumn = ["Tipo", "Valor (R$)", "Data"];
    const tableRows = data.map((item) => [
      item.tipo,
      Number(item.valor).toFixed(2),
      new Date(item.data).toLocaleDateString("pt-BR"),
    ]);

    // Soma total dos valores
    const total = data.reduce((acc, item) => acc + Number(item.valor), 0);

    // Tabela
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "striped",
      headStyles: { fillColor: [17, 24, 39], textColor: [255, 255, 255] }, // gray-900 com texto branco
    });

    // Total no final da página
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: R$ ${total.toFixed(2)}`, 14, finalY);

    doc.save(filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data.length}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition flex justify-center items-center gap-2 disabled:opacity-60"
    >
      <FaFilePdf />
      Exportar PDF
    </button>
  );
};

export default ExportPDF;
