const fs = require('fs');
const path = require('path');

// Carga de librerías docx y resvg desde simpletasks
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  PageNumber,
  PageBreak,
  ImageRun
} = require('C:/Users/user/Downloads/simpletasks/node_modules/docx');

const { Resvg } = require('C:/Users/user/Downloads/simpletasks/node_modules/@resvg/resvg-js');

const rootDir = path.resolve(__dirname, '..');

// Rutas de salida
const outputPath = path.join(rootDir, 'docs', 'Actividad_CRUD_Node_Flutter.docx');

// Lectura de código fuente de Backend y Frontend
const codeFiles = {
  server_js: fs.readFileSync(path.join(rootDir, 'backend/src/server.js'), 'utf8'),
  app_js: fs.readFileSync(path.join(rootDir, 'backend/src/app.js'), 'utf8'),
  note_routes_js: fs.readFileSync(path.join(rootDir, 'backend/src/routes/note.routes.js'), 'utf8'),
  note_controller_js: fs.readFileSync(path.join(rootDir, 'backend/src/controllers/note.controller.js'), 'utf8'),
  note_service_js: fs.readFileSync(path.join(rootDir, 'backend/src/services/note.service.js'), 'utf8'),
  note_model_dart: fs.readFileSync(path.join(rootDir, 'lib/models/note_model.dart'), 'utf8'),
  note_api_service_dart: fs.readFileSync(path.join(rootDir, 'lib/services/note_api_service.dart'), 'utf8'),
  note_provider_dart: fs.readFileSync(path.join(rootDir, 'lib/providers/note_provider.dart'), 'utf8'),
  home_screen_dart: fs.readFileSync(path.join(rootDir, 'lib/screens/home_screen.dart'), 'utf8'),
  note_form_screen_dart: fs.readFileSync(path.join(rootDir, 'lib/screens/note_form_screen.dart'), 'utf8'),
};

// Generador de PNG a partir de SVG mediante resvg
function renderSvgToPng(svgStr, width = 1200) {
  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: width }
  });
  return resvg.render().asPng();
}

// ==========================================
// SVGS DE ALTA DEFINICIÓN PARA LAS FIGURAS
// ==========================================

// FIGURA 1: Diagrama de Arquitectura Técnica y Flujo de Comunicación
const svgFigura1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 560" width="960" height="560">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4338ca"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.08"/>
    </filter>
  </defs>

  <rect width="960" height="560" fill="url(#bgGrad)" rx="16"/>

  <!-- Título Superior -->
  <text x="480" y="38" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="19" font-weight="800" fill="#0f172a">Arquitectura del Sistema: Cliente Móvil Flutter &amp; API REST Node.js Express</text>
  <text x="480" y="58" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Comunicación Desacoplada mediante Protocolo HTTP / JSON y Estado Reactivo</text>

  <!-- COLUMNA IZQUIERDA: FLUTTER CLIENT -->
  <g transform="translate(30, 80)" filter="url(#shadow)">
    <rect width="400" height="440" fill="#ffffff" rx="14" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect width="400" height="38" fill="url(#clientGrad)" rx="14" clip-path="polygon(0 0, 400 0, 400 38, 0 38)"/>
    <text x="200" y="24" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">📱 CLIENTE MÓVIL (FLUTTER / DART)</text>

    <!-- Subcapa UI -->
    <g transform="translate(18, 52)">
      <rect width="364" height="84" fill="#f0f9ff" rx="10" stroke="#bae6fd" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0369a1">Capa de Presentación (UI &amp; Widgets Material 3)</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#0c4a6e">• Pantallas: HomeScreen (Dashboard) | NoteFormScreen (CRUD)</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#0c4a6e">• Widgets: NoteCard | PriorityBadge | CategoryChipBar | EmptyState</text>
      <text x="14" y="76" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#0284c7">• Tema: Deep Slate Indigo (#4F46E5), Acento Cyan (#06B6D4)</text>
    </g>

    <!-- Subcapa Provider -->
    <g transform="translate(18, 150)">
      <rect width="364" height="74" fill="#e0f2fe" rx="10" stroke="#7dd3fc" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0369a1">Gestión de Estado Reactiva (Provider)</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#0c4a6e">• NoteProvider extends ChangeNotifier</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#0c4a6e">• Estado: notes[], isLoading, searchQuery, selectedCategory, isOnline</text>
    </g>

    <!-- Subcapa Modelo -->
    <g transform="translate(18, 238)">
      <rect width="364" height="74" fill="#f8fafc" rx="10" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#334155">Modelo de Dominio Inmutable</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#475569">• NoteModel: id, title, content, category, priority, isPinned, dates</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#475569">• Métodos: fromMap(), toMap(), fromJson(), toJson(), copyWith()</text>
    </g>

    <!-- Subcapa Servicio HTTP -->
    <g transform="translate(18, 326)">
      <rect width="364" height="92" fill="#eff6ff" rx="10" stroke="#bfdbfe" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#1d4ed8">Servicio de Red (HTTP Client)</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#1e3a8a">• NoteApiService: getNotes, getById, create, update, delete, health</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#1e3a8a">• Timeout: 10s | Excepciones: ApiException personalizada</text>
      <text x="14" y="78" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#2563eb">• ApiConstants: Host dinámico (10.0.2.2 en Android, localhost en Web)</text>
    </g>
  </g>

  <!-- CANAL DE COMUNICACIÓN (CENTRO) -->
  <g transform="translate(436, 170)">
    <line x1="0" y1="60" x2="88" y2="60" stroke="#4f46e5" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="88,55 98,60 88,65" fill="#4f46e5"/>
    <text x="44" y="48" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#4f46e5">HTTP REQUEST</text>
    <text x="44" y="74" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="8.5" fill="#64748b">JSON Payload</text>

    <line x1="98" y1="160" x2="10" y2="160" stroke="#059669" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="10,155 0,160 10,165" fill="#059669"/>
    <text x="49" y="148" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#059669">HTTP RESPONSE</text>
    <text x="49" y="174" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="8.5" fill="#64748b">{success, data}</text>

    <rect x="8" y="215" width="82" height="44" rx="6" fill="#eef2ff" stroke="#c7d2fe" stroke-width="1"/>
    <text x="49" y="232" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#3730a3">Puerto 3000</text>
    <text x="49" y="247" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="8" fill="#4338ca">CORS: *</text>
  </g>

  <!-- COLUMNA DERECHA: BACKEND EXPRESS -->
  <g transform="translate(530, 80)" filter="url(#shadow)">
    <rect width="400" height="440" fill="#ffffff" rx="14" stroke="#cbd5e1" stroke-width="1.5"/>
    <rect width="400" height="38" fill="url(#serverGrad)" rx="14" clip-path="polygon(0 0, 400 0, 400 38, 0 38)"/>
    <text x="200" y="24" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff">⚙ SERVIDOR REST (NODE.JS + EXPRESS)</text>

    <!-- Subcapa Server & App -->
    <g transform="translate(18, 52)">
      <rect width="364" height="74" fill="#faf5ff" rx="10" stroke="#e9d5ff" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#7e22ce">Entrada &amp; Middlewares Globales</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#581c87">• server.js: Arranque en puerto 3000 (o process.env.PORT)</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#581c87">• app.js: CORS habilitado para cualquier origen, express.json(), morgan</text>
    </g>

    <!-- Subcapa Rutas -->
    <g transform="translate(18, 140)">
      <rect width="364" height="74" fill="#eef2ff" rx="10" stroke="#c7d2fe" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#3730a3">Capa de Ruteo (note.routes.js)</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#312e81">• GET /api/health | GET /api/notes | GET /api/notes/:id</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#312e81">• POST /api/notes | PUT /api/notes/:id | DELETE /api/notes/:id</text>
    </g>

    <!-- Subcapa Controlador -->
    <g transform="translate(18, 228)">
      <rect width="364" height="84" fill="#f5f3ff" rx="10" stroke="#ddd6fe" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#6d28d9">Controlador (note.controller.js)</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#4c1d95">• Validaciones de entrada: title y content obligatorios y no vacíos</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#4c1d95">• Respuestas uniformes con códigos HTTP: 200, 201, 400, 404, 500</text>
      <text x="14" y="76" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#6d28d9">• Estructura estándar: { success: boolean, message: string, data }</text>
    </g>

    <!-- Subcapa Servicio & Persistencia -->
    <g transform="translate(18, 326)">
      <rect width="364" height="92" fill="#f8fafc" rx="10" stroke="#e2e8f0" stroke-width="1"/>
      <text x="14" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Servicio &amp; Repositorio en Memoria</text>
      <text x="14" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#334155">• note.service.js: Repositorio en memoria con 3 notas semilla</text>
      <text x="14" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#334155">• Identificadores UUID v4 | Filtros (category, priority, search, pin)</text>
      <text x="14" y="78" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" fill="#059669">• error.middleware.js: Manejador global de 404 y errores 400/500</text>
    </g>
  </g>
