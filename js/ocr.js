document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("ocr-file");
  const fileNameSpan = document.getElementById("file-name");
  const ocrType = document.getElementById("ocr-type");
  const ocrResult = document.getElementById("ocr-result");
  const startBtn = document.getElementById("start-ocr");
  let selectedFile = null;

  fileInput.addEventListener("change", () => {
    if(fileInput.files.length > 0){
      selectedFile = fileInput.files[0];
      fileNameSpan.textContent = selectedFile.name;
      ocrResult.value = ""; // limpiar resultado previo
    } else {
      selectedFile = null;
      fileNameSpan.textContent = "";
      ocrResult.value = "";
    }
  });

  startBtn.addEventListener("click", () => {
    if(!selectedFile){
      alert("Por favor, selecciona un archivo para realizar OCR.");
      return;
    }

    if(ocrType.value === "image"){
      if(!selectedFile.type.startsWith("image/")){
        alert("Para 'Reconocer texto de imagen' por favor selecciona un archivo de imagen válido.");
        return;
      }
      ocrResult.value = "Procesando OCR para imagen, por favor espera...";

      const reader = new FileReader();
      reader.onload = () => {
        Tesseract.recognize(
          reader.result,
          'spa',
          { logger: m => {
            if(m.status === 'recognizing text'){
              ocrResult.value = `Progreso: ${(m.progress * 100).toFixed(2)}%`;
            }
          } }
        ).then(({ data: { text } }) => {
          ocrResult.value = text || "No se reconoció texto en la imagen.";
        }).catch(err => {
          ocrResult.value = "Error durante el reconocimiento OCR: " + err.message;
        });
      };
      reader.readAsDataURL(selectedFile);
    }
    else if(ocrType.value === "pdf"){
      if(selectedFile.type !== "application/pdf"){
        alert("Por favor selecciona un archivo PDF válido.");
        return;
      }
      ocrResult.value = "Procesando OCR para PDF, por favor espera...";

      const reader = new FileReader();
      reader.onload = function() {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
          // Solo procesamos la primera página para ejemplo
          pdf.getPage(1).then(page => {
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };

            page.render(renderContext).promise.then(() => {
              // Convertimos el canvas a DataURL y lo pasamos a Tesseract
              const imgData = canvas.toDataURL('image/png');

              Tesseract.recognize(
                imgData,
                'spa',
                { logger: m => {
                  if(m.status === 'recognizing text'){
                    ocrResult.value = `Progreso: ${(m.progress * 100).toFixed(2)}%`;
                  }
                } }
              ).then(({ data: { text } }) => {
                ocrResult.value = text || "No se reconoció texto en el PDF.";
              }).catch(err => {
                ocrResult.value = "Error durante el OCR de PDF: " + err.message;
              });
            }).catch(err => {
              ocrResult.value = "Error al renderizar página PDF: " + err.message;
            });
          }).catch(err => {
            ocrResult.value = "Error al obtener página del PDF: " + err.message;
          });
        }).catch(err => {
          ocrResult.value = "Error al cargar PDF: " + err.message;
        });
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  });
});
