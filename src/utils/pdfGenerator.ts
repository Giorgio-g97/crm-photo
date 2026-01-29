import jsPDF from 'jspdf';
import { Quote, QuoteItem } from './localStorage';

export const generateQuotePDF = (quote: Quote, clientName: string, clientEmail: string, clientPhone: string) => {
  const doc = new jsPDF();
  
  // Impostazioni del documento
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PREVENTIVO', 105, 20, { align: 'center' });
  
  // Linea di separazione
  doc.setLineWidth(0.5);
  doc.line(20, 30, 190, 30);
  
  // Informazioni preventivo
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date(quote.timestamp).toLocaleDateString('it-IT')}`, 20, 40);
  doc.text(`Numero: ${quote.id.substring(0, 8).toUpperCase()}`, 20, 50);
  
  // Informazioni cliente
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 20, 70);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, 20, 80);
  doc.text(`Email: ${clientEmail}`, 20, 90);
  doc.text(`Telefono: ${clientPhone}`, 20, 100);
  
  // Tabella servizi
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Servizi:', 20, 120);
  
  // Intestazione tabella
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Descrizione', 20, 135);
  doc.text('Prezzo', 150, 135);
  
  // Linea di separazione tabella
  doc.setLineWidth(0.3);
  doc.line(20, 140, 190, 140);
  
  // Righe servizi
  doc.setFont('helvetica', 'normal');
  let yPos = 150;
  
  quote.items.forEach((item, index) => {
    // Controllo se c'è spazio per un'altra riga
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text(item.name, 20, yPos);
    doc.setFontSize(8);
    doc.text(item.description, 20, yPos + 5);
    doc.setFontSize(10);
    doc.text(`€ ${item.price.toFixed(2)}`, 150, yPos);
    
    yPos += 15;
  });
  
  // Totale
  yPos += 10;
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  yPos += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Totale:', 130, yPos);
  doc.text(`€ ${quote.total.toFixed(2)}`, 150, yPos);
  
  // Note finali
  yPos += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Questo preventivo è valido per 30 giorni dalla data di emissione.', 20, yPos);
  doc.text('Pagamento: 50% all\'accettazione, 50% al completamento.', 20, yPos + 10);
  
  // Salva il PDF
  const fileName = `preventivo_${quote.id.substring(0, 8)}.pdf`;
  doc.save(fileName);
  
  return fileName;
};