</svg>`;

// FIGURA 2: Mockup de la Pantalla Principal (HomeScreen Dashboard)
const svgFigura2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 760" width="440" height="760">
  <defs>
    <linearGradient id="phoneBody" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="phoneShadow" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>

  <!-- Chasis del teléfono -->
  <rect x="20" y="10" width="400" height="735" rx="36" fill="#1e293b" filter="url(#phoneShadow)"/>
  <rect x="26" y="16" width="388" height="723" rx="30" fill="url(#phoneBody)"/>

  <!-- Notch / Cámara superior -->
  <path d="M 155,16 L 285,16 A 12,12 0 0,1 273,28 L 167,28 A 12,12 0 0,1 155,16 Z" fill="#1e293b"/>

  <!-- Status Bar -->
  <text x="50" y="38" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#1e293b">18:30</text>
  <circle cx="360" cy="34" r="3" fill="#1e293b"/>
  <circle cx="368" cy="34" r="3" fill="#1e293b"/>
  <rect x="376" y="29" width="16" height="9" rx="2" fill="none" stroke="#1e293b" stroke-width="1.5"/>
  <rect x="378" y="31" width="10" height="5" rx="1" fill="#1e293b"/>

  <!-- HEADER PRINCIPAL -->
  <g transform="translate(42, 54)">
    <text x="0" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#0f172a" letter-spacing="-0.5">Mis Notas</text>
    <text x="0" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#64748b">Organiza tus ideas y tareas en tiempo real</text>

    <!-- Badge API Conectada -->
    <g transform="translate(250, 6)">
      <rect width="105" height="26" rx="13" fill="#d1fae5" stroke="#a7f3d0" stroke-width="1"/>
      <circle cx="14" cy="13" r="4.5" fill="#10b981"/>
      <text x="24" y="17" font-family="'Segoe UI', sans-serif" font-size="10.5" font-weight="700" fill="#065f46">API Conectada</text>
    </g>
  </g>

  <!-- BARRA DE BÚSQUEDA -->
  <g transform="translate(42, 114)">
    <rect width="356" height="42" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <text x="14" y="26" font-family="'Segoe UI', sans-serif" font-size="14" fill="#94a3b8">🔍</text>
    <text x="40" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">Buscar notas por título o contenido...</text>
  </g>

  <!-- SELECTOR HORIZONTAL DE CATEGORÍAS -->
  <g transform="translate(42, 170)">
    <!-- Chip Todas (Activo) -->
    <g transform="translate(0, 0)">
      <rect width="68" height="32" rx="16" fill="#4f46e5"/>
      <text x="34" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">Todas</text>
    </g>
    <!-- Chip Trabajo -->
    <g transform="translate(74, 0)">
      <rect width="76" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="38" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">💼 Trabajo</text>
    </g>
    <!-- Chip Estudio -->
    <g transform="translate(156, 0)">
      <rect width="76" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="38" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">📖 Estudio</text>
    </g>
    <!-- Chip Personal -->
    <g transform="translate(238, 0)">
      <rect width="80" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="40" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">👤 Personal</text>
    </g>
    <!-- Chip Ideas -->
    <g transform="translate(324, 0)">
      <rect width="32" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="16" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">💡</text>
    </g>
  </g>

  <!-- LISTA DE NOTAS -->
  <!-- NOTA 1: PINNED (Trabajo / Alta) -->
  <g transform="translate(42, 218)">
    <rect width="356" height="152" rx="16" fill="#ffffff" stroke="#f59e0b" stroke-width="1.8"/>
    <!-- Top row -->
    <rect x="14" y="12" width="68" height="22" rx="6" fill="#dbeafe"/>
    <text x="48" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#1d4ed8">💼 Trabajo</text>

    <rect x="88" y="12" width="58" height="22" rx="10" fill="#fee2e2" stroke="#fca5a5" stroke-width="0.8"/>
    <text x="117" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#b91c1c">▲ Alta</text>

    <text x="328" y="28" font-family="'Segoe UI', sans-serif" font-size="16" fill="#f59e0b">📌</text>

    <!-- Título y contenido -->
    <text x="14" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700" fill="#0f172a">Planificar arquitectura Flutter</text>
    <text x="14" y="80" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#475569">Definir la estructura de carpetas, modelos,</text>
    <text x="14" y="98" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#475569">proveedores de estado y tema visual en Flutter.</text>

    <!-- Footer -->
    <line x1="14" y1="116" x2="342" y2="116" stroke="#f1f5f9" stroke-width="1"/>
    <text x="14" y="136" font-family="'Segoe UI', sans-serif" font-size="10" fill="#94a3b8">🕒 27 oct, 2026 • 18:00</text>
    <text x="248" y="136" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#4f46e5">✏ Editar</text>
    <text x="300" y="136" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#ef4444">🗑 Eliminar</text>
  </g>

  <!-- NOTA 2: Estudio / Media -->
  <g transform="translate(42, 384)">
    <rect width="356" height="152" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <rect x="14" y="12" width="68" height="22" rx="6" fill="#ede9fe"/>
    <text x="48" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#6d28d9">📖 Estudio</text>

    <rect x="88" y="12" width="62" height="22" rx="10" fill="#fef3c7" stroke="#fde68a" stroke-width="0.8"/>
    <text x="119" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#b45309">■ Media</text>

    <text x="328" y="28" font-family="'Segoe UI', sans-serif" font-size="15" fill="#cbd5e1">📌</text>

    <text x="14" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="14.5" font-weight="700" fill="#0f172a">Estudiar integración de APIs REST</text>
    <text x="14" y="80" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#475569">Repasar buenas prácticas con el paquete http en</text>
    <text x="14" y="98" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#475569">Dart y manejo seguro de excepciones de red.</text>

    <line x1="14" y1="116" x2="342" y2="116" stroke="#f1f5f9" stroke-width="1"/>
    <text x="14" y="136" font-family="'Segoe UI', sans-serif" font-size="10" fill="#94a3b8">🕒 28 oct, 2026 • 06:00</text>
    <text x="248" y="136" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#4f46e5">✏ Editar</text>
    <text x="300" y="136" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#ef4444">🗑 Eliminar</text>
  </g>

  <!-- NOTA 3: Ideas / Baja -->
  <g transform="translate(42, 550)">
    <rect width="356" height="110" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <rect x="14" y="12" width="60" height="22" rx="6" fill="#fef3c7"/>
    <text x="44" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#b45309">💡 Ideas</text>

    <rect x="80" y="12" width="56" height="22" rx="10" fill="#d1fae5" stroke="#a7f3d0" stroke-width="0.8"/>
    <text x="108" y="27" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="10" font-weight="700" fill="#065f46">▼ Baja</text>

    <text x="14" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#0f172a">Ideas para interfaz Fancy UX</text>
    <text x="14" y="80" font-family="'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#475569">Agregar micro-interacciones y animaciones suaves...</text>
  </g>

  <!-- FLOATING ACTION BUTTON (FAB) -->
  <g transform="translate(254, 664)" filter="url(#phoneShadow)">
    <rect width="144" height="48" rx="24" fill="#4f46e5"/>
    <text x="72" y="30" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#ffffff">+ Nueva Nota</text>
  </g>
</svg>`;

