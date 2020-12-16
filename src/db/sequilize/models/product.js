module.exports = (sequelize, DataTypes) => {
  sequelize.define(
    'User', {
      id: {
        type: DataTypes.UUID,
        defaultValues: sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        defaultValues: sequelize.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValues: sequelize.UUIDV4,
        primaryKey: true,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValues: null,
      },
    },
    {},
  );
};
