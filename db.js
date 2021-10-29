const {Sequelize} = require('sequelize');

const db = new Sequelize("postgres://postgres:39ab1e617e64405bb9759a2e79db761c@localhost:5432/animal-server");

module.exports = db;