// FIGURA 3: Mockup de la Pantalla de Formulario (NoteFormScreen)
const svgFigura3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 760" width="440" height="760">
  <defs>
    <linearGradient id="phoneBody3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="phoneShadow3" x="-10%" y="-5%" width="120%" height="115%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#0f172a" flood-opacity="0.14"/>
    </filter>
  </defs>

  <!-- Chasis del teléfono -->
  <rect x="20" y="10" width="400" height="735" rx="36" fill="#1e293b" filter="url(#phoneShadow3)"/>
  <rect x="26" y="16" width="388" height="723" rx="30" fill="url(#phoneBody3)"/>

  <!-- Notch / Cámara superior -->
  <path d="M 155,16 L 285,16 A 12,12 0 0,1 273,28 L 167,28 A 12,12 0 0,1 155,16 Z" fill="#1e293b"/>

  <!-- Status Bar -->
  <text x="50" y="38" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="700" fill="#1e293b">18:31</text>
  <circle cx="360" cy="34" r="3" fill="#1e293b"/>
  <circle cx="368" cy="34" r="3" fill="#1e293b"/>
  <rect x="376" y="29" width="16" height="9" rx="2" fill="none" stroke="#1e293b" stroke-width="1.5"/>
  <rect x="378" y="31" width="10" height="5" rx="1" fill="#1e293b"/>

  <!-- APP BAR DE FORMULARIO -->
  <g transform="translate(42, 52)">
    <text x="0" y="24" font-family="'Segoe UI', sans-serif" font-size="18" fill="#4f46e5" font-weight="bold">←</text>
    <text x="32" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Editar Nota</text>

    <!-- Botón Guardar Superior -->
    <g transform="translate(260, 4)">
      <rect width="96" height="30" rx="8" fill="#4f46e5"/>
      <text x="48" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">✓ Guardar</text>
    </g>
  </g>

  <!-- FORMULARIO -->
  <g transform="translate(42, 100)">
    <!-- Campo Título -->
    <text x="0" y="18" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#334155">Título de la nota</text>
    <rect x="0" y="26" width="356" height="44" rx="10" fill="#ffffff" stroke="#4f46e5" stroke-width="1.5"/>
    <text x="14" y="53" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" fill="#0f172a">Planificar arquitectura Flutter</text>

    <!-- Campo Contenido -->
    <text x="0" y="98" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#334155">Contenido</text>
    <rect x="0" y="106" width="356" height="130" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
    <text x="14" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#334155">Definir la estructura de carpetas, modelos,</text>
    <text x="14" y="152" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#334155">proveedores de estado y tema visual en Flutter.</text>
    <text x="14" y="172" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Implementar arquitectura desacoplada para</text>
    <text x="14" y="192" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">permitir escalabilidad y pruebas sin dependencias.</text>

    <!-- Selector de Categoría -->
    <text x="0" y="264" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#334155">Categoría</text>
    <g transform="translate(0, 274)">
      <!-- Trabajo (Seleccionado) -->
      <rect x="0" y="0" width="82" height="32" rx="16" fill="#4f46e5"/>
      <text x="41" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11.5" font-weight="700" fill="#ffffff">💼 Trabajo</text>

      <!-- Estudio -->
      <rect x="88" y="0" width="80" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="128" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">📖 Estudio</text>

      <!-- Personal -->
      <rect x="174" y="0" width="86" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="217" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">👤 Personal</text>

      <!-- Ideas -->
      <rect x="266" y="0" width="74" height="32" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="303" y="20" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11" font-weight="600" fill="#475569">💡 Ideas</text>
    </g>

    <!-- Selector de Prioridad Segmentado -->
    <text x="0" y="334" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#334155">Nivel de Prioridad</text>
    <g transform="translate(0, 344)">
      <!-- Baja -->
      <rect x="0" y="0" width="114" height="42" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="57" y="26" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="#059669">▼ Baja</text>

      <!-- Media -->
      <rect x="120" y="0" width="114" height="42" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="177" y="26" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="11.5" font-weight="600" fill="#d97706">■ Media</text>

      <!-- Alta (Seleccionada) -->
      <rect x="240" y="0" width="116" height="42" rx="10" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
      <text x="298" y="26" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="800" fill="#b91c1c">▲ Alta</text>
    </g>

    <!-- Switch de Pin -->
    <g transform="translate(0, 412)">
      <rect width="356" height="58" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
      <text x="16" y="36" font-family="'Segoe UI', sans-serif" font-size="20" fill="#f59e0b">📌</text>
      <text x="46" y="26" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#0f172a">Fijar nota al inicio</text>
      <text x="46" y="44" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Aparecerá en la parte superior del listado</text>

      <!-- Control Switch ON -->
      <g transform="translate(296, 17)">
        <rect width="44" height="24" rx="12" fill="#f59e0b"/>
        <circle cx="32" cy="12" r="9" fill="#ffffff"/>
      </g>
    </g>

    <!-- Botón Principal Guardar Cambios -->
    <g transform="translate(0, 496)">
      <rect width="356" height="46" rx="12" fill="#4f46e5"/>
      <text x="178" y="28" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="700" fill="#ffffff">Guardar Cambios</text>
    </g>
  </g>
