/**
 * Suite de Pruebas de Integración End-to-End (E2E) y Auditoría QA
 * Backend Node.js / Express - API REST de Notas
 */

const assert = require('assert');
const http = require('http');
const app = require('../src/app');

process.env.NODE_ENV = 'test';
const TEST_PORT = 3100;

const evidenceLog = [];

async function makeRequest({ method, path, headers = {}, body = null, rawBody = null }) {
  const url = `http://localhost:${TEST_PORT}${path}`;
  const reqHeaders = { ...headers };
  if (body && !rawBody && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  const startTime = Date.now();
  let responseData;
  let statusCode;
  let resHeaders;

  if (rawBody !== null) {
    // Para probar bodies con JSON malformado usando http directamente
    const res = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: TEST_PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(rawBody),
          ...headers
        }
      };
      const req = http.request(options, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => {
          resolve({
            statusCode: resp.statusCode,
            headers: resp.headers,
            body: data
          });
        });
      });
      req.on('error', reject);
      req.write(rawBody);
      req.end();
    });

    statusCode = res.statusCode;
    resHeaders = res.headers;
    try {
      responseData = JSON.parse(res.body);
    } catch {
      responseData = res.body;
    }
  } else {
    const fetchOptions = {
      method,
      headers: reqHeaders,
      body: body ? JSON.stringify(body) : undefined
    };
    const res = await fetch(url, fetchOptions);
    statusCode = res.status;
    resHeaders = Object.fromEntries(res.headers.entries());
    const text = await res.text();
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = text;
    }
  }

  const durationMs = Date.now() - startTime;

  const entry = {
    method,
    path,
    requestBody: body || rawBody,
    statusCode,
    responseData,
    durationMs
  };
  evidenceLog.push(entry);

  return { statusCode, data: responseData, headers: resHeaders, durationMs };
}

