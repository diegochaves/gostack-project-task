const express = require('express')
const server = express()

let requests = 0
let projects = []

const middlewares = {
  checkIfProjectExists (request, response, next) {
    const project = projects[request.params.id]
    if (project) {
      request.project = project
      return next()
    } else {
      return response.json({error: 'Projeto não encontrado'})
    }
  },
  countRequests (request, response, next) {
    console.log('Contagem de requests processados:', ++requests)
    return next()
  }
}

server.use(middlewares.countRequests)
server.use(express.json())

/** POST /projects: A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.

GET /projects: Rota que lista todos projetos e suas tarefas;

PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;

DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;

POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota; */

server.get('/projects', (request, response) => {
  return response.json(projects)
})

server.post('/projects', ({body: {id, title}}, response) => {
  projects.push({
    id,
    title,
    tasks: []
  })
  return response.json(projects)
})

server.get('/projects/:id', middlewares.checkIfProjectExists, ({project}, response) => {
  return response.json(project)
})

server.put('/projects/:id', middlewares.checkIfProjectExists, ({project, body: {title}}, response) => {
  projects[projects.indexOf(project)].title = title
  return response.json(project)
})

server.delete('/projects/:id', middlewares.checkIfProjectExists, ({project}, response) => {
  projects.splice(projects.indexOf(project), 1)
  return response.send()
})

server.post('/projects/:id/tasks', middlewares.checkIfProjectExists, ({project, body: {title}}, response) => {
  project.tasks.push({
    title
  })
  return response.json(project)
})

server.listen(3000)
