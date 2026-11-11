const assert = require('assert');
const app = require('../src/app');

process.env.NODE_ENV = 'test';
const PORT = 3099;

async function runTests() {
  const server = app.listen(PORT);
  const baseUrl = `http://localhost:${PORT}/api`;

  try {
    console.log('🧪 Iniciando pruebas de endpoints CRUD...');

    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthJson.success, true);
    assert.strictEqual(healthJson.data.status, 'UP');
    console.log('✅ GET /api/health OK');

    // 2. GET all notes (3 iniciales)
    const listRes = await fetch(`${baseUrl}/notes`);
    const listJson = await listRes.json();
    assert.strictEqual(listRes.status, 200);
    assert.strictEqual(listJson.success, true);
    assert.strictEqual(listJson.data.length, 3);
    console.log(`✅ GET /api/notes OK (${listJson.data.length} notas iniciales)`);

    // 3. POST validación (sin título)
    const badPostRes = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Contenido sin titulo' })
    });
    const badPostJson = await badPostRes.json();
    assert.strictEqual(badPostRes.status, 400);
    assert.strictEqual(badPostJson.success, false);
    console.log('✅ POST /api/notes validación de campos requeridos OK');

    // 4. POST crear nota nueva
    const createRes = await fetch(`${baseUrl}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Nueva nota de prueba',
        content: 'Detalle de la nota creada durante tests',
        category: 'Trabajo',
        priority: 'Alta',
        isPinned: false
      })
    });
    const createJson = await createRes.json();
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createJson.success, true);
    assert.ok(createJson.data.id);
    const createdId = createJson.data.id;
    console.log(`✅ POST /api/notes OK (ID generado: ${createdId})`);

    // 5. GET por ID
    const getByIdRes = await fetch(`${baseUrl}/notes/${createdId}`);
    const getByIdJson = await getByIdRes.json();
    assert.strictEqual(getByIdRes.status, 200);
    assert.strictEqual(getByIdJson.data.title, 'Nueva nota de prueba');
    console.log('✅ GET /api/notes/:id OK');

    // 6. PUT actualizar nota
    const updateRes = await fetch(`${baseUrl}/notes/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Nota modificada con éxito',
        isPinned: true
      })
    });
    const updateJson = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateJson.data.title, 'Nota modificada con éxito');
    assert.strictEqual(updateJson.data.isPinned, true);
    console.log('✅ PUT /api/notes/:id OK');

    // 7. Filtros y búsqueda
    const filterRes = await fetch(`${baseUrl}/notes?category=Trabajo`);
    const filterJson = await filterRes.json();
    assert.strictEqual(filterRes.status, 200);
    assert.ok(filterJson.data.every(n => n.category === 'Trabajo'));
    console.log('✅ GET /api/notes?category=Trabajo filtro OK');

    const searchRes = await fetch(`${baseUrl}/notes?search=modificada`);
    const searchJson = await searchRes.json();
    assert.strictEqual(searchRes.status, 200);
    assert.strictEqual(searchJson.data.length, 1);
    console.log('✅ GET /api/notes?search=... búsqueda OK');

    // 8. DELETE nota
    const deleteRes = await fetch(`${baseUrl}/notes/${createdId}`, {
      method: 'DELETE'
    });
    const deleteJson = await deleteRes.json();
    assert.strictEqual(deleteRes.status, 200);
    assert.strictEqual(deleteJson.success, true);
    console.log('✅ DELETE /api/notes/:id OK');

    // 9. Verificar que ya no existe (404)
    const checkDeletedRes = await fetch(`${baseUrl}/notes/${createdId}`);
    assert.strictEqual(checkDeletedRes.status, 404);
    console.log('✅ Verificación 404 tras eliminación OK');

    console.log('\n🎉 ¡Todas las pruebas de la API pasaron satisfactoriamente!');
  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error('❌ Error en las pruebas:', err);
  process.exit(1);
});