async function runE2EAudit() {
  console.log('================================================================');
  console.log('🚀 INICIANDO AUDITORÍA E2E Y CONTROL DE CALIDAD (QA) DE LA API');
  console.log('================================================================\n');

  const server = app.listen(TEST_PORT);
  let createdId = null;

  try {
    // -------------------------------------------------------------
    // PRUEBA 1: GET /api/health
    // -------------------------------------------------------------
    console.log('🔹 Caso 1: GET /api/health - Verificación de Estado del Servicio');
    const health = await makeRequest({ method: 'GET', path: '/api/health' });
    assert.strictEqual(health.statusCode, 200, 'El status code debe ser 200');
    assert.strictEqual(health.data.success, true, 'success debe ser true');
    assert.ok(health.data.status === 'ok' || health.data.data?.status === 'UP', 'Debe confirmar status OK/UP');
    console.log(`   [PASS] 200 OK -> status: ${health.data.status || health.data.data?.status} (${health.durationMs}ms)`);

    // -------------------------------------------------------------
    // PRUEBA 2: GET /api/notes - Seed Data
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 2: GET /api/notes - Listado completo y Seed Data Inicial');
    const listInitial = await makeRequest({ method: 'GET', path: '/api/notes' });
    assert.strictEqual(listInitial.statusCode, 200);
    assert.strictEqual(listInitial.data.success, true);
    assert.ok(Array.isArray(listInitial.data.data), 'data debe ser un Array');
    assert.ok(listInitial.data.data.length >= 3, 'Debe contener al menos 3 notas semilla');

    const firstSeed = listInitial.data.data[0];
    assert.ok(firstSeed.id, 'La nota debe tener id');
    assert.ok(firstSeed.title, 'La nota debe tener title');
    assert.ok(firstSeed.content, 'La nota debe tener content');
    assert.ok(firstSeed.category, 'La nota debe tener category');
    assert.ok(firstSeed.priority, 'La nota debe tener priority');
    assert.strictEqual(typeof firstSeed.isPinned, 'boolean', 'isPinned debe ser booleano');
    assert.ok(firstSeed.createdAt, 'Debe tener createdAt');
    assert.ok(firstSeed.updatedAt, 'Debe tener updatedAt');
    console.log(`   [PASS] 200 OK -> ${listInitial.data.data.length} notas recuperadas correctamente`);

    // -------------------------------------------------------------
    // PRUEBA 3: POST /api/notes - Validación (sin title)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 3: POST /api/notes - Validación de error 400 (Body sin title)');
    const postNoTitle = await makeRequest({
      method: 'POST',
      path: '/api/notes',
      body: { content: 'Nota sin título' }
    });
    assert.strictEqual(postNoTitle.statusCode, 400);
    assert.strictEqual(postNoTitle.data.success, false);
    assert.ok(postNoTitle.data.message.includes('title'));
    console.log(`   [PASS] 400 Bad Request validado: "${postNoTitle.data.message}"`);

    // -------------------------------------------------------------
    // PRUEBA 4: POST /api/notes - Validación (sin content)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 4: POST /api/notes - Validación de error 400 (Body sin content)');
    const postNoContent = await makeRequest({
      method: 'POST',
      path: '/api/notes',
      body: { title: 'Nota sin contenido' }
    });
    assert.strictEqual(postNoContent.statusCode, 400);
    assert.strictEqual(postNoContent.data.success, false);
    assert.ok(postNoContent.data.message.includes('content'));
    console.log(`   [PASS] 400 Bad Request validado: "${postNoContent.data.message}"`);

    // -------------------------------------------------------------
    // PRUEBA 5: POST /api/notes - Validación (JSON malformado)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 5: POST /api/notes - Validación de error 400 (JSON sintácticamente inválido)');
    const postMalformedJson = await makeRequest({
      method: 'POST',
      path: '/api/notes',
      rawBody: '{"title": "error", content:'
    });
    assert.strictEqual(postMalformedJson.statusCode, 400);
    assert.strictEqual(postMalformedJson.data.success, false);
    console.log(`   [PASS] 400 Bad Request para JSON malformado capturado por middleware global`);

    // -------------------------------------------------------------
    // PRUEBA 6: POST /api/notes - Creación Exitosa (201 Created)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 6: POST /api/notes - Creación exitosa de nueva nota');
    const postValid = await makeRequest({
      method: 'POST',
      path: '/api/notes',
      body: {
        title: 'Auditoría de Seguridad y Rendimiento',
        content: 'Verificar la solidez de las rutas y tiempos de respuesta de los endpoints REST.',
        category: 'Trabajo',
        priority: 'Alta',
        isPinned: true
      }
    });
    assert.strictEqual(postValid.statusCode, 201);
    assert.strictEqual(postValid.data.success, true);
    assert.ok(postValid.data.data.id, 'Debe generarse un id UUID');
    assert.strictEqual(postValid.data.data.title, 'Auditoría de Seguridad y Rendimiento');
    assert.strictEqual(postValid.data.data.category, 'Trabajo');
    assert.strictEqual(postValid.data.data.priority, 'Alta');
    assert.strictEqual(postValid.data.data.isPinned, true);
    createdId = postValid.data.data.id;
    console.log(`   [PASS] 201 Created -> Nota creada con UUID: ${createdId}`);

    // -------------------------------------------------------------
    // PRUEBA 7: GET /api/notes/:id - Obtener nota por ID
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 7: GET /api/notes/:id - Recuperar nota creada por UUID');
    const getById = await makeRequest({ method: 'GET', path: `/api/notes/${createdId}` });
    assert.strictEqual(getById.statusCode, 200);
    assert.strictEqual(getById.data.success, true);
    assert.strictEqual(getById.data.data.id, createdId);
    assert.strictEqual(getById.data.data.title, 'Auditoría de Seguridad y Rendimiento');
    console.log(`   [PASS] 200 OK -> Datos de la nota coinciden exactamente`);

    // -------------------------------------------------------------
    // PRUEBA 8: GET /api/notes/:id - Caso 404 con ID inexistente
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 8: GET /api/notes/:id - 404 Not Found con ID inexistente');
    const nonExistentId = '00000000-0000-0000-0000-000000000000';
    const getNotFound = await makeRequest({ method: 'GET', path: `/api/notes/${nonExistentId}` });
    assert.strictEqual(getNotFound.statusCode, 404);
    assert.strictEqual(getNotFound.data.success, false);
    console.log(`   [PASS] 404 Not Found verificado para id inexistente`);

    // -------------------------------------------------------------
    // PRUEBA 9: PUT /api/notes/:id - Actualización Exitosa (200 OK)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 9: PUT /api/notes/:id - Actualización exitosa y verificación de persistencia');
    const putUpdate = await makeRequest({
      method: 'PUT',
      path: `/api/notes/${createdId}`,
      body: {
        title: 'Auditoría de Seguridad y Rendimiento [COMPLETADA]',
        priority: 'Media',
        isPinned: false
      }
    });
    assert.strictEqual(putUpdate.statusCode, 200);
    assert.strictEqual(putUpdate.data.success, true);
    assert.strictEqual(putUpdate.data.data.title, 'Auditoría de Seguridad y Rendimiento [COMPLETADA]');
    assert.strictEqual(putUpdate.data.data.priority, 'Media');
    assert.strictEqual(putUpdate.data.data.isPinned, false);

    // Re-consultar para certificar persistencia
    const getAfterPut = await makeRequest({ method: 'GET', path: `/api/notes/${createdId}` });
    assert.strictEqual(getAfterPut.data.data.title, 'Auditoría de Seguridad y Rendimiento [COMPLETADA]');
    console.log(`   [PASS] 200 OK -> Persistencia confirmada tras actualización`);

    // -------------------------------------------------------------
    // PRUEBA 10: PUT /api/notes/:id - Validación de campo vacío (400)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 10: PUT /api/notes/:id - Validación de error 400 (title vacío en update)');
    const putEmptyTitle = await makeRequest({
      method: 'PUT',
      path: `/api/notes/${createdId}`,
      body: { title: '   ' }
    });
    assert.strictEqual(putEmptyTitle.statusCode, 400);
    assert.strictEqual(putEmptyTitle.data.success, false);
    console.log(`   [PASS] 400 Bad Request validado al enviar campo en blanco`);

    // -------------------------------------------------------------
    // PRUEBA 11: Filtro por categoría ?category=Trabajo
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 11: GET /api/notes?category=Trabajo - Filtro por categoría');
    const filterTrabajo = await makeRequest({ method: 'GET', path: '/api/notes?category=Trabajo' });
    assert.strictEqual(filterTrabajo.statusCode, 200);
    assert.ok(filterTrabajo.data.data.every(n => n.category === 'Trabajo'));
    console.log(`   [PASS] 200 OK -> ${filterTrabajo.data.data.length} notas pertenecen exclusivamente a 'Trabajo'`);

    // -------------------------------------------------------------
    // PRUEBA 12: Filtro por categoría neutra ?category=Todas
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 12: GET /api/notes?category=Todas - Manejo tolerante de filtro general');
    const filterTodas = await makeRequest({ method: 'GET', path: '/api/notes?category=Todas' });
    assert.strictEqual(filterTodas.statusCode, 200);
    assert.ok(filterTodas.data.data.length >= 3);
    console.log(`   [PASS] 200 OK -> 'Todas' devuelve la totalidad del catálogo sin filtrar a vacío`);

    // -------------------------------------------------------------
    // PRUEBA 13: Búsqueda por término ?search=...
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 13: GET /api/notes?search=COMPLETADA - Búsqueda textual');
    const searchRes = await makeRequest({ method: 'GET', path: '/api/notes?search=COMPLETADA' });
    assert.strictEqual(searchRes.statusCode, 200);
    assert.strictEqual(searchRes.data.data.length, 1);
    assert.strictEqual(searchRes.data.data[0].id, createdId);
    console.log(`   [PASS] 200 OK -> 1 coincidencia exacta encontrada`);

    // -------------------------------------------------------------
    // PRUEBA 14: DELETE /api/notes/:id - Eliminación Exitosa (200 OK)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 14: DELETE /api/notes/:id - Eliminación y confirmación');
    const delRes = await makeRequest({ method: 'DELETE', path: `/api/notes/${createdId}` });
    assert.strictEqual(delRes.statusCode, 200);
    assert.strictEqual(delRes.data.success, true);
    assert.strictEqual(delRes.data.data.id, createdId);
    console.log(`   [PASS] 200 OK -> Nota eliminada exitosamente`);

    // -------------------------------------------------------------
    // PRUEBA 15: GET /api/notes/:id post-eliminación (404)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 15: GET /api/notes/:id post-eliminación - Verificación 404');
    const getPostDel = await makeRequest({ method: 'GET', path: `/api/notes/${createdId}` });
    assert.strictEqual(getPostDel.statusCode, 404);
    console.log(`   [PASS] 404 Not Found -> Confirmado que el recurso ya no existe`);

    // -------------------------------------------------------------
    // PRUEBA 16: DELETE /api/notes/:id con ID inexistente (404)
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 16: DELETE /api/notes/:id inexistente - Caso 404');
    const del404 = await makeRequest({ method: 'DELETE', path: `/api/notes/${createdId}` });
    assert.strictEqual(del404.statusCode, 404);
    console.log(`   [PASS] 404 Not Found al intentar eliminar un recurso inexistente`);

    // -------------------------------------------------------------
    // PRUEBA 17: GET /api/ruta-inexistente - Manejo 404 Global
    // -------------------------------------------------------------
    console.log('\n🔹 Caso 17: GET /api/ruta-inexistente - Middleware notFoundHandler');
    const route404 = await makeRequest({ method: 'GET', path: '/api/ruta-inexistente' });
    assert.strictEqual(route404.statusCode, 404);
    assert.strictEqual(route404.data.success, false);
    console.log(`   [PASS] 404 Not Found manejado con JSON estructurado`);

    console.log('\n================================================================');
    console.log('✅ TODAS LAS 17 PRUEBAS DE INTEGRACIÓN E2E PASARON SATISFACTORIAMENTE');
    console.log('================================================================\n');

    return { success: true, evidence: evidenceLog };
  } finally {
    server.close();
  }
}

runE2EAudit()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Fallo en la auditoría E2E:', err);
    process.exit(1);
  });
