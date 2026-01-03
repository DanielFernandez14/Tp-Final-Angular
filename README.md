# ChatAngular — Trabajo Final Integrador

Clon simple de chat desarrollado con **Angular 17** aplicando: **Standalone Components**, **Routing con provideRouter**, **Reactive Forms**, **Control Flow Blocks (@if / @for)**, **CSS nativo responsive** y organización por **services / interfaces / pipes**.

---

## Objetivo

Construir una aplicación estilo chat aplicando los conceptos centrales de Angular 17, con dos paneles (lista de chats + conversación) y navegación por rutas.

---

## Funcionalidades implementadas

### Panel lateral (lista de chats)
- Lista de contactos con **avatar, nombre y estado**: online / offline / última vez.
- **Crear nuevos chats** dinámicamente mediante **formulario reactivo** (validación requerida y minlength).
- Uso de directivas modernas de Angular 17: `@for` y `@if`.:contentReference[oaicite:7]{index=7}

### Panel principal (conversación)
- Historial de mensajes **independiente por chat**.
- Envío de mensaje y **respuesta automática** luego de un retardo.
- Input con **Reactive Forms + validaciones** (required y maxLength).
- Diferenciación visual:
  - Usuario → alineado a la derecha
  - App → alineado a la izquierda:contentReference[oaicite:11]{index=11}

### Routing
- `/chats` → lista (y layout principal)
- `/chats/:id` → detalle de conversación
- `/nuevo` → formulario de creación de chat.

### Extras (bonus)
- Buscador de chats en la barra lateral.
- Pipe personalizado para formateo de fechas.
- Uso de **signals** para el estado global.

---

## Instalación y ejecución (local)

1) Instalar dependencias:
```bash
npm install
```
2) Levantar servidor de desarrollo:
```bash
ng serve -o
```

Abrir en el navegador:

http://localhost:4200