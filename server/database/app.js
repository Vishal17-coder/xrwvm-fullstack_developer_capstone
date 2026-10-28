const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());

const dealersData = JSON.parse(fs.readFileSync('./data/dealers.json', 'utf8')).dealers;
let reviewsData = JSON.parse(fs.readFileSync('./data/reviews.json', 'utf8')).reviews;

// Express root route
app.get('/', (req, res) => {
  res.send('Welcome to the Dealership and Reviews Database Microservice');
});

// Endpoint: Get all dealers
app.get('/fetchDealers', (req, res) => {
  res.json(dealersData);
});
app.get('/getdealers', (req, res) => {
  res.json(dealersData);
});

// Endpoint: Get dealer by ID
app.get('/fetchDealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dealer = dealersData.find((d) => d.id === id);
  if (dealer) {
    res.json(dealer);
  } else {
    res.status(404).json({ error: 'Dealer not found' });
  }
});
app.get('/dealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const dealer = dealersData.find((d) => d.id === id);
  if (dealer) {
    res.json(dealer);
  } else {
    res.status(404).json({ error: 'Dealer not found' });
  }
});

// Endpoint: Get dealers by State
app.get('/fetchDealers/:state', (req, res) => {
  const stateQuery = req.params.state.toLowerCase();
  const filtered = dealersData.filter(
    (d) =>
      d.state.toLowerCase() === stateQuery ||
      d.st.toLowerCase() === stateQuery
  );
  res.json(filtered);
});
app.get('/dealers/:state', (req, res) => {
  const stateQuery = req.params.state.toLowerCase();
  const filtered = dealersData.filter(
    (d) =>
      d.state.toLowerCase() === stateQuery ||
      d.st.toLowerCase() === stateQuery
  );
  res.json(filtered);
});

// Endpoint: Get reviews for dealer by ID
app.get('/fetchReviews/dealer/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const reviews = reviewsData.filter((r) => r.dealership === id);
  res.json(reviews);
});

// Endpoint: Insert review
app.post('/insertReview', (req, res) => {
  const newReview = req.body;
  newReview.id = reviewsData.length + 1;
  reviewsData.push(newReview);
  res.status(201).json({ message: 'Review added successfully', review: newReview });
});

app.listen(port, () => {
  console.log(`Database Microservice running on http://localhost:${port}`);
});