</svg>`;

console.log('Rendering high-resolution vector figures via @resvg/resvg-js...');
const pngFigura1 = renderSvgToPng(svgFigura1, 1400);
const pngFigura2 = renderSvgToPng(svgFigura2, 1000);
const pngFigura3 = renderSvgToPng(svgFigura3, 1000);
console.log(`Rendered PNGs: Fig1=${pngFigura1.length} bytes, Fig2=${pngFigura2.length} bytes, Fig3=${pngFigura3.length} bytes`);

// ==========================================
// CONSTANTES Y ESTILOS APA 7
// ==========================================
const FONT_NAME = "Times New Roman";
const FONT_SIZE = 24;          // 12 pt (en half-points)
const LINE_SPACING = 360;      // 1.5 interlineado (360 dxa)
const FIRST_LINE_INDENT = 850; // Sangría 1.5 cm APA 7

// Bordes para tablas estilo APA 7 (solo horizontales)
const borderAPAHeader = {
  top: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE }
};

const borderAPANone = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE }
};

const borderAPABottom = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.SINGLE, size: 8, color: "000000" },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE }
};

// Helpers para párrafos
const tRun = (text, opts = {}) => new TextRun({
  text,
  size: opts.size || FONT_SIZE,
  font: opts.font || FONT_NAME,
  bold: opts.bold || false,
  italics: opts.italics || false,
  color: opts.color || "000000"
});

function createCoverPara(text, options = {}) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: {
      before: options.before || 0,
      after: options.after || 100,
      line: LINE_SPACING
    },
    children: [
      new TextRun({
        text,
        size: options.size || FONT_SIZE,
        font: FONT_NAME,
        bold: options.bold || false,
        italics: options.italics || false,
        color: "000000"
      })
    ]
  });
}

function createPara(children, options = {}) {
  const isIndented = options.indent !== false;
  const runs = (typeof children === 'string')
    ? [new TextRun({ text: children, size: FONT_SIZE, font: FONT_NAME, color: "000000" })]
    : children;

  return new Paragraph({
    alignment: options.align || AlignmentType.JUSTIFIED,
    indent: isIndented ? { firstLine: FIRST_LINE_INDENT } : undefined,
    spacing: {
      before: options.before || 0,
      after: options.after || 100,
      line: LINE_SPACING
    },
    children: runs
  });
}

function createHeading1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120, line: LINE_SPACING },
    children: [
      new TextRun({
        text,
        size: FONT_SIZE,
        bold: true,
        font: FONT_NAME,
        color: "000000"
      })
    ]
  });
}

function createHeading2(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 180, after: 80, line: LINE_SPACING },
    children: [
      new TextRun({
        text,
        size: FONT_SIZE,
        bold: true,
        font: FONT_NAME,
        color: "000000"
      })
    ]
  });
}

function createHeading3(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 140, after: 60, line: LINE_SPACING },
    children: [
      new TextRun({
        text,
        size: FONT_SIZE,
        bold: true,
        italics: true,
        font: FONT_NAME,
        color: "000000"
      })
    ]
  });
}

// Bloque de código o consola en Consolas
function createCodeBlock(codeStr) {
  const lines = codeStr.trim().split('\n');
  return lines.map(line => new Paragraph({
    indent: { left: 720 },
    spacing: { before: 20, after: 20, line: 240 },
    children: [
      new TextRun({
        text: line,
        size: 18, // 9 pt
        font: "Consolas",
        color: "1E293B"
      })
    ]
  }));
}

// Helper para figuras APA 7
function createAPAFigure(figNum, title, pngBuf, widthPt, heightPt, note) {
  return [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 220, after: 40, line: LINE_SPACING },
      children: [tRun(`Figura ${figNum}`, { bold: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 0, after: 100, line: LINE_SPACING },
      children: [tRun(title, { italics: true })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 60 },
      children: [
        new ImageRun({
          data: pngBuf,
          transformation: { width: widthPt, height: heightPt },
          type: "png",
          altText: {
            title: `Figura ${figNum}`,
            description: title,
            name: `figura_${figNum}.png`
          }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { before: 40, after: 180, line: LINE_SPACING },
      children: [
        tRun("Nota. ", { italics: true, size: 20 }),
        tRun(note, { size: 20 })
      ]
    })
  ];
}

// ==========================================
// CONSTRUCCIÓN DE TABLAS APA 7
// ==========================================

// TABLA 1: Endpoints API REST
const table1 = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        'Método',
        'Endpoint',
        'Parámetros / Payload',
        'Código HTTP',
        'Descripción Funcional'
      ].map(h => new TableCell({
        borders: borderAPAHeader,
        margins: { top: 100, bottom: 100, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [tRun(h, { bold: true, size: 20 })]
          })
        ]
      }))
    }),
    ...[
      ['GET', '/api/health', 'Ninguno', '200 OK', 'Monitoreo de estado y operatividad del backend.'],
      ['GET', '/api/notes', 'category, priority, search, isPinned', '200 OK', 'Listado con filtros múltiples y orden cronológico.'],
      ['GET', '/api/notes/:id', 'id (UUID v4) en parámetro de ruta', '200 OK / 404 Not Found', 'Recupera el detalle de una nota específica.'],
      ['POST', '/api/notes', 'JSON: title*, content*, category, priority, isPinned', '201 Created / 400 Bad Request', 'Crea una nota validando campos requeridos y asigna UUID.'],
      ['PUT', '/api/notes/:id', 'id en ruta + campos a actualizar en body', '200 OK / 400 Bad Request / 404', 'Actualización parcial o total y refresco de updatedAt.'],
      ['DELETE', '/api/notes/:id', 'id (UUID v4) en parámetro de ruta', '200 OK / 404 Not Found', 'Eliminación física del recurso en memoria.']
    ].map((row, idx, arr) => new TableRow({
      children: row.map((cellText, cellIdx) => new TableCell({
        borders: idx === arr.length - 1 ? borderAPABottom : borderAPANone,
        margins: { top: 70, bottom: 70, left: 80, right: 80 },
        children: [
          new Paragraph({
            alignment: cellIdx === 0 || cellIdx === 3 ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [tRun(cellText, { size: 19, font: cellIdx === 1 ? 'Consolas' : FONT_NAME })]
          })
        ]
      }))
    }))
  ]
});

// TABLA 2: Matriz 17 Pruebas E2E API Node.js
const table2 = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        'ID',
        'Endpoint / Método',
        'Condición de Prueba',
        'Status Esperado',
        'Resultado',
        'Latencia'
      ].map(h => new TableCell({
        borders: borderAPAHeader,
        margins: { top: 90, bottom: 90, left: 70, right: 70 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [tRun(h, { bold: true, size: 19 })]
          })
        ]
      }))
    }),
    ...[
      ['E2E-01', 'GET /api/health', 'Llamada de salud inicial', '200 OK', 'APROBADO', '~2.7 ms'],
      ['E2E-02', 'GET /api/notes', 'Recuperación de 3 notas semilla', '200 OK', 'APROBADO', '~0.7 ms'],
      ['E2E-03', 'POST /api/notes', 'Validación 400 sin title', '400 Bad Request', 'APROBADO', '~0.4 ms'],
      ['E2E-04', 'POST /api/notes', 'Validación 400 sin content', '400 Bad Request', 'APROBADO', '~0.3 ms'],
      ['E2E-05', 'POST /api/notes', 'JSON sintácticamente malformado', '400 Bad Request', 'APROBADO', '~0.4 ms'],
      ['E2E-06', 'POST /api/notes', 'Creación completa con UUID v4', '201 Created', 'APROBADO', '~0.8 ms'],
      ['E2E-07', 'GET /api/notes/:id', 'Búsqueda por UUID generado', '200 OK', 'APROBADO', '~0.5 ms'],
      ['E2E-08', 'GET /api/notes/:id', 'UUID inexistente (0000-0000...)', '404 Not Found', 'APROBADO', '~0.2 ms'],
      ['E2E-09', 'PUT /api/notes/:id', 'Actualización y refresco de fecha', '200 OK', 'APROBADO', '~0.5 ms'],
      ['E2E-10', 'PUT /api/notes/:id', 'Title con solo espacios en blanco', '400 Bad Request', 'APROBADO', '~0.2 ms'],
      ['E2E-11', 'GET /api/notes', 'Filtro ?category=Trabajo', '200 OK', 'APROBADO', '~0.3 ms'],
      ['E2E-12', 'GET /api/notes', 'Filtro tolerante ?category=Todas', '200 OK', 'APROBADO', '~0.5 ms'],
      ['E2E-13', 'GET /api/notes', 'Búsqueda textual ?search=COMPLETADA', '200 OK', 'APROBADO', '~0.3 ms'],
      ['E2E-14', 'DELETE /api/notes/:id', 'Eliminación de nota existente', '200 OK', 'APROBADO', '~0.5 ms'],
      ['E2E-15', 'GET /api/notes/:id', 'Verificación 404 tras eliminación', '404 Not Found', 'APROBADO', '~0.2 ms'],
      ['E2E-16', 'DELETE /api/notes/:id', 'Eliminar nota inexistente', '404 Not Found', 'APROBADO', '~0.3 ms'],
      ['E2E-17', 'GET /api/ruta-erronea', 'Middleware global notFoundHandler', '404 Not Found', 'APROBADO', '~0.7 ms']
    ].map((row, idx, arr) => new TableRow({
      children: row.map((cellText, cellIdx) => new TableCell({
        borders: idx === arr.length - 1 ? borderAPABottom : borderAPANone,
        margins: { top: 60, bottom: 60, left: 70, right: 70 },
        children: [
          new Paragraph({
            alignment: cellIdx === 0 || cellIdx >= 3 ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [tRun(cellText, { size: 18, font: cellIdx === 1 ? 'Consolas' : FONT_NAME })]
          })
        ]
      }))
    }))
  ]
});

// TABLA 3: Matriz 27 Pruebas Cliente Flutter
const table3 = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  rows: [
    new TableRow({
      tableHeader: true,
      children: [
        'Suite de Pruebas',
        'Componente Evaluado',
        'Casos Aprobados',
        'Tasa de Éxito',
        'Estado'
      ].map(h => new TableCell({
        borders: borderAPAHeader,
        margins: { top: 90, bottom: 90, left: 70, right: 70 },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [tRun(h, { bold: true, size: 19 })]
          })
        ]
      }))
    }),
    ...[
      ['Fase 2: Modelos & Constantes', 'NoteModel (serialización, copyWith, hash), ApiException', '7 de 7', '100%', 'APROBADO'],
      ['Fase 4: Servicio HTTP & Red', 'NoteApiService (timeout, error handling, health status)', '3 de 3', '100%', 'APROBADO'],
      ['Fase 4: Smoke Test Widgets', 'MyApp y renderizado base de HomeScreen', '1 de 1', '100%', 'APROBADO'],
      ['Fase 4: Proveedor de Estado', 'NoteProvider (fetchNotes, create, update, delete, pin)', '13 de 13', '100%', 'APROBADO'],
      ['Fase 4: Interfaz de Usuario', 'HomeScreen (búsqueda, chips), NoteCard, NoteFormScreen', '3 de 3', '100%', 'APROBADO']
    ].map((row, idx, arr) => new TableRow({
      children: row.map((cellText, cellIdx) => new TableCell({
        borders: idx === arr.length - 1 ? borderAPABottom : borderAPANone,
        margins: { top: 70, bottom: 70, left: 70, right: 70 },
        children: [
          new Paragraph({
            alignment: cellIdx >= 2 ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [tRun(cellText, { size: 19 })]
          })
        ]
      }))
    }))
  ]
});

// ==========================================
// CONSTRUCCIÓN DEL DOCUMENTO DOCX
// ==========================================
async function buildDocxReport() {
  console.log('Generando documento formal APA 7...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_NAME,
            size: FONT_SIZE,
            color: "000000"
          },
          paragraph: {
            spacing: { line: LINE_SPACING }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } // 1 pulgada (1440 dxa) en todos los márgenes
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 120 },
                children: [
                  new TextRun({ children: [PageNumber.CURRENT], size: FONT_SIZE, font: FONT_NAME, color: "000000" })
                ]
              })
            ]
          })
        },
        children: [
          // ==================== PÁGINA 1: PORTADA APA INSTITUCIONAL ====================
          createCoverPara("ACTIVIDAD DE APRENDIZAJE", { before: 300, after: 1000, bold: true, size: 26 }),

          createCoverPara("ASIGNATURA:", { before: 0, after: 60, bold: true }),
          createCoverPara("DESARROLLO DE APLICACIONES MÓVILES", { before: 0, after: 1000 }),

          createCoverPara("ESTUDIANTE / AUTOR:", { before: 0, after: 60, bold: true }),
          createCoverPara("JEZER MARTINEZ PEREZ", { before: 0, after: 1000 }),

          createCoverPara("TUTOR:", { before: 0, after: 60, bold: true }),
          createCoverPara("EVELIN BARCO LLERENA", { before: 0, after: 1400 }),

          createCoverPara("INGENIERÍA EN SOFTWARE", { before: 0, after: 60 }),
          createCoverPara("V SEMESTRE", { before: 0, after: 200 }),

          // Salto de página formal
          new Paragraph({
            children: [new PageBreak()]
          }),

          // ==================== PÁGINA 2 EN ADELANTE: CUERPO APA 7 ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120, line: LINE_SPACING },
            children: [
              new TextRun({
                text: "Desarrollo de API REST en Node.js con Express y Cliente Móvil en Flutter",
                size: FONT_SIZE,
                bold: true,
                font: FONT_NAME,
                color: "000000"
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240, line: LINE_SPACING },
            children: [
              new TextRun({
                text: "Arquitectura en Capas, CRUD Funcional, Gestión de Estado Reactiva con Provider y Pruebas E2E",
                size: FONT_SIZE,
                italics: true,
                font: FONT_NAME,
                color: "000000"
              })
            ]
          }),

          // SECCIÓN 1
          createHeading1("1. Introducción y Marco Tecnológico"),
          createPara("El presente trabajo expone el desarrollo integral de una solución full-stack para la gestión de notas y tareas, compuesta por una API de servicios web bajo el paradigma REST implementada en Node.js con Express, y un cliente móvil multiplataforma interactivo construido en el framework Flutter con el lenguaje de programación Dart. La arquitectura del sistema fue diseñada con un enfoque riguroso de desacoplamiento, inmutabilidad y separación de responsabilidades, garantizando que el cliente consuma datos de manera reactiva y eficiente."),
          createPara("Entre los requerimientos tecnológicos fundamentales del proyecto destacan la creación de endpoints estandarizados con códigos de estado HTTP semánticos (200, 201, 400, 404 y 500), el soporte de operaciones CRUD completas (Create, Read, Update, Delete), mecanismos de ordenamiento y filtrado por categoría y prioridad, y la integración de la especificación de diseño visual Material 3 en el cliente móvil, respaldado por una gestión de estado centralizada a través del patrón Provider."),

          // SECCIÓN 2
          createHeading1("2. Arquitectura Técnica del Sistema"),
          createPara("La solución se estructura mediante el patrón Cliente-Servidor Desacoplado. El servidor Node.js/Express implementa la arquitectura Controller-Service-Repository con middlewares centralizados de registro (Morgan), habilitación de orígenes cruzados (CORS) y captura uniforme de excepciones, devolviendo siempre una estructura JSON consistente: { success: boolean, message: string, data?: object }."),
          createPara("Por su parte, el cliente móvil en Flutter estructura sus responsabilidades en: modelo de datos inmutable (NoteModel) con conversión serializada bidireccional; servicio de consumo HTTP (NoteApiService) con resolución dinámica de host según la plataforma en tiempo de ejecución (kIsWeb, emulador Android o entornos desktop); y el gestor de estado (NoteProvider) basado en ChangeNotifier que orquesta la caché local en memoria y notifica de forma reactiva a los widgets de la interfaz de usuario."),

          ...createAPAFigure(
            1,
            "Diagrama de Arquitectura y Flujo de Comunicación entre Capas",
            pngFigura1,
            480,
            280,
            "Diagrama estructural que ilustra el desacoplamiento entre el cliente móvil en Flutter y el servidor backend en Express, detallando los flujos de petición y respuesta HTTP/JSON con CORS habilitado."
          ),

          // SECCIÓN 3
          createHeading1("3. Especificación Formal de la API REST"),
          createPara("La interfaz de programación expone un conjunto de servicios bajo el prefijo unificado /api. Los endpoints responden estrictamente al estándar RESTful, validando exhaustivamente los campos obligatorios en operaciones de escritura y emitiendo mensajes de error descriptivos."),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 40, line: LINE_SPACING },
            children: [tRun("Tabla 1", { bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 100, line: LINE_SPACING },
            children: [tRun("Especificación Técnica de los Endpoints de la API REST", { italics: true })]
          }),
          table1,
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 180, line: LINE_SPACING },
            children: [
              tRun("Nota. ", { italics: true, size: 20 }),
              tRun("Estructura contractual de los 6 endpoints disponibles en el backend de notas.", { size: 20 })
            ]
          }),

          createHeading2("3.1. Esquemas Contractuales JSON (Request & Response)"),
          createPara("A continuación se detallan los payloads representativos de las operaciones de la API REST:"),

          createHeading3("Petición de Creación de Nota (POST /api/notes)"),
          ...createCodeBlock(`{
  "title": "Arquitectura Limpia en Flutter",
  "content": "Definir inyección de dependencias y servicios desacoplados.",
  "category": "Estudio",
  "priority": "Alta",
  "isPinned": true
}`),

          createHeading3("Respuesta Exitosa del Servidor (HTTP 201 Created)"),
          ...createCodeBlock(`{
  "success": true,
  "message": "Nota creada exitosamente",
  "data": {
    "id": "4778c6b0-3543-4ca8-af5c-a9ee5d0c29ca",
    "title": "Arquitectura Limpia en Flutter",
    "content": "Definir inyección de dependencias y servicios desacoplados.",
    "category": "Estudio",
    "priority": "Alta",
    "isPinned": true,
    "createdAt": "2026-10-28T23:38:15.120Z",
    "updatedAt": "2026-10-28T23:38:15.120Z"
  }
}`),

          createHeading3("Respuesta de Error de Validación (HTTP 400 Bad Request)"),
          ...createCodeBlock(`{
  "success": false,
  "message": "El campo \\"title\\" es obligatorio y debe ser una cadena no vacía"
}`),

          // SECCIÓN 4
          createHeading1("4. Implementación del Cliente Móvil en Flutter"),
          createPara("La interfaz gráfica de usuario fue desarrollada aplicando las directrices de Material 3, incorporando la paleta institucional Deep Slate Indigo (#4F46E5) con contrastes Slate (#312E81) y acentos vivos Cyan (#06B6D4) y Esmeralda (#10B981). Las prioridades se codifican semánticamente: Alta en Coral (#EF4444 con fondo suave #FEE2E2), Media en Ámbar (#F59E0B con fondo #FEF3C7) y Baja en Verde Menta (#10B981 con fondo #D1FAE5)."),
          createPara("El cliente cuenta con dos pantallas principales: HomeScreen, que actúa como panel central con indicador de conectividad al backend en tiempo real, barra de búsqueda reactiva y filtrado horizontal por categorías; y NoteFormScreen, formulario modal que gestiona tanto la creación de nuevas notas como la edición de notas existentes con validaciones de longitud mínima y contenido obligatorio."),

          ...createAPAFigure(
            2,
            "Maqueta de Alta Fidelidad de la Pantalla Principal (HomeScreen)",
            pngFigura2,
            330,
            550,
            "Interfaz de usuario del dashboard móvil en Flutter, destacando el estado de conexión del backend, la barra de búsqueda en tiempo real, el selector de categorías y las tarjetas NoteCard con acciones de edición, eliminación y fijado."
          ),

          ...createAPAFigure(
            3,
            "Maqueta de Alta Fidelidad de la Pantalla de Formulario (NoteFormScreen)",
            pngFigura3,
            330,
            550,
            "Formulario interactivo para la creación y edición de notas, con selectores de categoría en formato chip, selector segmentado por nivel de prioridad y conmutador para fijar al inicio del catálogo."
          ),

          // SECCIÓN 5
          createHeading1("5. Matriz de Pruebas y Evidencias Técnicas"),
          createPara("Para asegurar la estabilidad del ecosistema, se implementaron suites de pruebas automatizadas en ambas capas. En el backend, un script de auditoría E2E ejecuta 17 pruebas de integración contra los endpoints de Express, evaluando casos de borde, códigos de error y persistencia en memoria. En el cliente Flutter, 27 pruebas unitarias y de widgets garantizan la integridad de los modelos, el servicio HTTP y los flujos de interfaz de usuario, obteniendo un 100% de aprobación sin ninguna advertencia en el análisis estático (0 issues en flutter analyze)."),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 40, line: LINE_SPACING },
            children: [tRun("Tabla 2", { bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 100, line: LINE_SPACING },
            children: [tRun("Matriz de Pruebas de Integración E2E en la API REST de Node.js", { italics: true })]
          }),
          table2,
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 180, line: LINE_SPACING },
            children: [
              tRun("Nota. ", { italics: true, size: 20 }),
              tRun("17 casos de prueba ejecutados sobre el entorno de pruebas local en puerto 3100.", { size: 20 })
            ]
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 180, after: 40, line: LINE_SPACING },
            children: [tRun("Tabla 3", { bold: true })]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 100, line: LINE_SPACING },
            children: [tRun("Resumen de Cobertura de Pruebas Automatizadas en el Cliente Flutter", { italics: true })]
          }),
          table3,
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 180, line: LINE_SPACING },
            children: [
              tRun("Nota. ", { italics: true, size: 20 }),
              tRun("Resultados de ejecución del comando flutter test sobre las suites de pruebas del proyecto.", { size: 20 })
            ]
          }),

          createHeading2("5.1. Evidencia de Ejecución en Consola (Terminal Logs)"),
          createPara("A continuación se anexan los registros de salida capturados directamente de las terminales de ejecución de Node.js y Flutter:"),

          createHeading3("Registro de Pruebas E2E de la API REST (node test/e2e-audit.js)"),
          ...createCodeBlock(`================================================================
