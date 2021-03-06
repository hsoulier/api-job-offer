const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const faker = require('faker')
const app = express()

let version = 1
let baseURL = `api/v${version}`
let jobs = []
const arrDep = [04, 05, 06, 13, 83, 84]

// faker.locale = "fr"
for (let i = 1; i < 21; i++) {
    let date = faker.date.recent()
    const regex = /-/g
    jobs = [...jobs, {
        id: i,
        title: faker.name.jobTitle(),
        description: faker.lorem.paragraphs(3),
        duration: Math.round(Math.random() * 20 + 1),
        location: faker.address.city(),
        departement: arrDep[Math.floor(Math.random() * arrDep.length)],
        email: faker.internet.email(),
        date: date.toLocaleDateString('fr-FR').replace(regex, '/')
    }]
}
// console.log(jobs)

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors())


// VERSION API
app.get('/api/:version', function (req, res) {
    res.send(req.query.version)
});
// BASE API REST
app.get(`/${baseURL}/job`, (req, res) => {
    res.send(jobs)
})
// SELECT BY ID
app.get(`/${baseURL}/job/:id`, (req, res) => {
    const id = parseInt(req.params.id)
    res.send(jobs[id - 1] || false)
})
// SELECT BY DEPARTEMENT
app.get(`/${baseURL}/job/byDep/:dep`, (req, res) => {
    const dep = parseInt(req.params.dep)
    let result = []
    jobs.forEach(el => {
        console.log(el['a'])
        if (el['departement'] === dep) {
            result = [...result, el]
        }
    })
    res.send(result)

})

// POST JOBS
app.post(`/${baseURL}/job`, (req, res) => {
    const id = jobs.length + 1
    const title = req.query.title
    const description = req.query.description
    const duration = parseInt(req.query.duration, 10)
    const location = req.query.location
    const email = req.query.email
    const departement = parseInt(req.query.departement, 10)
    const date = new Date().toLocaleDateString('fr-FR').replace(/-/g, '/')
    if (!title) {
        res.send('Title missing')
    }
    if (!description) {
        res.send('Descrption missing')
    }
    if (!duration) {
        res.send("Duration missing")
    }
    if (!location) {
        res.send('Location missing')
    }
    if (!title || !description || !duration || !location) {
        // res.send('Input missing from the form, retry please')
        return
    }
    jobs = [...jobs, {
        id,
        title,
        description,
        duration,
        location,
        date,
        email,
        departement
    }]
    res.send("Votre annonce a été enregistré avec succès")
})





// ! TODO
// MODIFY JOB OFFER
app.put(`/${baseURL}/job/:id`, (req, res) => {
    res.json({
        data: undefined
    })
})

app.listen(3000, () => console.log(`Serveur lancé sur http://localhost:3000/${baseURL}/job`))