let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(${-index * 100}%)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    showSlide(currentIndex);
}

// Automatically change slides every 4 seconds
setInterval(nextSlide, 4000);

// Show the first slide
showSlide(currentIndex);

// Add interactivity: pause on hover
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseover', () => clearInterval(slideInterval));
sliderContainer.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));

let slideInterval = setInterval(nextSlide, 4000);
