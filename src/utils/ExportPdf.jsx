// bibliotecas externas
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ExportPDF = ({ data, filename = "relatorio.pdf", periodo }) => {
  const handleExport = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Título centralizado
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Relatório de Serviços", 105, 20, { align: "center" });

    // Subtítulo com período
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(periodo || "Período: Todos", 105, 28, { align: "center" });

    // Linha divisória
    doc.setDrawColor(200);
    doc.line(14, 32, 196, 32);

    // Tabela de dados
    const tableColumn = ["Tipo", "Valor (R$)", "Data"];
    const tableRows = data.map((item) => [
      item.tipo,
      Number(item.valor).toFixed(2),
      new Date(item.data).toLocaleDateString("pt-BR"),
    ]);

    const total = data.reduce((acc, item) => acc + Number(item.valor), 0);

    doc.autoTable({
      startY: 38,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      styles: { cellPadding: 4 },
      margin: { left: 14, right: 14 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Resumo no final
    const quantidade = data.length;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Quantidade de Serviços: ${quantidade}`, 14, finalY);
    doc.text(`Valor Total: R$ ${total.toFixed(2)}`, 14, finalY + 7);

    // Rodapé
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Gerado automaticamente pelo sistema - © " + new Date().getFullYear(),
      105,
      290,
      { align: "center" }
    );

    doc.save(filename);
  };

  return (
    <button
      onClick={handleExport}
      disabled={!data.length}
      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaFilePdf className="text-lg" />
      <span>Exportar PDF</span>
    </button>
  );
};

export default ExportPDF;
