document.addEventListener("DOMContentLoaded", () => {
    const panapassInput = document.getElementById("panapassInput");
    const saldoForm = document.getElementById("saldoForm");
    const loadingElement = document.getElementById("loading");
    const resultElement = document.getElementById("result");
    const saldoElement = document.getElementById("saldo");
    const lastDateElement = document.getElementById("lastDate");

    const cache = {};
    const RATE_LIMIT_MS = 2000;
    let lastRequestTime = 0;
    let isRequestInProgress = false;

    function setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split(";").map((c) => c.trim());
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    function getQueryParam(param) {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    }

    const urlPanapass = getQueryParam("panapass");
    const carMode = getQueryParam("carmode") === "true";
    const savedPanapass = getCookie("panapass");
    const savedSaldo = getCookie("saldo");
    const savedDate = getCookie("lastDate");

    if (savedPanapass) {
        panapassInput.value = savedPanapass;
    }

    if (savedSaldo && savedDate) {
        saldoElement.textContent = `Último saldo consultado: $${savedSaldo}`;
        lastDateElement.textContent = `Última consulta: ${new Date(savedDate).toLocaleString()}`;
        resultElement.classList.remove("hidden");
    }

    if (urlPanapass && carMode) {
        panapassInput.value = urlPanapass;
        consultarSaldo(urlPanapass);
    }

    let debounceTimeout;
    panapassInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
        }, 300);
    });

    saldoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const panapass = panapassInput.value.trim();
        if (!/^\d{6,10}$/.test(panapass)) {
            alert("Por favor, ingresa un número de Panapass válido (6-10 dígitos).");
            return;
        }

        if (isRequestInProgress) {
            alert("Ya se está procesando una consulta. Por favor, espera.");
            return;
        }

        setCookie("panapass", panapass);

        if (cache[panapass]) {
            mostrarResultado(cache[panapass]);
            return;
        }

        const currentTime = Date.now();
        if (currentTime - lastRequestTime < RATE_LIMIT_MS) {
            alert("Por favor, espera antes de realizar otra consulta.");
            return;
        }
        lastRequestTime = currentTime;

        consultarSaldo(panapass);
    });

    function consultarSaldo(panapass, retries = 8, delay = 1000) {
        isRequestInProgress = true;

        const submitButton = saldoForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.classList.add("opacity-50", "cursor-not-allowed");

        loadingElement.classList.remove("hidden");
        resultElement.classList.add("hidden");

        fetch(`https://corsproxy.io/?url=http://api.jlsoftwareapp.com/panapass/get_by_number.php?panapass=${panapass}`, {
                headers: {
                    "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 13; Build/TP1A.220624.014)",
                    "Connection": "Keep-Alive",
                    "Accept-Encoding": "gzip"
                }
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (!data.success) {
                    throw new Error(data.message || "No se encontró información.");
                }

                const currentDate = new Date();
                cache[panapass] = {
                    ...data,
                    date: currentDate
                };
                setCookie("saldo", data.saldo);
                setCookie("lastDate", currentDate.toISOString());
                mostrarResultado({
                    ...data,
                    date: currentDate
                });

                setTimeout(() => {
                    if (isAndroid()) {
                        speakText(`Tu saldo disponible es ${data.saldo} dólares.`);
                    }
                }, 100);
            })
            .catch((error) => {
                if (retries > 0) {
                    setTimeout(() => consultarSaldo(panapass, retries - 1, delay * 2), delay);
                } else {
                    alert(`Error al consultar el saldo: ${error.message}`);
                }
            })
            .finally(() => {
                isRequestInProgress = false;
                submitButton.disabled = false;
                submitButton.classList.remove("opacity-50", "cursor-not-allowed");
                loadingElement.classList.add("hidden");
            });
    }

    function mostrarResultado(data) {
        loadingElement.classList.add("hidden");
        resultElement.classList.remove("hidden");
        saldoElement.textContent = `Saldo disponible: $${data.saldo}`;
        lastDateElement.textContent = `Última consulta: ${new Date(data.date).toLocaleString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
        })}`;
    }

    function speakText(text) {
        if ('SpeechSynthesisUtterance' in window && window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "es-ES";
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;

            utterance.onerror = (event) => {
                console.error("Error en la síntesis de voz:", event.error);
                alert("No se pudo realizar la síntesis de voz. Intenta nuevamente.");
            };

            window.speechSynthesis.speak(utterance);
        } else {
            alert("Tu navegador no soporta la síntesis de voz.");
        }
    }

    function isAndroid() {
        return /android/i.test(navigator.userAgent);
    }
});
