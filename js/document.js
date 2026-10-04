    // Mostrar nombre de archivo y previsualización para documentos
    document.getElementById("document-input").addEventListener("change", function(){
      const file = this.files[0];
      const fileName = file ? file.name : "";
      document.getElementById("file-name").textContent = fileName;
      
      if(file) {
        // Si el archivo es TXT, mostrar previsualización
        if(file.type === "text/plain") {
          file.text().then(text => {
            const preview = document.getElementById("doc-preview");
            preview.value = text;
            preview.style.display = "block";
          });
        } else {
          // Para PDF o Word muestra mensaje en previsualización
          const preview = document.getElementById("doc-preview");
          preview.value = "Previsualización no disponible para este formato. Se realizará la conversión.";
          preview.style.display = "block";
        }
      }
    });
    
    // Función para procesar la conversión y luego exportar el documento
    function processConversion(content) {
      // Simulación: convertir el contenido a mayúsculas
      let converted = content.toUpperCase();
      const preview = document.getElementById("doc-preview");
      preview.value = converted;
      
      const exportFormat = document.getElementById("export-format").value;
      const downloadLink = document.getElementById("download-document");
      
      if(exportFormat === "pdf") {
        // Usar jsPDF para generar PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFont("courier", "normal");
        doc.text(converted, 10, 10);
        const pdfDataUri = doc.output("datauristring");
        downloadLink.href = pdfDataUri;
        downloadLink.download = "converted.pdf";
      } else if(exportFormat === "docx") {
        // Simular exportación a DOCX mediante Blob
        const blob = new Blob([converted], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "converted.docx";
      } else {
        // Exportar como TXT
        const blob = new Blob([converted], { type: "text/plain" });
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = "converted.txt";
      }
      downloadLink.style.display = "inline-block";
    }
    
    // Función de conversión: convertir contenido (considera Word y otros formatos)
    document.getElementById("convert-document").addEventListener("click", function() {
      const fileInput = document.getElementById("document-input");
      if (!fileInput.files || !fileInput.files[0]) {
        alert("Por favor, selecciona un documento.");
        return;
      }
      const file = fileInput.files[0];
      
      // Verificar si el documento es Word
      if(file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.type === "application/msword") {
        // Utilizar Mammoth para extraer texto de documentos Word
        file.arrayBuffer().then(buffer => {
          mammoth.extractRawText({ arrayBuffer: buffer })
            .then(function(result) {
              let content = result.value;
              processConversion(content);
            })
            .catch(function(err) {
              alert("Error al extraer el contenido del documento Word.");
            });
        });
      } else {
        // Para TXT y PDF usar file.text()
        file.text().then(content => {
          processConversion(content);
        }).catch(() => {
          alert("No se pudo extraer el contenido del documento.");
        });
      }
    });