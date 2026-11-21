# Estacionamiento de automóviles

Aplicación web escolar para registrar estacionamientos de automóviles, consultar, filtrar, editar, eliminar y mostrar su ubicación en Google Maps.

## Archivos
- `index.html`: estructura de la página.
- `style.css`: diseño adaptable a celular.
- `app.js`: operaciones con Supabase y mapa.
- `supabase.sql`: creación de la tabla y políticas de demostración.

## Configuración de Supabase
1. En el SQL Editor de tu proyecto Supabase, pega y ejecuta `supabase.sql`.
2. En `app.js`, reemplaza `PEGAR_AQUI_URL_DEL_PROYECTO` por la URL del proyecto.
3. Reemplaza `PEGAR_AQUI_CLAVE_PUBLICABLE` por la clave Publishable (`sb_publishable_...`).
4. Nunca uses ni publiques una clave `sb_secret_` o `service_role`.

## Publicar en Render
Crear un Static Site conectado al repositorio de GitHub. Build Command: dejar vacío. Publish Directory: `.`

## Pruebas
- Registrar al menos tres estacionamientos, con coberturas variadas.
- Probar filtros Techado y Al aire libre.
- Ver mapa de dos estacionamientos y verificar sus coordenadas.
- Editar coordenadas, guardar y recargar para comprobar que persisten.
- Intentar latitud 95 y comprobar que se rechaza.
- Editar y eliminar un registro.

## Uso de IA
Completar esta sección después de consultar Google AI Studio: pegar el prompt realmente utilizado, resumir la sugerencia recibida, indicar qué se aplicó o corrigió y describir la prueba que verificó el resultado. No declarar pruebas o consultas que no se hayan realizado.
