document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const body = document.body;
    const themeSwitcherButton = document.getElementById("themeSwitcher");
    const themeIcon = document.getElementById("themeIcon");
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
    const resultCard = document.getElementById("resultCard");
    const sidebarNewsSectionContainer = document.getElementById(
        "sidebarNewsSection"
    ); // News section in sidebar

    // Constantes
    const RATE_LIMIT_MS = 2000;
    let lastRequestTime = 0;
    let isRequestInProgress = false;
    let saldoChart = null;

    // Funciones Utilitarias (sin cambios)
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
            background: document.documentElement.classList.contains("theme-light")
                ? "#FFFFFF"
                : "#1F2937",
            color: document.documentElement.classList.contains("theme-light")
                ? "#374151"
                : "#FFFFFF",
            iconColor:
                type === "error" ? "#EF4444" : type === "success" ? "#10B981" : "#3B82F6",
        });
    }

    // Funciones para Panapass Guardados y Listado (ligeramente modificadas para mejor UX)
    function updateSavedPanapassList() {
        const savedPanapasses =
            JSON.parse(localStorage.getItem("savedPanapasses")) || [];
        savedPanapassList.innerHTML = "";

        if (savedPanapasses.length === 0) {
            savedPanapassList.innerHTML = `
                <li class="saved-panapass-item py-4 px-3 text-center text-gray-400">
                  No hay Panapass guardados aun.
                </li>
              `;
            return;
        }

        savedPanapasses.forEach((panapass) => {
            const li = document.createElement("li");
            li.className = "saved-panapass-item";
            li.innerHTML = `
                <div class="panapass-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="currentColor"/>
                  </svg>
                </div>
                <div class="panapass-number-col">
                  <span class="panapass-number">${panapass}</span>
                  <p class="text-xs text-gray-500 last-consult-info" data-panapass="${panapass}">Cargando última consulta...</p>
                </div>
                <div class="panapass-actions flex space-x-2">
                  <button class="panapass-actions-btn" data-action="consult" data-panapass="${panapass}">
                    Consultar
                  </button>
                  <button class="panapass-actions-btn" data-action="delete" data-panapass="${panapass}">
                    Eliminar
                  </button>
                </div>
              `;
            savedPanapassList.appendChild(li);

            // Cargar la última fecha de consulta y el último saldo para este Panapass (ahora actualizado dentro del item)
            loadLastConsultInfoInList(
                panapass,
                li.querySelector(".last-consult-info")
            );
        });
    }

    // Función para cargar solo la última info de consulta (fecha y saldo) en la lista
    function loadLastConsultInfoInList(panapass, infoElement) {
        const lastBalance = localStorage.getItem(`lastBalance_${panapass}`);
        const lastConsultDateSaved = localStorage.getItem(
            `lastConsultDate_${panapass}`
        );

        let infoText = "Nunca Consultado"; // Texto por defecto si no hay historial

        if (lastConsultDateSaved) {
            const date = new Date(lastConsultDateSaved).toLocaleDateString("es-PA", {
                month: "short",
                day: "numeric",
            });
            const time = new Date(lastConsultDateSaved).toLocaleTimeString("es-PA", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            infoText = `Saldo: ${formatCurrency(
                parseFloat(lastBalance) || 0
            )} - ${date} ${time}`;
        }

        infoElement.textContent = infoText;
    }

    // Funciones Chart y Historial (sin cambios relevantes)
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
                        borderColor: getComputedStyle(
                            document.documentElement
                        ).getPropertyValue("--color-secondary"),
                        backgroundColor:
                            getComputedStyle(document.documentElement).getPropertyValue(
                                "--color-primary"
                            ) + "10",
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: getComputedStyle(
                            document.documentElement
                        ).getPropertyValue("--color-secondary"),
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
                            color: getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--color-border-dark"),
                        },
                        ticks: {
                            color: getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--color-text-primary-dark"),
                            callback: function (value) {
                                return formatCurrency(value);
                            },
                        },
                    },
                    x: {
                        grid: {
                            color: getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--color-border-dark"),
                        },
                        ticks: {
                            color: getComputedStyle(
                                document.documentElement
                            ).getPropertyValue("--color-text-primary-dark"),
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

    function updateLastConsultDate(panapass) {
        const historial =
            JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
        if (historial.length > 0) {
            const lastEntry = historial[historial.length - 1];
            lastConsultDate.textContent = new Date(lastEntry.fecha).toLocaleString(
                "es-PA",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                }
            );
        } else {
            lastConsultDate.textContent = "No disponible";
        }
    }

    function loadLastConsultData(panapass) {
        const lastBalance = localStorage.getItem(`lastBalance_${panapass}`);
        const lastConsultDateSaved = localStorage.getItem(
            `lastConsultDate_${panapass}`
        );

        if (lastBalance) {
            availableBalance.textContent = formatCurrency(parseFloat(lastBalance));
        } else {
            availableBalance.textContent = formatCurrency(0);
        }

        if (lastConsultDateSaved) {
            lastConsultDate.textContent = new Date(
                lastConsultDateSaved
            ).toLocaleString("es-PA", {
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

    function showFullHistory(panapass) {
        const historial =
            JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
        recentTransactions.innerHTML = historial
            .map(
                (entry) => `
                  <li class="history-item">
                    <span class="history-value">${formatCurrency(
                        entry.saldo
                    )}</span>
                    <span class="history-date">${new Date(
                        entry.fecha
                    ).toLocaleDateString("es-PA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}</span>
                  </li>
                `
            )
            .join("");

        showMoreTransactions.style.display = "none";
    }

    // --- NEWS SECTION (SIDEBAR) ---
    async function scrapeTraficoPanamaNewsSidebar() {
        try {
            const corsProxyUrl = 'https://corsproxy.io/?url=';
            const targetUrl = 'https://traficopanama.com.pa/nacionales/';
            const response = await fetch(corsProxyUrl + targetUrl);
            if (!response.ok) {
                throw new Error(`Error fetching news: ${response.status} ${response.statusText}`);
            }
            const htmlContent = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, "text/html");
            const posts = doc.querySelectorAll(".post_day");

            let newsItemsHTML = '<ul class="sidebar-news-list">';

            posts.forEach((post) => {
                const titleElement = post.querySelector("h3 a");
                const link = titleElement ? titleElement.getAttribute("href") : "#";
                const title = titleElement ? titleElement.textContent.trim() : "Titulo no disponible";
                const imageElement = post.querySelector(".float-shadow img");
                const imageUrl = imageElement
                    ? imageElement.getAttribute("src")
                    : "img/placeholder-news.jpg"; // Default placeholder image

                newsItemsHTML += `
                  <li class="sidebar-news-item">
                    <img src="${imageUrl}" alt="${title}" class="sidebar-news-item-image">
                    <div class="sidebar-news-item-content">
                      <h4 class="sidebar-news-item-title">${title}</h4>
                      <a href="https://traficopanama.com.pa${link}" class="sidebar-news-item-link" target="_blank">Leer mas</a>
                    </div>
                  </li>
                `;
            });

            newsItemsHTML += "</ul>";
            return newsItemsHTML;

        } catch (error) {
            console.error("Error scraping news:", error);
            return '<p class="error-message">No se pudieron cargar las noticias.</p>';
        }
    }


    // Consulta de Saldo (sin cambios relevantes en la logica principal, solo clases CSS actualizadas)
    async function consultarSaldo(panapass, retries = 3) {
        if (isRequestInProgress) {
            showToast("Ya se esta procesando una consulta", "info");
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

        // INICIO CARGA (EFECTO ESQUELETO + CAMBIO COLOR BOTÓN)
        resultCard.classList.add("skeleton-loading");
        submitButton.classList.add("active-loading");
        submitButton.disabled = true;
        saldoElement.textContent = "Cargando...";

        try {
            const response = await fetch(
                `https://corsproxy.io/?url=https://thingproxy.freeboard.io/fetch/http://api.jlsoftwareapp.com/panapass/get_by_number.php?panapass=${panapass}`,
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

            // Guardar en localStorage y actualizar UI (sin cambios relevantes)
            savePanapass(panapass);

            const historial =
                JSON.parse(localStorage.getItem(`historial_${panapass}`)) || [];
            historial.push({
                fecha: new Date().toISOString(),
                saldo: data.saldo,
            });
            localStorage.setItem(`historial_${panapass}`, JSON.stringify(historial));

            resultSection.classList.remove("hidden");
            saldoElement.textContent = formatCurrency(data.saldo);
            lastDateElement.textContent = `Ultima consulta: ${new Date().toLocaleString(
                "es-PA",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    hour12: true,
                }
            )}`;

            availableBalance.textContent = formatCurrency(data.saldo);
            updateLastConsultDate(panapass);

            localStorage.setItem(`lastBalance_${panapass}`, data.saldo);
            localStorage.setItem(`lastConsultDate_${panapass}`, new Date().toISOString());

            showMoreTransactions.style.display = "block";

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
            // FINALIZAR CARGA (QUITAR EFECTO ESQUELETO + COLOR BOTÓN)
            resultCard.classList.remove("skeleton-loading");
            submitButton.classList.remove("active-loading");
            if (!resultSection.classList.contains("hidden")) {
                saldoElement.textContent = formatCurrency(
                    localStorage.getItem(`lastBalance_${panapass}`) || 0
                );
            } else {
                saldoElement.textContent = "Saldo";
            }
        }
    }

    // Funciones Save Panapass y Autocomplete (sin cambios relevantes)
    function savePanapass(panapass) {
        const savedPanapasses =
            JSON.parse(localStorage.getItem("savedPanapasses")) || [];
        if (!savedPanapasses.includes(panapass)) {
            savedPanapasses.push(panapass);
            localStorage.setItem("savedPanapasses", JSON.stringify(savedPanapasses));
            updateSavedPanapassList();
            updateInputSuggestions();
        }
    }

    function updateInputSuggestions() {
        const savedPanapasses =
            JSON.parse(localStorage.getItem("savedPanapasses")) || [];
        autocompleteInput(panapassInput, savedPanapasses);
    }

    function autocompleteInput(inputElement, suggestionList) {
        let currentFocus;

        inputElement.addEventListener("input", function (e) {
            let a,
                b,
                i,
                val = this.value;
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < suggestionList.length; i++) {
                if (
                    suggestionList[i].toUpperCase().startsWith(val.toUpperCase())
                ) {
                    b = document.createElement("DIV");
                    b.innerHTML =
                        "<strong>" + suggestionList[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += suggestionList[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + suggestionList[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inputElement.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });

        inputElement.addEventListener("keydown", function (e) {
            let x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);
            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            }
        });

        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = x.length - 1;
            x[currentFocus].classList.add("autocomplete-active");
        }

        function removeActive(x) {
            for (let i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-active");
            }
        }

        function closeAllLists(elmnt) {
            let x = document.getElementsByClassName("autocomplete-items");
            for (let i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inputElement) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }

    // Event Listeners (sin cambios relevantes en la lógica)
    saldoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const panapass = panapassInput.value.trim();

        if (!/^\d{6,10}$/.test(panapass)) {
            showToast(
                "Por favor, ingresa un numero de Panapass valido (6-10 digitos)",
                "error"
            );
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
                title: "Eliminar Panapass?",
                text: "Esta accion no se puede deshacer",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#FF6B00",
                cancelButtonColor: "#6B7280",
                confirmButtonText: "Si, eliminar",
                cancelButtonText: "Cancelar",
                background: document.documentElement.classList.contains("theme-light")
                    ? "#FFFFFF"
                    : "#1F2937",
                color: document.documentElement.classList.contains("theme-light")
                    ? "#374151"
                    : "#FFFFFF",
            }).then((result) => {
                if (result.isConfirmed) {
                    const savedPanapasses =
                        JSON.parse(localStorage.getItem("savedPanapasses")) || [];
                    const updatedPanapasses = savedPanapasses.filter(
                        (p) => p !== panapass
                    );
                    localStorage.setItem(
                        "savedPanapasses",
                        JSON.stringify(updatedPanapasses)
                    );
                    updateSavedPanapassList();
                    showToast("Panapass eliminado correctamente", "success");
                    updateInputSuggestions();
                }
            });
        }
    });

    showMoreTransactions.addEventListener("click", () => {
        showFullHistory(panapassInput.value.trim());
    });

    // Input Validation (sin cambios)
    let debounceTimeout;
    panapassInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
        }, 300);
    });

    // Theme Switcher (mejorado para cambiar el icono)
    themeSwitcherButton.addEventListener("click", () => {
        body.classList.toggle("theme-light");
        const currentTheme = body.classList.contains("theme-light") ? "light" : "dark";
        localStorage.setItem("theme", currentTheme);
        updateThemeIcon(currentTheme); // Actualizar el icono al cambiar tema
        Swal.fire.getPopup()?.remove(); // Recargar SweetAlert2 theme
    });

    function updateThemeIcon(theme) {
        if (theme === "light") {
            themeIcon.innerHTML = `<svg class="theme-icon moon light-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a9.5 9.5 0 0 0-9.5 9.5c0 5 4.5 8.5 9.5 8.5s9.5-3.5 9.5-8.5a9.5 9.5 0 0 0-9.5-9.5z"/>
</svg>`; // Icono de luna para tema claro
        } else {
            themeIcon.innerHTML = `<svg id="themeIcon" class="theme-icon sun dark-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" />
                    </svg>`; // Icono de sol para tema oscuro
        }
    }

    // Inicialización
    function setInitialTheme() {
        const savedTheme = localStorage.getItem("theme") || "dark";
        if (savedTheme === "light") {
            body.classList.add("theme-light");
        }
        updateThemeIcon(savedTheme); // Establecer el icono inicial del tema
    }

    // Actualización automática del año de copyright
    function updateCopyrightYear() {
        const currentYear = new Date().getFullYear();
        document.getElementById("copyrightYear").textContent = currentYear;
    }

    updateCopyrightYear();

    function loadTwitterEmbed() {
        const twitterContainer = document.getElementById("twitterFeed");
        twitterContainer.innerHTML = `
    <a class="twitter-timeline"
        href="https://www.instagram.com/traficocpanama/"
        data-tweet-limit="1">
    News by @traficocpanama
    </a>
    `;
    }

    setInitialTheme();
    updateSavedPanapassList();
    updateInputSuggestions();
    loadTwitterEmbed(); // Load Twitter embed

    // Load News Section in Sidebar (CALL REAL SCRAPING FUNCTION)
    scrapeTraficoPanamaNewsSidebar().then(newsHTML => {
        sidebarNewsSectionContainer.innerHTML = newsHTML;
    });


    // Process URL parameters (sin cambios)
    const urlParams = new URLSearchParams(window.location.search);
    const urlPanapass = urlParams.get("panapass");
    if (urlPanapass) {
        panapassInput.value = urlPanapass;
        setTimeout(() => consultarSaldo(urlPanapass), 500);
        loadLastConsultData(urlPanapass);
    } else {
        const savedPanapasses =
            JSON.parse(localStorage.getItem("savedPanapasses")) || [];
        if (savedPanapasses.length > 0) {
            loadLastConsultData(savedPanapasses[0]);
        }
    }
});
