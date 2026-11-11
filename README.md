# Sistema de Gestión de Notas y Tareas (Smart Notes Hub)

> **Actividad Unidad 4 - Desarrollo de Aplicaciones Móviles**  
> **CIPA:** Jezer Martínez Pérez, Mariana Camila Olmos Pérez, Jesús David Guerrero Rada  
> **Tutor:** Evelin Barco Llerena  
> **Programa:** Ingeniería en Software — V Semestre  

---

## 📌 Descripción del Proyecto

Este proyecto implementa una solución integral desacoplada compuesta por:
1. **Backend RESTful:** Servicio desarrollado en **Node.js** con la librería **Express**, que expone un **CRUD completo y funcional** (`GET`, `POST`, `PUT`, `DELETE`, `HEALTH`) para la persistencia y gestión de notas y tareas.
2. **Frontend Móvil / Multiplataforma:** Aplicación desarrollada en **Flutter** con arquitectura desacoplada basada en servicios y gestión reactiva de estado con **Provider**. Cuenta con una interfaz moderna basada en **Material 3 (Fancy UI/UX)**, soporte multiplataforma (Android, Web, Desktop) con resolución dinámica de host (`10.0.2.2` en emulador Android vs `localhost`), filtros en tiempo real, búsqueda reactiva y micro-interacciones.
3. **Documentación Formal:** Entregables académicos completos en formato **PDF** y **Word (.docx)** bajo normas **APA 7.ª edición**.

---

## 🏗️ Arquitectura Técnica

```
app_dev/
├── backend/                       # API REST en Node.js + Express
│   ├── src/
│   │   ├── config/                # Configuración de entorno y puertos
│   │   ├── controllers/           # Controladores con validaciones y respuestas HTTP estandarizadas
│   │   ├── middlewares/           # Manejador global de excepciones y logger (morgan)
│   │   ├── routes/                # Definición de rutas REST (/api/notes, /api/health)
│   │   ├── services/              # Lógica de negocio y persistencia en memoria (con seed data)
│   │   ├── app.js                 # Configuración de Express y CORS universal
│   │   └── server.js              # Arranque del servidor HTTP
│   ├── test/                      # Batería de pruebas automatizadas y de auditoría E2E
│   └── package.json
│
├── lib/                           # Aplicación Cliente Flutter (Material 3)
│   ├── core/
│   │   ├── constants/             # ApiConstants con resolución dinámica de IP/host
│   │   ├── errors/                # ApiException personalizada
│   │   └── theme/                 # Paleta moderna Deep Slate Indigo, Cyan y Material 3
│   ├── models/                    # NoteModel inmutable con serialización JSON
│   ├── providers/                 # NoteProvider (ChangeNotifier reactivo)
│   ├── services/                  # NoteApiService (Cliente HTTP tipado con timeout)
│   ├── screens/                   # HomeScreen (Dashboard) y NoteFormScreen (Formulario Modal)
│   ├── widgets/                   # NoteCard, PriorityBadge, CategoryChipBar, EmptyStateWidget
│   └── main.dart                  # Punto de entrada con inyección de dependencias
│
├── docs/                          # Documentación académica y evidencias
│   ├── Actividad_CRUD_Node_Flutter.docx   # Informe formal editable en Word (APA 7)
│   ├── Actividad_CRUD_Node_Flutter.pdf    # Informe formal en PDF (34 páginas)
│   └── INFORME_AUDITORIA_QA_FASE4.md      # Matriz y reporte de pruebas QA
│
└── pubspec.yaml                   # Dependencias de Flutter (http, provider, intl)
```

---

## 🚀 Guía de Instalación y Ejecución

### 1. Requisitos Previos
* [Node.js](https://nodejs.org/) (versión 18 o superior)
* [Flutter SDK](https://flutter.dev/) (versión 3.13 o superior)
* Git

---

### 2. Despliegue del Backend (API REST)

1. Navegar al directorio del backend:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor:
   ```bash
   npm start
   ```
   *El servidor quedará escuchando en `http://localhost:3000` con CORS activo.*

4. Ejecutar pruebas automatizadas:
   ```bash
   npm test
   ```

---

### 3. Despliegue del Cliente Flutter

1. En una nueva terminal, situarse en la raíz del proyecto:
   ```bash
   cd ..
   ```
2. Instalar paquetes de Flutter:
   ```bash
   flutter pub get
   ```
3. Ejecutar la aplicación:
   * **En Navegador Web (Chrome):**
     ```bash
     flutter run -d chrome
     ```
   * **En Emulador Android:**
     ```bash
     flutter run -d emulator-5554
     ```
   * **En Windows Desktop:**
     ```bash
     flutter run -d windows
     ```

4. Ejecutar suite de pruebas unitarias y de widgets:
   ```bash
   flutter test
   ```

---

## 📡 Especificación de la API REST

| Método | Endpoint | Descripción | Códigos HTTP |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Estado del servidor y timestamp | `200 OK` |
| **GET** | `/api/notes` | Listado completo de notas (soporta `?category=` y `?search=`) | `200 OK` |
| **GET** | `/api/notes/:id` | Obtener detalle de una nota por UUID | `200 OK`, `404 Not Found` |
| **POST** | `/api/notes` | Crear una nueva nota (valida título y contenido) | `201 Created`, `400 Bad Request` |
| **PUT** | `/api/notes/:id` | Actualizar nota existente por UUID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/notes/:id` | Eliminar nota por UUID | `200 OK`, `404 Not Found` |

---

## 📄 Informes y Evidencias de Entrega
Los documentos académicos con matriz de pruebas, diagramas, capturas y anexos de código fuente se encuentran disponibles en la carpeta `docs/`:
* [**Informe en Formato Word (APA 7)**](docs/Actividad_CRUD_Node_Flutter.docx)
* [**Informe en Formato PDF**](docs/Actividad_CRUD_Node_Flutter.pdf)
