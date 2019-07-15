const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 4000;

function getTime() {
    return new Date().toLocaleString;
}

// Database
const db = require('./models')

//------Middleware------//
//Body parser pulls data off of request object and puts it in body property
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Serve Static Assests
app.use(express.static(`${__dirname}/public`))

//ROOT route
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`)
});

app.get(`/api/v1/cities`, (req, res) => {
    db.City.find({}, (error, allCities) => {
        if (error) {
            return res.status(400).json({
                status: 400,
                message: `Please try again`
            });
        }
        res.status(200).json({
            status: 200,
            numberOfResults: `Found ${allCities.length} cities`,
            data: allCities,
            requestedAt: getTime(),
        })
    })
})

app.get(`/api/v1/cities/:city_id`, (req, res) => {
    db.City.findById(req.params.city_id, (error, foundCity) => {
        if (error) {
            return res.status(400).json({
                status: 400,
                message: `Please try again`
            });
        }
        res.status(200).json({
            status: 200,
            data: foundCity,
            requestedAt: getTime(),
        })
    })
})



app.post('/api/v1/cities', (req, res) => {
    const newCity = req.body;

    db.City.create(newCity, (err, createdCity) => {
        if (err) {
            return res.status(400).json({
                status: 201,
                message: `Try Again`
            })
        }

        res.status(200).json({
            data: createdCity,
            requestedAt: new Date().toLocaleDateString
        })
    })
})

//==City Update
app.put(`/api/v1/cities/:city_id`, (req, res) => {
    db.City.findByIdAndUpdate(req.params.city_id, req.body, { new: true }, (error, updatedCity) => {
        if (error) {
            return res.status(400).json({
                status: 400,
                message: `Something went wrong`
            })
        }
        res.status(202).json({
            status: 202,
            data: updatedCity,
            requestedAt: getTime(),
        })
    })

})



//City Destroy
app.delete('/api/v1/cities/:city_id', (req, res) => {
    db.City.findByIdAndDelete(req.params.city_id, (error, foundCity) => {
        if (error) {
            return res.status(400).json({
                status: 400,
                message: `Please try again`
            })
        }

        console.log(foundCity);
        res.status(200).json({
            status: 200,
            message: `Success. ${foundCity.name} deleted`
        })
    })
})

//Start Server
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))