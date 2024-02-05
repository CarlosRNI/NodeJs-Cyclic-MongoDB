require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Cadastros = require('./models/cadastros');

const app = express();
const PORT = process.env.PORT || 3000;

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
      res.send({title: 'Cadastros'});
});

app.get('/adicionar-cadastro', async (req,res) => {
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
});

app.get('/cadastros', async (req,res) => {
      const cadastros = await Cadastros.find();
      if (cadastros) {
            res.json(cadastros);
      } else {
            res.send("Something went wrong...");
      }
});

connectDB().then(() => {
      app.listen(PORT, () => {
            console.log('Listening on port: ', PORT);
      });
});