document.addEventListener('DOMContentLoaded', () => {
// Callbacks
const ramenMenu = document.getElementById('ramen-menu');
const ramenDetailImage = document.querySelector('.detail-image');
const ramenDetailName = document.querySelector('.name');
const ramenDetailResturant = document.querySelector('.restaurant');
const ramenRatingDisplay = document.getElementById('rating-display');
const ramenCommentDisplay = document.getElementById('comment-display');
const newRamenForm = document.getElementById('new-ramen');

// Function to update the ramen details display
function updateRamenDetails(ramen){ 
  ramenDetailImage.src = ramen.image; 
  ramenDetailImage.alt = ramen.name; 
  ramenDetailName.textContent = ramen.name;
  ramenDetailResturant.textContent = ramen.restaurant;
  ramenRatingDisplay.textContent = ramen.rating;
  ramenCommentDisplay.textContent = ramen.comment;
}

// Function to display all ramen images in db.json file 
function displayAllRamens(){
  fetch('http://localhost:3000/ramens')
    .then(response => response.json())
    .then(ramens => {
      ramens.forEach(ramen => displaySingleRamen(ramen));
    })
    .catch(error => console.error('Error fetching ramen data:', error));
}

// Function for displaying a single ramen image
function displaySingleRamen(ramen) {
  const existingImg = document.querySelector(`img[data-id= '${ramen.id}']`);
  if (existingImg) {
    return;
  }
  const ramenImg = document.createElement('Img');
  ramenImg.src = ramen.image;
  ramenImg.alt = ramen.name;
  ramenImg.dataset.restaurant = ramen.restaurant; 
  ramenImg.dataset.rating = ramen.rating; 
  ramenImg.dataset.comment = ramen.comment;
  ramenImg.addEventListener('click', () => {
    updateRamenDetails(ramen);
  });
  ramenMenu.appendChild(ramenImg);
}

// Submit listener for the form 
function handleFormSubmit(event){
  event.preventDefault();
  let name = document.getElementById('new-name').value;
  let restaurant= document.getElementById('new-restaurant').value;
  let image = document.getElementById('new-image').value;
  let rating = document.getElementById('new-rating').value;
  let comment = document.getElementById('new-comment').value;

  try {
    const url = new URL(image); 
    const validImageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const isValidExtension = validImageExtensions.some(ext => image.endsWith(ext));
    if (!isValidExtension){
      alert('Please enter a valid image URL with the proper image format (.png, .jpg, .jpeg, .gif)');
      return;
    } 
  } catch (error) {
    alert('Please enter a valid URL starting with http/https.');
    return;
  }
  const newRamen = {name, restaurant, image, rating, comment};

  fetch('http://localhost:3000/ramens', {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newRamen), 
  })
  .then(response => response.json())
  .then((ramen) => {
    displaySingleRamen(ramen);
    newRamenForm.reset();
  })
  .catch(error => console.error('Error submitting ramen', error));
}

function main(){ 
  displayAllRamens();
  newRamenForm.addEventListener('submit', handleFormSubmit);
}
main();
});