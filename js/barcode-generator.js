document.addEventListener("DOMContentLoaded", function () {
  const generateBtn = document.getElementById("generate-barcode");
  const inputField = document.getElementById("barcode-input");
  const formatSelect = document.getElementById("barcode-format");
  const resultContainer = document.getElementById("barcode-result");
  const downloadLink = document.getElementById("download-barcode");
  const printBtn = document.getElementById("print-barcode");
  const messageBox = document.getElementById("message-box");

  // Función para mostrar mensajes al usuario
  function showMessage(text, type = "success") {
    messageBox.textContent = text;
    messageBox.className = `message-box ${type}`;
    messageBox.style.display = "block";

    setTimeout(() => {
      messageBox.style.display = "none";
    }, 5000);
  }

  // Validación para EAN-13
  function isValidEAN13(code) {
    if (code.length !== 13 || !/^\d+$/.test(code)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3);
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(code[12]);
  }

  // Validación básica para UPC
  function isValidUPC(code) {
    if (code.length !== 12 || !/^\d+$/.test(code)) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(code[i]) * ((i % 2 === 0) ? 3 : 1);
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === 0;
  }

  // Generar el código de barras
  generateBtn.addEventListener("click", function () {
    const code = inputField.value.trim();
    const selectedFormat = formatSelect.value;

    if (!code) {
      showMessage("Por favor ingresa un número válido.", "error");
      return;
    }

    let isValid = true;
    if (selectedFormat === "EAN13" && !isValidEAN13(code)) {
      showMessage("El número EAN-13 ingresado no es válido.", "error");
      isValid = false;
    } else if (selectedFormat === "UPC" && !isValidUPC(code)) {
      showMessage("El número UPC ingresado no es válido.", "error");
      isValid = false;
    }

    if (!isValid) return;

    // Limpiar resultados previos
    resultContainer.innerHTML = "";
    downloadLink.style.display = "none";

    // Crear SVG
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    try {
      JsBarcode(svg, code, {
        format: selectedFormat || "EAN13",
        lineColor: "#000",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 16,
        textMargin: 5,
        background: "#fff"
      });

      resultContainer.appendChild(svg);

      // Convertir a imagen para descarga
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.style.display = "inline-block";
      };

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      img.src = "image/svg+xml;base64," + btoa(svgString);

    } catch (e) {
      showMessage("No se pudo generar el código de barras. Verifica los datos.", "error");
    }
  });
});