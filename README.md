<img width="1553" height="439" alt="image" src="https://github.com/user-attachments/assets/85a094e7-ca40-40ce-8827-dffb572dc426" />

# 🚗 PanaSaldo

**PanaSaldo** es una página web que te permite consultar el saldo de tu **Panapass** 🚦 de forma rápida ⚡, moderna 🖥️ y con funcionalidades extra. Utilizando tu número de **Panapass**, podrás obtener al instante el saldo disponible en tu cuenta.  

> ⚠️ *Este servicio no es oficial de **Panapass** y ha sido creado únicamente con fines educativos 📚 y de demostración.*

## 📝 Descripción  

**PanaSaldo** ofrece una interfaz intuitiva 🎨 y moderna para consultar tu saldo de **Panapass**. Diseñada con **HTML** 📜, **CSS** 🎨, **TailwindCSS**, y **JavaScript** ⚙️, la página proporciona una experiencia de usuario fluida y responsiva 📱.  

La consulta de saldo se realiza de manera eficiente y segura 🔒 a través de una API externa, empleando un servicio de **CORS Proxy** para superar las restricciones de acceso desde el navegador.  

Además de la consulta básica de saldo, **PanaSaldo** incluye funcionalidades adicionales para mejorar tu experiencia.  

## ✨ Nuevas Características  

🔥 **PanaSaldo** ahora va más allá de la simple consulta de saldo, ofreciendo una serie de características adicionales diseñadas para mejorar la experiencia del usuario:  

- 🚀 **Consulta Rápida de Saldo:** Consulta tu saldo Panapass al instante ingresando tu número.  
- 🎨 **Diseño Moderno y Responsivo:** Interfaz atractiva y funcional en cualquier dispositivo gracias a Tailwind CSS.  
- 📊 **Historial de Saldo:**  
  - 📈 **Gráfico de Historial:** Visualiza la evolución de tu saldo con un gráfico interactivo.  
  - 📜 **Historial Reciente:** Accede a un listado de tus últimas consultas de saldo.  
- 💾 **Panapass Guardados:** Guarda tus números de Panapass para consultas futuras más rápidas.  
- ℹ️ **Información Adicional Detallada:** Tras cada consulta, accede a detalles como saldo disponible y fecha de la última consulta.  
- 📰 **Noticias de Tráfico en Panamá:** Mantente informado con las últimas noticias de tráfico de [Traficopanama](https://www.traficopanama.com.pa/) directamente en la barra lateral.  
- 🎨 **Selector de Tema:** Personaliza tu experiencia visual eligiendo entre tema claro y oscuro.  
- ⚡ **Autocompletado Inteligente:** Recibe sugerencias basadas en tus números guardados.  
- ⏳ **Carga Eficiente:** Efecto de carga tipo esqueleto y feedback visual en el botón de consulta.  
- 🔔 **Mensajes Toast:** Notificaciones discretas y elegantes con SweetAlert2.  
- ⚡ **Rendimiento Optimizado:** Limitación de frecuencia de consulta para evitar sobrecargas.  

## ⚠️ Aclaración Importante  

**PanaSaldo** **NO** es una página oficial de **Panapass** ni está afiliada a la Empresa Nacional de Autopistas (**ENA**) de Panamá.  

Este proyecto es una herramienta **independiente y de código abierto**, creada con fines educativos y para demostrar el uso de tecnologías web modernas.  

Para cualquier trámite oficial, gestión de cuenta o inconvenientes con tu **Panapass**, por favor, contacta directamente con los canales oficiales de atención al cliente de **Panapass**.  

## 📸 Screenshot  

<img width="2549" height="1927" alt="image" src="https://github.com/user-attachments/assets/d2c83c08-733f-4eee-88c8-5bc37ca26e37" />

<img width="2549" height="3003" alt="image" src="https://github.com/user-attachments/assets/1d6a5da7-bc36-4abd-b496-32296a782eb2" />

<img width="2549" height="1780" alt="image" src="https://github.com/user-attachments/assets/b5a21dc6-c293-473a-a352-c4b7458a8515" />

<img width="2549" height="1869" alt="image" src="https://github.com/user-attachments/assets/c458a3be-de0b-4614-b1c5-34c361b909b4" />

<img width="2549" height="2385" alt="image" src="https://github.com/user-attachments/assets/3a8c5be8-6012-47a4-8d49-ac7324b99158" />

<img width="2549" height="3146" alt="image" src="https://github.com/user-attachments/assets/c6b10051-9019-458f-8d11-9e6d277166a9" />

<img width="2549" height="2367" alt="image" src="https://github.com/user-attachments/assets/d55d44b8-4d50-421d-9f96-9f6d487b405b" />

<img width="2549" height="1500" alt="image" src="https://github.com/user-attachments/assets/9e5937fd-54e5-4aee-a790-65e8ae2b7775" />

## 🛠️ Tecnologías Usadas  

- 🏗 **HTML**: Estructura y contenido de la página web.  
- 🎨 **CSS**: Estilos personalizados para la presentación visual.  
- 🎨 **Tailwind CSS**: Framework de CSS para un diseño moderno y responsivo.  
- ⚙️ **JavaScript**: Lógica interactiva del sitio, manejo de la API y dinamismo de la interfaz.  
- 📊 **Chart.js**: Librería para la generación de gráficos del historial de saldo.  
- 🔔 **SweetAlert2**: Alertas y notificaciones atractivas (mensajes Toast).  
- 🔄 **API de Panapass**: API pública para la consulta del saldo.  
- 🌍 **CORS Proxy**: Servicio para evitar problemas de CORS al consumir la API desde el navegador.  

## ⚙️ Cómo Funciona  

1. **Ingresa tu Panapass:** Introduce tu número de **Panapass** en el campo de texto.  
2. **Consulta tu Saldo:** Haz clic en el botón "Consultar Saldo".  
3. **Visualiza tu Saldo:** En segundos, **PanaSaldo** mostrará tu saldo actual.  
4. **Explora el Historial y Más:** Revisa las secciones de historial y la información adicional.  

## 🚀 Uso Avanzado: Consulta Automática con Parámetros de URL  

Puedes hacer consultas automáticas usando parámetros en la URL:  

```bash
https://panasaldo-dashboard.vercel.app/?panapass=1234567890
```

## 👨‍💻 Créditos  

- 💻 Desarrollado por [Fl2on](https://github.com/Fl2on).  
- 🎨 Diseño con [Tailwind CSS](https://tailwindcss.com/).  
- 📊 Gráficos con [Chart.js](https://www.chartjs.org/).  
- 🔔 Alertas con [SweetAlert2](https://sweetalert2.github.io/).  
- 🌍 Proxy CORS de [CORS Proxy](https://corsproxy.io/).  
- 📰 Noticias de tráfico de [Traficopanama](https://www.traficopanama.com.pa/).  

## 📜 Licencia  

Este proyecto se distribuye bajo la licencia [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
Consulta el archivo `LICENSE` para más detalles sobre los términos y condiciones de uso, modificación y distribución de este software.  
