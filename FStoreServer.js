const express = require('express')
const app = express()
const port = process.env.PORT || 2410
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.listen(port, () => console.log(`Node app listening on port ${port}!`))

const { products } = require('./MyStore-data')

const users = [
    { id: 0, email: 'admin@email.com', password: 'admin1234', role: 'admin' },
    { id: 1, email: 'abc@email.com', password: 'abc1234', role: 'customer' },
    { id: 2, email: 'user1@email.com', password: 'user11234', role: 'customer' }
]

// users
app.post('/login', function (req, res) {
    const body = req.body
    const user1 = users.find(u1 => u1.email === body.email && u1.password === body.password)
    if (user1)
        res.send(user1)
    else
        res.status(404).send("Invalid email or password")
})


// products
app.get('/products/:category?', (req, res) => {
    const { category } = req.params

    if (category) {
        const filteredProducts = products.filter(p => p.category === category)
        res.json(filteredProducts);
    } else {
        res.json(products)
    }
})

app.post('/products', function (req, res) {
    const body = req.body
    const product = products.find(p => p.prodCode === body.prodCode)

    if (product) {
        res.status(400).json({ message: `Product with ${body.prodCode} already exists` })
    } else {
        products.push(body)
        res.send(body)
    }
})

app.put('/products/:prodCode', function (req, res) {
    const prodCode = req.params.prodCode
    const body = req.body
    const prodindex = products.findIndex(p1 => p1.prodCode === prodCode)
    if (prodindex >= 0) {
        const updatedprod = { ...products[prodindex], ...body }
        products[prodindex] = updatedprod
        res.send(updatedprod)
    }
    else
        res.status(404).send(`Product with prodCode "${prodCode}" not found`)
})

app.delete('/product/:prodCode', function (req, res) {
    const prodCode = req.params.prodCode
    const prodindex = products.findIndex(p1 => p1.prodCode === prodCode)
    if (prodindex >= 0) {
        products.splice(prodindex, 1)
        res.send(`Product with prodCode "${prodCode}" deleted`)
    }
    else
        res.status(404).send(`Product with prodCode "${prodCode}" not found`)
})


