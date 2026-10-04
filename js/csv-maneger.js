    // Manejo de carga del archivo CSV
    document.getElementById('csvFile').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        document.getElementById('file-name').textContent = file.name;
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const headers = results.meta.fields;
            allData = results.data;
            createTable(headers, allData);
            displayAllResponsesSummary(headers);
          }
        });
      }
    });
    
    let allData = [];
    const charLimit = 50;
    
    // Función para crear la tabla HTML a partir de los datos parseados
    function createTable(headers, data) {
      const thead = document.getElementById('tableHeader');
      const tbody = document.querySelector('#tablaPersonas tbody');
      thead.innerHTML = '';
      tbody.innerHTML = '';
      
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        thead.appendChild(th);
      });
      
      data.forEach(row => {
        const tr = document.createElement('tr');
        tr.addEventListener('click', () => showDetails(row));
        
        headers.forEach(header => {
          const td = document.createElement('td');
          const text = row[header] || '';
          if (text.length > charLimit) {
            const span = document.createElement('span');
            span.textContent = text.substring(0, charLimit) + '...';
            const button = document.createElement('button');
            button.textContent = 'Show More';
            button.className = 'show-more-button';
            button.onclick = (e) => {
              e.stopPropagation();
              const isExpanded = td.classList.toggle('expanded');
              span.textContent = isExpanded ? text : text.substring(0, charLimit) + '...';
              button.textContent = isExpanded ? 'Show Less' : 'Show More';
            };
            td.appendChild(span);
            td.appendChild(button);
          } else {
            td.textContent = text;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      
      document.getElementById('searchInput').addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const rows = tbody.getElementsByTagName('tr');
        Array.from(rows).forEach(row => {
          let showRow = false;
          Array.from(row.getElementsByTagName('td')).forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchValue)) {
              showRow = true;
            }
          });
          row.style.display = showRow ? '' : 'none';
        });
      });
    }
    
    // Función para mostrar el resumen de respuestas por columna
    function displayAllResponsesSummary(headers) {
      const summaryDiv = document.getElementById('responseSummary');
      let html = '<h3>Resumen de respuestas por columna</h3>';
      
      headers.forEach(header => {
        let totalRespuestas = 0;
        const distribucion = {};
        
        allData.forEach(row => {
          const cell = row[header] ? row[header].trim() : '';
          if (cell !== '') {
            totalRespuestas++;
            distribucion[cell] = (distribucion[cell] || 0) + 1;
          }
        });
        
        const sortedDistribucion = Object.entries(distribucion).sort((a, b) => b[1] - a[1]);
        
        html += `<div class="summary-box">`;
        html += `<div class="column-summary-header" style="cursor:pointer;" onclick="toggleColumnDetails(this)">`;
        html += `<strong>${header}</strong>: ${totalRespuestas} respuesta${totalRespuestas !== 1 ? 's' : ''}`;
        html += `</div>`;
        html += `<div class="column-details" style="display:none; margin-top:8px;">`;
        if (totalRespuestas > 0) {
          html += `<ul>`;
          sortedDistribucion.forEach(([value, count]) => {
            html += `<li>${count} de "${value}"</li>`;
          });
          html += `</ul>`;
        }
        html += `</div></div>`;
      });
      
      summaryDiv.innerHTML = html;
    }
    
    // Función para alternar detalles de columna
    function toggleColumnDetails(element) {
      const details = element.nextElementSibling;
      details.style.display = (details.style.display === "none") ? "block" : "none";
    }
    
    // Función para exportar datos
    function exportar() {
      const format = document.getElementById('exportSelect').value;
      if (format === 'csv') {
        exportarCSV();
      } else if (format === 'json') {
        exportarJSON();
      } else if (format === 'excel') {
        exportarExcel();
      }
    }
    
    function exportarCSV() {
      const csv = Papa.unparse(allData);
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, 'datos.csv');
    }
    
    function exportarJSON() {
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      saveAs(blob, 'datos.json');
    }
    
    function exportarExcel() {
      const ws = XLSX.utils.json_to_sheet(allData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Datos");
      XLSX.writeFile(wb, 'datos.xlsx');
    }
    
    function showDetails(row) {
      const detailBox = document.getElementById('detailBox');
      detailBox.innerHTML = '<h3>Detalles de la Fila</h3>' + Object.entries(row)
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value || 'N/A'}</p>`)
        .join('');
      detailBox.style.display = 'block';
    }