document.addEventListener("DOMContentLoaded", () => {
  const panapassInput = document.getElementById("panapassInput");
  const saldoForm = document.getElementById("saldoForm");
  const loadingElement = document.getElementById("loading");
  const resultElement = document.getElementById("result");
  const saldoElement = document.getElementById("saldo");

  panapassInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  });

  saldoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const panapass = panapassInput.value.trim();

    if (!panapass || panapass.length < 1) {
      alert("Por favor, ingresa un número de Panapass válido.");
      return;
    }

    loadingElement.classList.remove("hidden");
    resultElement.classList.add("hidden"); // Ocultar cualquier resultado anterior

    fetch(`https://corsproxy.io/?http://api.jlsoftwareapp.com/panapass/get_by_number.php?panapass=${panapass}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al conectar con el servidor.");
        }
        return response.json();
      })
      .then((data) => {
        loadingElement.classList.add("hidden");

        if (data.success) {
          resultElement.classList.remove("hidden");
          saldoElement.textContent = `Saldo disponible: $${data.saldo}`;
        } else {
          alert("No se encontró información para el número de Panapass ingresado.");
        }
      })
      .catch((error) => {
        loadingElement.classList.add("hidden");
        alert("Ocurrió un error al consultar el saldo. Inténtalo nuevamente más tarde.");
        console.error(error);
      });
  });
});