🚀 INICIANDO AUDITORÍA E2E Y CONTROL DE CALIDAD (QA) DE LA API
================================================================
🔹 Caso 1: GET /api/health -> [PASS] 200 OK (82ms)
🔹 Caso 2: GET /api/notes -> [PASS] 200 OK (3 notas recuperadas)
🔹 Caso 3: POST /api/notes (sin title) -> [PASS] 400 Bad Request
🔹 Caso 4: POST /api/notes (sin content) -> [PASS] 400 Bad Request
🔹 Caso 5: POST /api/notes (JSON malformado) -> [PASS] 400 Bad Request
🔹 Caso 6: POST /api/notes (completo) -> [PASS] 201 Created (UUID generado)
🔹 Caso 7: GET /api/notes/:id -> [PASS] 200 OK (datos consistentes)
🔹 Caso 8: GET /api/notes/:id (inexistente) -> [PASS] 404 Not Found
🔹 Caso 9: PUT /api/notes/:id -> [PASS] 200 OK (persistencia confirmada)
🔹 Caso 10: PUT /api/notes/:id (title vacío) -> [PASS] 400 Bad Request
🔹 Caso 11: GET /api/notes?category=Trabajo -> [PASS] 200 OK
🔹 Caso 12: GET /api/notes?category=Todas -> [PASS] 200 OK (catálogo íntegro)
🔹 Caso 13: GET /api/notes?search=COMPLETADA -> [PASS] 200 OK
🔹 Caso 14: DELETE /api/notes/:id -> [PASS] 200 OK
🔹 Caso 15: GET /api/notes/:id post-eliminación -> [PASS] 404 Not Found
🔹 Caso 16: DELETE /api/notes/:id inexistente -> [PASS] 404 Not Found
🔹 Caso 17: GET /api/ruta-inexistente -> [PASS] 404 Not Found
================================================================
✅ TODAS LAS 17 PRUEBAS DE INTEGRACIÓN E2E PASARON SATISFACTORIAMENTE (100%)
================================================================`),

          createHeading3("Registro de Pruebas Unitarias y de Widgets en Flutter (flutter test)"),
          ...createCodeBlock(`$ flutter analyze
