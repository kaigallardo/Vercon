// Mostrar nombre de archivo y vista previa de la imagen original
document.getElementById("image-input").addEventListener("change", function () {
  const file = this.files[0];
  const fileName = file ? file.name : "";
  document.getElementById("file-name").textContent = fileName;

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const originalImg = document.getElementById("original-image");
      originalImg.src = e.target.result;
      originalImg.style.display = "block";

      // Limpiar canvas y botón de descarga si existían datos previos
      const canvas = document.getElementById("canvas");
      canvas.style.display = "none";
      const downloadLink = document.getElementById("download-image");
      downloadLink.style.display = "none";
      downloadLink.href = "";
    };
    reader.readAsDataURL(file);
  }
});

// Función de conversión (sin filtro de escala de grises)
document.getElementById("convert-image").addEventListener("click", function () {
  const fileInput = document.getElementById("image-input");
  if (!fileInput.files || !fileInput.files[0]) {
    alert("Por favor, selecciona una imagen.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      // Configurar canvas con el tamaño de la imagen
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas

      // Dibujar imagen original (en color)
      ctx.drawImage(img, 0, 0);

      // Mostrar el canvas con la imagen convertida
      canvas.style.display = "block";

      // Mapeo de formatos a MIME types
      const mimeTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        webp: "image/webp",
        bmp: "image/bmp",
        png: "image/png",
        ico: "image/x-icon",
        svg: "image/svg+xml",
        tiff: "image/tiff"
      };

      const exportFormat = document.getElementById("export-format").value;
      const mimeType = mimeTypes[exportFormat] || "image/png";

      // Generar DataURL con el tipo correcto
      const downloadLink = document.getElementById("download-image");
      downloadLink.href = canvas.toDataURL(mimeType); // <-- Aquí se usa el tipo correcto
      downloadLink.style.display = "inline-block";

      // Generar nombre del archivo descargado
      const originalFileName = file.name;
      const baseName = originalFileName.replace(/\.[^/.]+$/, ""); // Nombre sin extensión
      const newFileName = `${baseName}-Vercon.${exportFormat}`;
      downloadLink.download = newFileName;
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});