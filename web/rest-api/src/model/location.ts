import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../db/index';

class Location extends Model {
  public id!: number;
  public name!: string;

  public city: string | undefined;
  public country: string | undefined;
  public description: string | undefined;

  public visited!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    visited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'Location'
  }
);

export { Location };
