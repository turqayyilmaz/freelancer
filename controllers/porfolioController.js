const Portfolio = require('../models/Portfolio');
const utils = require('./utils');

exports.getPortfolioPage = (req, res) => {
  res.locals.pageName = 'portfolio';
  res.locals.pageTitle = 'Portfolios';

  res.render('admin/portfolio.ejs');
};

exports.savePortfolio = async (req, res) => {
  let portfolio = req.body._id
    ? await Portfolio.findById(req.body._id)
    : new Portfolio();

  let image = await utils.uploadImage(req, 'image', 'portfolios');

  portfolio.title = req.body.title;
  portfolio.description = req.body.description;
  if (image != '') portfolio.image = image;
  await portfolio.save((err, portfolio) => {
    if (err) {
      res.status(400).json({ status: 'error', portfolio });
    } else {
      res.status(200).json({ status: 'success', portfolio });
    }
  });
};
exports.getPortfoliosJson = (req, res) => {
  Portfolio.dataTables({
    total: 'recordsTotal',
    limit: req.query.length,

    formatter: function (portfolio) {
      return {
        _id: portfolio._id,
        title: portfolio.title,
        image: `<img src='${portfolio.image}' width='100px'>`,
        description: portfolio.description,
        actions: `<a class="btn btn-success" href="javascript:portfolioEdit('${portfolio._id}');">Edit</a>
        <a class="btn btn-danger" href="javascript:portfolioDelete('${portfolio._id}');">Delete</a>`,
      };
    },
    skip: req.query.start,
    search: {
      value: req.query.search.value,
      fields: ['title', 'description'],
    },
    sort: {
      title: 1,
    },
  }).then(function (table) {
    res.json({
      data: table.data,
      recordsFiltered: table.total,
      recordsTotal: table.total,
    });
  });
};
exports.getPortfolio = async (req, res) => {
  const p = await Portfolio.findById(req.params._id);
  res.json(p);
};
exports.deletePortfolio = (req, res) => {
  let id = req.params._id;
  Portfolio.findOneAndRemove({ _id: id }, (err, doc) => {
    console.log('doc', doc);
    if (err) {
      console.log(error);
      res.status(400).json({ status: 'error', error: err });
    } else {
      res.status(200).json({ status: 'success', portfolio: doc });
    }
  });
};
