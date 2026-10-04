document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("audio-file");
  const fileNameSpan = document.getElementById("file-name");
  const audioPreview = document.getElementById("audio-preview");
  const downloadLink = document.getElementById("download-audio");
  let audioBlob = null;

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      fileNameSpan.textContent = file.name;
      const url = URL.createObjectURL(file);
      audioPreview.src = url;
      audioPreview.style.display = "block";
      audioBlob = file;
      downloadLink.style.display = "none";  // Oculta botón descarga cuando cambia archivo
    }
  });

  document.getElementById("convert-audio").addEventListener("click", function () {
    if (!audioBlob) {
      alert("Primero selecciona un archivo de audio.");
      return;
    }

    const format = document.getElementById("audio-format").value;
    const originalName = audioBlob.name.split(".")[0];
    const newFilename = `${originalName}.${format}`;

    // Creación de blob "falso" para simular conversión solo cambiando extensión
    const fakeConvertedBlob = new Blob([audioBlob], { type: audioBlob.type });
    const downloadUrl = URL.createObjectURL(fakeConvertedBlob);

    downloadLink.href = downloadUrl;
    downloadLink.download = newFilename;
    downloadLink.textContent = `Descargar como ${format.toUpperCase()}`;
    downloadLink.style.display = "inline-block";
  });
});
