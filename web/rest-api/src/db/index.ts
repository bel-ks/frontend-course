import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('itmo', 'admin', 'admin', {
  host: 'postgres',
  dialect: 'postgres'
});

export { sequelize };
