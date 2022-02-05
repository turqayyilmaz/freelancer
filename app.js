const mongoose = require('mongoose');
const express = require('express');
const bycrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require('ejs');
const MongoStore = require('connect-mongo');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require('path');

/* const adminRoutes = require('./src/routes/adminRoutes'); */
const authMiddleware = require('./middlewares/authmiddleware');
const frontEndController = require('./controllers/frontendController');
const loginController = require('./controllers/loginController');

const adminRoutes = require('./routes/adminRoutes');

// parse application/x-www-form-urlencoded
const app = express();
const port = 3000;
const dbUrl = 'mongodb://localhost/freelancer-db';

app.use(
  session({
    secret: 'qewrewqrewqrıuqoweqwyreoqewroıu', // Buradaki texti değiştireceğiz.
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: dbUrl }),
  })
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(
  '/adminlte',
  express.static(path.join(__dirname, '/node_modules/admin-lte/'))
);
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout extractScripts', true);
app.set('layout', 'admin\\layouts\\adminlayout.ejs');

app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));
app.use(fileUpload());

global.userIN = null;
//Routes
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});

app.get('/', frontEndController.getIndexPage);
app.get('/about', frontEndController.getAboutPage);
app.get('/contact', frontEndController.getContactPage);
app.get('/login', (req, res) => {
  res.render('admin/login.ejs', { layout: false });
});
app.post('/login', loginController.loginUser);
app.get('/logout', loginController.logoutUser);
app.use('/admin', authMiddleware, adminRoutes);

const uploadDir = 'public/uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//CONNECT DB
mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connected Successfully');
  });

app.listen(port, () =>
  console.info(`Freelancer App listening on port ${port}`)
);