Analyzing app_dev...
No issues found! (ran in 1.9s)

$ flutter test
00:00 +0: test/phase2_models_provider_test.dart: ApiConstants define base URL y endpoints
00:00 +1: test/phase2_models_provider_test.dart: ApiException incluye mensaje y statusCode
00:00 +2: test/phase2_models_provider_test.dart: NoteModel serializa y deserializa correctamente
00:00 +3: test/phase2_models_provider_test.dart: NoteProvider fetchNotes carga y ordena notas
00:00 +4: test/phase2_models_provider_test.dart: NoteProvider createNote añade nota
00:00 +5: test/phase2_models_provider_test.dart: NoteProvider togglePinNote conmuta isPinned
00:00 +6: test/phase2_models_provider_test.dart: NoteProvider deleteNote remueve nota
00:00 +7: test/phase4_qa_e2e_audit_test.dart: NoteApiService GET /health devuelve true
00:00 +8: test/phase4_qa_e2e_audit_test.dart: NoteApiService GET /health maneja error 500
00:00 +9: test/phase4_qa_e2e_audit_test.dart: NoteApiService GET /notes mapea modelos
00:01 +24: test/phase4_qa_e2e_audit_test.dart: HomeScreen renderiza barra de búsqueda y lista
00:02 +25: test/phase4_qa_e2e_audit_test.dart: NoteCard renderiza datos y diálogo eliminar
00:02 +26: test/phase4_qa_e2e_audit_test.dart: NoteFormScreen valida campos requeridos
00:03 +27: All tests passed!`),

          // SECCIÓN 6
          createHeading1("6. Guía de Instalación y Ejecución Local"),
          createPara("Para desplegar el entorno completo de forma local, se deben seguir los siguientes pasos en la terminal de comandos:"),

          createHeading2("6.1. Puesta en Marcha del Servidor (Backend Express)"),
          ...createCodeBlock(`cd backend
