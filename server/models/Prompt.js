const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    category: { type: String, default: 'Other' },
    tags: { type: [String], default: [] },
    isFavorite: { type: Boolean, default: false },
    useCount: { type: Number, default: 0 },
    lastUsed: { type: Date, default: () => new Date() }
  },
  { timestamps: true }
);

PromptSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

module.exports = mongoose.model('Prompt', PromptSchema);

