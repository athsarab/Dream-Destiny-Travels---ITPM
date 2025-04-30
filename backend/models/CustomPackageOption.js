const mongoose = require('mongoose');

const customPackageOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Travel Agents', 'Hotels', 'Vehicles']
  },
  options: [{
      name: String,
      description: String,
      price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
        validate: {
          validator: function(v) {
            return Number.isFinite(v);
          },
          message: 'Price must be a valid number'
        }
      },
      isAvailable: {
        type: Boolean,
        default: true
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'itemModel',
        required: true
      },
      itemModel: {
        type: String,
        required: true,
        enum: ['Employee', 'Hotel', 'Vehicle']
      }
    }
  ]
}, {
  timestamps: true 
});

module.exports = mongoose.model('CustomPackageOption', customPackageOptionSchema);
