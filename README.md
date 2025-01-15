![image](https://github.com/user-attachments/assets/2c36151d-dc1f-4f3c-b85e-1ab58dea8ca8)

# PanaSaldo

**PanaSaldo** es una página web que permite consultar el saldo de un pase de peaje de autopista en Panamá. Utilizando el número de tu **Panapass**, podrás obtener de forma rápida y sencilla la cantidad disponible en tu cuenta. Este servicio no es oficial de **Panapass** y es creado únicamente con fines educativos.

## Descripción

La página permite consultar el saldo del **Panapass** de manera fácil, utilizando el número de tu panapass. La interfaz es moderna y diseñada con **HTML**, **CSS**, **TailwindCSS**, y **JavaScript** para ofrecer una experiencia de usuario fluida. La consulta se realiza de manera segura a través de una API externa, usando un servicio de **CORS Proxy** para permitir la interacción con la API desde el navegador.

## Aclaración Importante

**PanaSaldo** no es una página oficial de **Panapass** ni está asociada con la empresa que administra el sistema de peaje. Esta es una herramienta de terceros creada con fines informativos, y la consulta del saldo es realizada a través de una API pública de **Panapass**. Para realizar acciones oficiales o problemas con tu cuenta, te recomendamos que contactes directamente con el servicio oficial de **Panapass**.

## Screenshot

![image](https://github.com/user-attachments/assets/0da3f090-4939-47ef-bce8-36ad4ca6867b)

## Tecnologías Usadas

- **HTML**: Estructura básica de la página.
- **CSS**: Estilos personalizados para mejorar la presentación.
- **Tailwind CSS**: Framework de CSS para diseño responsivo y moderno.
- **JavaScript**: Lógica de interactividad, incluyendo la consulta de saldo desde la API.
- **API de Panapass**: Para obtener el saldo del pase.
- **CORS Proxy**: Para evitar restricciones de acceso a la API desde el navegador.

## Cómo Funciona

1. Ingresa el número de tu **Panapass** en el campo correspondiente.
2. Haz clic en "Consultar Saldo".
3. Se realizará una solicitud a la API para obtener el saldo de tu pase.
4. El saldo será mostrado en la pantalla.

## Uso Avanzado: Consulta Automática con Parámetros de URL

Puedes acceder a la funcionalidad de consulta automática y dictado de saldo utilizando parámetros en la URL. Aquí tienes algunos ejemplos de uso:

### Consulta Automática del Saldo
Para que el saldo se consulte automáticamente al abrir la página, incluye el número de **Panapass** como parámetro en la URL:

```bash
https://fl2on.github.io/PanaSaldo/?panapass=211870
```

### Notas:
- Si no incluyes el parámetro `panapass`, la consulta automática no se realizará.
- El dictado por voz solo se habilita si el agente del navegador es android.

## Licencia

Este proyecto está bajo la **Apache 2.0**. Para más detalles, consulta el archivo **LICENSE**.
