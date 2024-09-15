// Function to increment the counter
function incrementCounter() {
   const counterElement = document.getElementById('counter');
   let currentCount = parseInt(counterElement.textContent, 10);
   counterElement.textContent = currentCount + 1;
}

// Adding event listener to the button
document.addEventListener('DOMContentLoaded', () => {
   const button = document.getElementById('incrementButton');
   button.addEventListener('click', incrementCounter);
});
