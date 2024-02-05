require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Cadastros = require('./models/cadastros');
const fs = require ('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.set('strictQuery', false);
const connectDB = async () => {
      try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log('MongoDB Connected: ', conn.connection.host);
      } catch (error) {
            console.log(error);
            process.exit(1);
      }
}

app.get('/', (req,res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile('index.html', function(error, data) {
            if (error) {
                  res.writeHead(404);
                  res.write('Error: File not found !');
            } else {
                  res.write(data);
            }
            res.end();
      });
});

app.get('/matriculas', (req,res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile('matriculas.html', function(error, data) {
            if (error) {
                  res.writeHead(404);
                  res.write('Error: File not found !');
            } else {
                  res.write(data);
            }
            res.end();
      });
});

/*app.get('/adicionar-cadastro', async (req,res) => {
      try {
            await Cadastros.insertMany([
                  {
                        matricula: 111,
                        nome: "Carlos Eduardo",
                  },
                  {
                        matricula: 222,
                        nome: "Nicole Castagnolli",
                  }
            ]);
            res.send("Data added...");
      } catch (error) {
            console.log(error);
      }
});*/

app.get('/cadastros', async (req,res) => {
      const cadastros = await Cadastros.find();
      if (cadastros) {
            res.json(cadastros);
      } else {
            res.send("Something went wrong...");
      }
});

app.post('/adicionar-cadastro', async (req, res) => {
      try {
        const { matricula, nome } = req.body;
    
        // Validate and handle the data as needed
    
        // Check if the matricula already exists in the database
        const existingCadastro = await Cadastros.findOne({ matricula });
    
        if (existingCadastro) {
          // Matricula already exists, redirect to matriculas.html with an alert message
          res.redirect('https://lime-good-hatchling.cyclic.app/matriculas?alert=MatriculaAlreadyExists');
        } else {
          // Matricula doesn't exist, proceed with inserting the new data into the Cadastros collection
          await Cadastros.insertMany([{ matricula, nome }]);
          res.send("Data added successfully");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
    

// Update data in the Cadastros collection based on the received data
app.post('/update-cadastros', async (req, res) => {
      try {
        const { updatedData, updateAll } = req.body;
    
        if (updateAll) {
          // Clear the existing data in the collection
          await Cadastros.deleteMany({});
          
          // Insert the updated data into the collection
          await Cadastros.insertMany(updatedData);
        } else {
          // Iterate through the updated data and update the corresponding records in the database
          for (const updatedItem of updatedData) {
            const { matricula, nome } = updatedItem;
    
            // Find the document by matricula and update the nome field
            await Cadastros.findOneAndUpdate({ matricula }, { nome });
          }
        }
    
        res.send("Data updated successfully");
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

connectDB().then(() => {
      app.listen(PORT, () => {
            console.log('Listening on port: ', PORT);
      });
});