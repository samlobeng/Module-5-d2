import express from "express"
import fs from "fs"
import {fileURLToPath} from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import bodyParser from "body-parser"

const blogPostsRouter = express.Router()

const blogPostsJsonPath = join(dirname(fileURLToPath(import.meta.url)), "../data/posts.json")



const getBlogPosts = ()=>{
    const content = fs.readFileSync(blogPostsJsonPath)
    return JSON.parse(content)
}

const writeBlogPosts = (content) => fs.writeFileSync(blogPostsJsonPath, JSON.stringify(content))

blogPostsRouter.get("/", (req, res)=>{
const posts = getBlogPosts()
res.send(posts)
})

blogPostsRouter.get("/:id", (req, res)=>{
    const posts = getBlogPosts()

    const singlePost = posts.find(p=>p._id === req.params.id)

    res.send(singlePost)
    })

blogPostsRouter.post("/",(req, res)=>{
    const authorAvatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    const newPost = {
        ...req.body,
        _id: uniqid(),
	    category: req.body.category,
	    title: req.body.title,
	    cover:"ARTICLE COVER (IMAGE LINK)",
	    readTime: {
	      value: 2,
	      unit: "minute"
	    },
	    author: {
	      name: `${req.body.name} ${req.body.surname}`,
	      avatar:authorAvatar
	    },
	    content: req.body.text,
	    createdAt: new Date()
    
    }
    const posts = getBlogPosts()
    posts.push(newPost)
    writeBlogPosts(posts)
    res.status(200).send({_id: newPost._id})
})

blogPostsRouter.put("/:id", (req, res)=>{
    const posts = getBlogPosts()

    const remainingPosts = posts.filter(blog => blog._id !==req.params.id)

    const updatedPost = {...req.body, _id: req.params.id}
    remainingPosts.push(updatedPost)
    writeBlogPosts(remainingPosts)
    
    res.send(updatedPost)
})

blogPostsRouter.delete("/:id", (req, res)=>{
    const posts = getBlogPosts()
    const remainingPosts = posts.filter(blog => blog._id !==req.params.id)

    writeBlogPosts(remainingPosts)

    res.status(204).send()
})



export default blogPostsRouter