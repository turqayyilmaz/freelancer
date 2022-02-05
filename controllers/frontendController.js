const Portfolio = require('../models/Portfolio');

exports.getIndexPage = async (req, res) => {
  const portfolios = await Portfolio.find({});
  res.render('index', { layout: false, portfolios, pageName: 'index' });
};

exports.getAboutPage = async (req, res) => {
  res.render('about', { layout: false, pageName: 'about' });
};

exports.getContactPage = async (req, res) => {
  res.render('contact', { layout: false, pageName: 'contact' });
};
