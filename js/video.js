document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("video-file");
  const fileNameSpan = document.getElementById("file-name");
  const videoPreview = document.getElementById("video-preview");
  const downloadLink = document.getElementById("download-video");
  let videoBlob = null;

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      fileNameSpan.textContent = file.name;
      const url = URL.createObjectURL(file);
      videoPreview.src = url;
      videoPreview.style.display = "block";
      videoBlob = file;
      downloadLink.style.display = "none";
    }
  });

  document.getElementById("convert-video").addEventListener("click", function () {
    if (!videoBlob) {
      alert("Primero selecciona un archivo de video.");
      return;
    }

    const format = document.getElementById("video-format").value;
    const originalName = videoBlob.name.split(".")[0];
    const newFilename = `${originalName}.${format}`;

    // Simula conversión renombrando la extensión
    const fakeConvertedBlob = new Blob([videoBlob], { type: videoBlob.type });
    const downloadUrl = URL.createObjectURL(fakeConvertedBlob);

    downloadLink.href = downloadUrl;
    downloadLink.download = newFilename;
    downloadLink.textContent = `Descargar como ${format.toUpperCase()}`;
    downloadLink.style.display = "inline-block";
  });
});