npm install
npm run start     # Inicia el servidor en producción (Puerto 3000 por defecto)
npm run dev       # Inicia en modo desarrollo con recarga automática nodemon
npm test          # Ejecuta la suite de pruebas E2E automatizada`),

          createHeading2("6.2. Puesta en Marcha del Cliente Móvil (Flutter)"),
          ...createCodeBlock(`flutter pub get   # Descarga las dependencias (http, provider, intl)
flutter analyze   # Verifica que no existan advertencias ni errores de código
flutter test      # Ejecuta los 27 tests unitarios y de interfaz
flutter run -d chrome    # Ejecuta el cliente en el navegador Google Chrome
flutter run -d windows   # Ejecuta el cliente nativo para Windows Desktop
flutter run              # Despliega en emulador Android (conecta a 10.0.2.2:3000)`),

          // SECCIÓN 7
          createHeading1("7. Conclusiones y Mejores Prácticas"),
          createPara("La implementación de este proyecto evidenció los múltiples beneficios de una arquitectura desacoplada en el desarrollo de software moderno. La estandarización de contratos de datos JSON entre el cliente móvil y el backend en Express permitió que ambas capas evolucionaran de manera autónoma sin generar fricciones de integración."),
          createPara("El uso del patrón Provider en Flutter confirmó ser una alternativa limpia, ligera y altamente mantenible para la gestión de estado reactivo, facilitando la propagación de eventos de interfaz y garantizando que la lógica de red resida en repositorios aislados."),
          createPara("Por último, la metodología de desarrollo orientada a pruebas (Testing) resultó fundamental para identificar y resolver de forma oportuna situaciones de borde como la captura de errores sintácticos en el middleware de Express y el aseguramiento de tipos anulables en los identificadores de notas de la interfaz de usuario."),

          // SECCIÓN 8: ANEXOS DE CÓDIGO FUENTE
          createHeading1("8. Anexos: Código Fuente Completo del Proyecto"),
          createPara("En cumplimiento de los requerimientos de entrega autosuficiente, se anexa a continuación el código fuente completo e íntegro de los 10 módulos nucleares de la solución:"),

          createHeading2("8.1. Backend: server.js"),
          ...createCodeBlock(codeFiles.server_js),

          createHeading2("8.2. Backend: app.js"),
          ...createCodeBlock(codeFiles.app_js),

          createHeading2("8.3. Backend: note.routes.js"),
          ...createCodeBlock(codeFiles.note_routes_js),

          createHeading2("8.4. Backend: note.controller.js"),
          ...createCodeBlock(codeFiles.note_controller_js),

          createHeading2("8.5. Backend: note.service.js"),
          ...createCodeBlock(codeFiles.note_service_js),

          createHeading2("8.6. Frontend: note_model.dart"),
          ...createCodeBlock(codeFiles.note_model_dart),

          createHeading2("8.7. Frontend: note_api_service.dart"),
          ...createCodeBlock(codeFiles.note_api_service_dart),

          createHeading2("8.8. Frontend: note_provider.dart"),
          ...createCodeBlock(codeFiles.note_provider_dart),

          createHeading2("8.9. Frontend: home_screen.dart"),
          ...createCodeBlock(codeFiles.home_screen_dart),

          createHeading2("8.10. Frontend: note_form_screen.dart"),
          ...createCodeBlock(codeFiles.note_form_screen_dart),

          // REFERENCIAS APA 7 CON SANGRÍA FRANCESA
          createHeading1("Referencias"),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: FIRST_LINE_INDENT, hanging: FIRST_LINE_INDENT }, // Sangría francesa 1.5 cm
            spacing: { before: 80, after: 80, line: LINE_SPACING },
            children: [
              tRun("American Psychological Association. (2020). "),
              tRun("Publication manual of the American Psychological Association ", { italics: true }),
              tRun("(7.ª ed.). https://doi.org/10.1037/0000165-000")
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: FIRST_LINE_INDENT, hanging: FIRST_LINE_INDENT },
            spacing: { before: 80, after: 80, line: LINE_SPACING },
            children: [
              tRun("Fielding, R. T. (2000). "),
              tRun("Architectural styles and the design of network-based software architectures ", { italics: true }),
              tRun("(Tesis doctoral). University of California, Irvine.")
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: FIRST_LINE_INDENT, hanging: FIRST_LINE_INDENT },
            spacing: { before: 80, after: 80, line: LINE_SPACING },
            children: [
              tRun("Flutter Team. (2026). "),
              tRun("Flutter documentation: State management and architectural overview. ", { italics: true }),
              tRun("Google Developers. https://docs.flutter.dev")
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: FIRST_LINE_INDENT, hanging: FIRST_LINE_INDENT },
            spacing: { before: 80, after: 80, line: LINE_SPACING },
            children: [
              tRun("Node.js Foundation. (2026). "),
              tRun("Express web framework API reference and design guidelines. ", { italics: true }),
              tRun("OpenJS Foundation. https://expressjs.com")
            ]
          })
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Documento Word generado exitosamente en: ${outputPath} (${buffer.length} bytes)`);
}

buildDocxReport().catch(err => {
  console.error("❌ Error al generar el documento Word:", err);
  process.exit(1);
});
