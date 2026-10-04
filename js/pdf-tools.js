    // SPLIT PDF FUNCTIONALITY
    // Actualizar nombre del archivo seleccionado
    function updateFileName() {
      const input = document.getElementById('splitFile');
      const fileNameDisplay = document.getElementById('fileName');
      if (input.files.length > 0) {
        fileNameDisplay.textContent = `Archivo seleccionado: ${input.files[0].name}`;
      } else {
        fileNameDisplay.textContent = '';
      }
    }

    // Mostrar nombres de archivos seleccionados
    document.getElementById('mergeFiles').addEventListener('change', function() {
      const fileList = Array.from(this.files).map(f => f.name).join('<br>');
      document.getElementById('fileNames').innerHTML = fileList || 'Ningún archivo seleccionado';
    });

    // MERGE PDF FUNCTIONALITY
    // Función para unir los PDFs utilizando pdf-lib
    async function mergePDFs() {
      const statusDiv = document.getElementById("mergeStatus");
      statusDiv.textContent = "Procesando archivos, por favor espera...";
      
      const fileInput = document.getElementById("mergeFiles");
      if (fileInput.files.length === 0) {
        alert("Por favor, selecciona al menos un archivo PDF.");
        statusDiv.textContent = "";
        return;
      }
      
      try {
        // Crear un nuevo PDF vacío
        const mergedPdf = await PDFLib.PDFDocument.create();
        
        // Procesar cada archivo seleccionado
        for (const file of fileInput.files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        
        // Guardar el PDF fusionado
        const mergedPdfFile = await mergedPdf.save();
        // Descargar usando FileSaver.js
        const blob = new Blob([mergedPdfFile], { type: "application/pdf" });
        saveAs(blob, "merged.pdf");
        statusDiv.textContent = "¡Fusión completada! Descargando PDF.";
      } catch (error) {
        console.error("Error en la fusión:", error);
        statusDiv.textContent = "Error al fusionar archivos.";
        alert("Ha ocurrido un error: " + error);
      }
    }