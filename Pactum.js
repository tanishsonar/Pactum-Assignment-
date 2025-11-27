const { test } = require('uvu');
const { spec, request } = require('pactum');

let createdId;

test.before(() => {
  request.setBaseUrl('https://api.restful-api.dev');
  request.setDefaultTimeout(7000);
});


test('API 1: GET All Objects', async () => {
  await spec()
    .get('/objects')
    .expectStatus(200)
    .expectJsonLike([{
      id: '1',
      name: 'Google Pixel 6 Pro'
    }]);
});

test('API 2: GET Single Object', async () => {
  await spec()
    .get('/objects/1')
    .expectStatus(200)
    .expectJsonMatch({
      id: '1',
      name: 'Google Pixel 6 Pro'
    });
});

test('API 3: GET Multiple Objects by ID', async () => {
  await spec()
    .get('/objects?id=1&id=2&id=3')
    .expectStatus(200)
    .expectJsonLength(3);
});


test('API 4: POST Create New Object', async () => {
  createdId = await spec()
    .post('/objects')
    .withJson({
      name: 'Automation Test Item',
      data: {
        brand: 'HP',
        storage: '512GB'
      }
    })
    .expectStatus(200)
    .returns('id');

  console.log('Created ID:', createdId);
});

test('API 5: PUT Update Object', async () => {
  await spec()
    .put(`/objects/${createdId}`)
    .withJson({
      name: 'Updated Test Item',
      data: {
        processor: 'Intel i9'
      }
    })
    .expectStatus(200)
    .expectJsonMatch('name', 'Updated Test Item');
});

test('API 6: PATCH Update Object Name Only', async () => {
  await spec()
    .patch(`/objects/${createdId}`)
    .withJson({
      name: 'Patched Name'
    })
    .expectStatus(200)
    .expectJsonMatch('name', 'Patched Name');
});

test('API 7: DELETE Object', async () => {
  await spec()
    .delete(`/objects/${createdId}`)
    .expectStatus(200);
});



test.run();
