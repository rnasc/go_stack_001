const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
app.use(logRequests)
app.use('/repositories/:id', validateId)
app.use('/repositories/:id/like', validateId)

/**
 * Placeholder for the database
 */
const repositories = [];

/**
 * Logs the request done
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] - ${url} `

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

/**
 * middleware to validate ID
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
function validateId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'The informed Respository ID format is invalid' });
  }
  next();
}

/**
 * GET route = returns the available repositories
 * and allows for 
 */
app.get('/repositories', (request, response) => {
  const { title, tech } = request.query;

  let results = title
    ? repositories.filter(repository => repository.title.includes(title))
    : repositories;

  results = tech
    ? results.filter(repository => repository.techs.includes(tech))
    : results;

  return response.json(repositories);
})

/**
 * POST route = creates a new repository
 */
app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
})

/**
 * PUT route - updates the repository 
 */
app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID' })
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  likes = repositories[repositoryIndex].likes

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }
  repositories[repositoryIndex] = repository;
  return response.status(200).json(repository);
})

/** 
 * DELETE route - excludes the repository
 */
app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
})


app.put('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found.' })
  }

  repository = repositories[repositoryIndex];
  repository.likes += 1;
  repositories[repositoryIndex] = repository;

  return response.status(201).json(repository);
})

app.listen(3333, () => {
  console.log('😀 🚀 Back-end started!')
});

// export default app;