const Sequelize = require('sequelize');

const sequelize = new Sequelize('bookstore', 'root', 'deko1983', {
  host: 'localhost',
  dialect: 'mysql',
  define: {
    timestamps: false,
  },
},
);

module.exports = sequelize;