const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const serviceRoutes = require('./routes/serviceRoutes');
app.use('/api/services', serviceRoutes);

const aboutRoutes = require('./routes/aboutRoutes');
app.use('/api/about', aboutRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

const customPackageRoutes = require('./routes/customPackageRoutes');
app.use('/api/custom-packages', customPackageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

