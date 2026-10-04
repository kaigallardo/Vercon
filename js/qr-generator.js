document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generate-qr");
  const inputField = document.getElementById("qr-input");
  const resultContainer = document.getElementById("qr-result");
  const downloadLink = document.getElementById("download-qr");

  btn.addEventListener("click", () => {
    const inputValue = inputField.value.trim();

    resultContainer.innerHTML = "";
    downloadLink.style.display = "none";

    if (inputValue === "") {
      resultContainer.innerHTML = "<p style='color:#e74c3c;'>Por favor, ingresa algún contenido.</p>";
      return;
    }

    // Crear canvas visible con fondo blanco
    const visibleCanvas = document.createElement("canvas");
    QRCode.toCanvas(visibleCanvas, inputValue, {
      width: 256,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF" // Fondo blanco visible
      }
    }, (err) => {
      if (err) {
        console.error("Error al generar QR visible:", err);
        resultContainer.innerHTML = "<p style='color:#e74c3c;'>Error al generar el código QR.</p>";
        return;
      }

      // Mostrar QR visible en pantalla
      resultContainer.appendChild(visibleCanvas);
    });

    // Crear canvas oculto para descargar (fondo transparente)
    const hiddenCanvas = document.createElement("canvas");
    QRCode.toCanvas(hiddenCanvas, inputValue, {
      width: 256,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#00000000" // Fondo transparente
      }
    }, (err) => {
      if (err) {
        console.error("Error al generar QR transparente:", err);
        return;
      }

      resultContainer.appendChild(visibleCanvas);
      resultContainer.style.display = "inline-block"; // Mostrar solo cuando se genera
      // Generar imagen para descarga
      const dataURL = hiddenCanvas.toDataURL("image/png");
      downloadLink.href = dataURL;
      downloadLink.style.display = "inline-block";
    });
  });
});
