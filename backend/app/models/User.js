import { Model, DataTypes } from "sequelize";
import sequelize from "../database.js";
import { generateNonce } from "../helpers.js";
import { toChecksumAddress } from "../sanitizers.js";

class User extends Model {
    /**
     * If user exists for the given username it returns that else create a user with a random nonce string.
     * @param {string} address user address
     * @returns {[User, boolean]} [user, created] 
    */
    static async getOrCreate(address) {
        address = toChecksumAddress(address);
        let user = await User.findOne({
            where: { address }
        });
        if (user) return [user, false];
        user = new User({
            address,
            nonce: generateNonce()
        });
        user.save();
        return [user, true];
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: DataTypes.STRING,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nonce: {
        type: DataTypes.STRING
    },
    isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastBlock: {
        type: DataTypes.INTEGER,
    },
    donationsEnabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    currentNonce: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "users"
})

export default User;