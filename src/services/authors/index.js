import express from "express"
import fs from "fs"
import {fileURLToPath} from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
console.log(currentFilePath)
const currentFolderPath = dirname(currentFilePath)
console.log(currentFolderPath)

const authorsJSONPath = join(currentFolderPath, "posts.json") 

// GET /authors => returns the list of authors
authorsRouter.get("/", (req, res)=>{
    const authorsJSONContent = fs.readFileSync(authorsJSONPath)
    const contentASJSON = JSON.parse(authorsJSONContent)

    res.send(contentASJSON)
})
// GET /authors/123 => returns a single author
authorsRouter.get("/:id", (req, res)=>{
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const author = authors.find(author => author._id === req.params.id)

    res.send(author)

})

// POST /authors => create a new author
authorsRouter.post("/", (req, res) => {
    const authorAvatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    const newAuthor = { ...req.body, avatar: authorAvatar, _id: uniqid(), createdAt: new Date() }
  
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    authors.push(newAuthor)
  
    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  
    res.status(201).send({ _id: newAuthor._id })
  })
  
// PUT /authors/123 => edit the author with the given id
authorsRouter.put("/:id", (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    const remainingAuthors = authors.filter(author => author._id !== req.params.id)
  
    const modifiedAuthor = { ...req.body, _id: req.params.id }
  
    remainingAuthors.push(modifiedAuthor)
  
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  
    res.send(modifiedAuthor)
  })
  
// DELETE /authors/123 => delete the author with the given id
authorsRouter.delete("/:id", (req, res) => {
    // 1. Read users.json file obtaining an array
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  
    // 2. Filter out the specified id
  
    const remainingAuthors = users.filter(author => author._id !== req.params.id) // ! = =
  
    // 3. Save the new content (remainingAuthors) on posts.json file back
  
    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))
  
    // 4. Send a proper response
    res.status(204).send()
  })
export default authorsRouter