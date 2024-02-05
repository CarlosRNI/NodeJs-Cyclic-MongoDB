const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CadastrosSchema = new Schema({
      matricula: {
            type: Number,
            required: true,
      },
      nome: {
            type: String,
            require: true,
      }
});

module.exports = mongoose.model('Cadastros', CadastrosSchema);