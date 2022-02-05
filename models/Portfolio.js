const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const dataTable = require('mongoose-datatables');

const PortfolioSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: String,

    image: String,

    slug: { type: String, unique: true, slug: 'title' },
  },

  { timestamps: {} }
);

PortfolioSchema.pre('validate', function (next) {
  this.slug = slugify(this.title, {
    lower: true,
    strict: true,
  });
  next();
});

PortfolioSchema.plugin(dataTable);

const Portfolio = mongoose.model('portfolio', PortfolioSchema);
module.exports = Portfolio;
