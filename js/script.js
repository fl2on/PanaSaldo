document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const saldoForm = document.getElementById("saldoForm");
  const panapassInput = document.getElementById("panapassInput");
  const resultSection = document.getElementById("resultSection");
  const saldoElement = document.getElementById("saldo");
  const lastDateElement = document.getElementById("lastDate");
  const savedPanapassList = document.getElementById("savedPanapassList");
  const chartSection = document.getElementById("chartSection");
  const saldoChartCtx = document.getElementById("saldoChart").getContext("2d");
  const availableBalance = document.getElementById("availableBalance");
  const recentTransactions = document.getElementById("recentTransactions");
  const showMoreTransactions = document.getElementById("showMoreTransactions");
  const lastConsultDate = document.getElementById("lastConsultDate");

  // Constants
  const RATE_LIMIT_MS = 2000;
  let lastRequestTime = 0;
  let isRequestInProgress = false;
  let saldoChart = null;
  
  // Utility Functions
  function formatCurrency(amount) {
    return new Intl.NumberFormat("es-PA", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function showToast(message, type = "info") {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#1F2937",
      color: "#FFFFFF",
      iconColor:
        type === "error" ? "#EF4444" : type === "success" ? "#10B981" : "#3B82F6",
    });
  }
  

  function updateSavedPanapassList() {
    const savedPanapasses =
      JSON.parse(localStorage.getItem("savedPanapasses")) || [];
    savedPanapassList.innerHTML = "";

    if (savedPanapasses.length === 0) {
      savedPanapassList.innerHTML = `
                <li class="py-6 px-4 text-center text-gray-400">
                    No hay Panapass guardados
                </li>
            `;
      return;
    }

    savedPanapasses.forEach((panapass) => {
      const li = document.createElement("li");
      li.className = "p-4 hover:bg-gray-700/50 transition-colors duration-200";
      li.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                                <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
                            </svg>
                        </div>
                        <span class="font-medium text-white">${panapass}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-3 py-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg transition-colors duration-200" data-action="consult" data-panapass="${panapass}">
                            Consultar
                        </button>
                        <button class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200" data-action="delete" data-panapass="${panapass}">
                            Eliminar
                        </button>
                    </div>
                </div>
            `;
      savedPanapassList.appendChild(li);
    });
  }

  function updateChart(panapass) {
    const historial =
      JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
    const labels = historial.map((entry) =>
      new Date(entry.fecha).toLocaleDateString("es-PA", {
        month: "short",
        day: "numeric",
      })
    );
    const values = historial.map((entry) => entry.saldo);

    if (saldoChart) {
      saldoChart.destroy();
    }

    saldoChart = new Chart(saldoChartCtx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Saldo",
            data: values,
            borderColor: "#7C3AED",
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: "#7C3AED",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#FFFFFF",
              callback: function (value) {
                return formatCurrency(value);
              },
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#FFFFFF",
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return formatCurrency(context.raw);
              },
            },
          },
        },
      },
    });

    chartSection.classList.remove("hidden");
  }

  // Función para actualizar la fecha de la última consulta
  function updateLastConsultDate(panapass) {
    const historial = JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
    if (historial.length > 0) {
      const lastEntry = historial[historial.length - 1];
      lastConsultDate.textContent = new Date(lastEntry.fecha).toLocaleString("es-PA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      lastConsultDate.textContent = "No disponible";
    }
  }

  // Función para mostrar el historial completo de saldos consultados
  function showFullHistory(panapass) {
    const historial = JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
    recentTransactions.innerHTML = historial
      .map(
        (entry) => `
          <li class="flex justify-between items-center py-2">
            <span>${formatCurrency(entry.saldo)}</span>
            <span class="text-gray-500">${new Date(entry.fecha).toLocaleDateString("es-PA", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</span>
          </li>
        `
      )
      .join("");

    showMoreTransactions.style.display = "none"; // Ocultar el botón después de mostrar todo
  }

  async function consultarSaldo(panapass, retries = 3) {
    if (isRequestInProgress) {
      showToast("Ya se está procesando una consulta", "info");
      return;
    }

    const currentTime = Date.now();
    if (currentTime - lastRequestTime < RATE_LIMIT_MS) {
      showToast(
        "Por favor, espera un momento antes de realizar otra consulta",
        "warning"
      );
      return;
    }

    isRequestInProgress = true;
    lastRequestTime = currentTime;

    const submitButton = saldoForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.classList.add("loading");

    try {
      const response = await fetch(
        `https://corsproxy.io/?url=http://api.jlsoftwareapp.com/panapass/get_by_number.php?panapass=${panapass}`,
        {
          headers: {
            "User-Agent":
              "Dalvik/2.1.0 (Linux; U; Android 13; Build/TP1A.220624.014)",
            Connection: "Keep-Alive",
            "Accept-Encoding": "gzip",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "No se encontró información");
      }

      // Guardar en localStorage
      savePanapass(panapass);

      // Guardar en el historial
      const historial =
        JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
      historial.push({
        fecha: new Date().toISOString(),
        saldo: data.saldo,
      });
      localStorage.setItem(`historial_${panapass}`, JSON.stringify(historial));

      // Actualizar la UI
      resultSection.classList.remove("hidden");
      saldoElement.textContent = formatCurrency(data.saldo);
      lastDateElement.textContent = `Última consulta: ${new Date().toLocaleString(
        "es-PA",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      )}`;

      // Actualizar el último saldo consultado y la fecha
      availableBalance.textContent = formatCurrency(data.saldo);
      updateLastConsultDate(panapass);

      // Mostrar el botón "Ver más transacciones"
      showMoreTransactions.style.display = "block";

      // Actualizar el gráfico
      updateChart(panapass);

      showToast("Consulta exitosa", "success");
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => consultarSaldo(panapass, retries - 1), 2000);
      } else {
        showToast(error.message, "error");
      }
    } finally {
      isRequestInProgress = false;
      submitButton.disabled = false;
      submitButton.classList.remove("loading");
    }
  }

  function savePanapass(panapass) {
    const savedPanapasses =
      JSON.parse(localStorage.getItem("savedPanapasses")) || [];
    if (!savedPanapasses.includes(panapass)) {
      savedPanapasses.push(panapass);
      localStorage.setItem("savedPanapasses", JSON.stringify(savedPanapasses));
      updateSavedPanapassList();
    }
  }

  // Event Listeners
  saldoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const panapass = panapassInput.value.trim();

    if (!/^\d{6,10}$/.test(panapass)) {
      showToast("Por favor, ingresa un número de Panapass válido (6-10 dígitos)", "error");
      return;
    }

    consultarSaldo(panapass);
  });

  savedPanapassList.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const panapass = button.getAttribute("data-panapass");

    if (action === "consult") {
      panapassInput.value = panapass;
      consultarSaldo(panapass);
    } else if (action === "delete") {
      Swal.fire({
        title: "¿Eliminar Panapass?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6B00",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        background: "#1F2937",
        color: "#FFFFFF",
      }).then((result) => {
        if (result.isConfirmed) {
          const savedPanapasses =
            JSON.parse(localStorage.getItem("savedPanapasses")) || [];
          const updatedPanapasses = savedPanapasses.filter((p) => p !== panapass);
          localStorage.setItem("savedPanapasses", JSON.stringify(updatedPanapasses));
          updateSavedPanapassList();
          showToast("Panapass eliminado correctamente", "success");
        }
      });
    }
  });

  // Event listener para el botón "Ver más transacciones"
  showMoreTransactions.addEventListener("click", () => {
    showFullHistory(panapassInput.value.trim());
  });

  // Input Validation
  let debounceTimeout;
  panapassInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    }, 300);
  });

  // Initialize
  updateSavedPanapassList();

  // Process URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const urlPanapass = urlParams.get("panapass");
  if (urlPanapass) {
    panapassInput.value = urlPanapass;
    setTimeout(() => consultarSaldo(urlPanapass), 500);
  }
});