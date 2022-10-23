const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        max: 255
    },
    thumbnail: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    createdId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    updatedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    listNameImages: {
        type: Array,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('products', productSchema);