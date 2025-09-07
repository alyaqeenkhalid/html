document.addEventListener('DOMContentLoaded', function() {
    // Select elements with specific selectors
    const carousel = document.querySelector('.image-carousel');
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.image-carousel .carousel-prev');
    const nextBtn = document.querySelector('.image-carousel .carousel-next');
    const slideCounter = document.querySelector('.slider-numbers');
    const progressBar = document.querySelector('.slider-progress-bar');
    
    // Image paths - use your actual image paths
    const images = [
        'images/Picture 1.png',
        'images/Picture%204.png',
        'images/Picture%206.png'
    ];
    
    // Clear any existing slides
    track.innerHTML = '';
    
    // Create slides with proper structure
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.style.visibility = 'hidden'; // Start hidden
        slide.innerHTML = `
            <div class="img-container">
                <img src="${img}" alt="Property ${index + 1}">
            </div>
        `;
        track.appendChild(slide);
    });
    
    // Clone first slide for infinite loop
    const firstSlide = track.firstElementChild.cloneNode(true);
    track.appendChild(firstSlide);
    
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;
    const visibleSlides = images.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let autoScrollInterval;
    let startX = 0;
    let isDragging = false;
    
    // Initialize carousel
    function initializeCarousel() {
        // Show first slide
        slides[0].style.visibility = 'visible';
        updateCarouselPosition(false);
        startAutoScroll();
    }
    
    // Update carousel position
    function updateCarouselPosition(animate = true) {
        if (animate) {
            track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicators();
    }
    
    // Update navigation indicators
    function updateIndicators() {
        const displayIndex = currentIndex >= visibleSlides ? 1 : currentIndex + 1;
        slideCounter.textContent = `${displayIndex} / ${visibleSlides}`;
        progressBar.style.width = `${(displayIndex / visibleSlides) * 100}%`;
    }
    
    // Show only the current slide
    function updateSlideVisibility() {
        slides.forEach((slide, index) => {
            slide.style.visibility = index === currentIndex ? 'visible' : 'hidden';
        });
    }
    
    // Go to specific slide
    function goToSlide(index, animate = true) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = index;
        updateSlideVisibility();
        updateCarouselPosition(animate);
        
        // Handle infinite loop
        setTimeout(() => {
            if (currentIndex >= visibleSlides) {
                currentIndex = 0;
                updateCarouselPosition(false);
                updateSlideVisibility();
            }
            isTransitioning = false;
        }, 500);
    }
    
    // Next slide
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    // Previous slide
    function prevSlide() {
        if (currentIndex === 0) {
            // Jump to clone slide before animating back
            currentIndex = visibleSlides;
            updateCarouselPosition(false);
            updateSlideVisibility();
            setTimeout(() => goToSlide(visibleSlides - 1), 50);
        } else {
            goToSlide(currentIndex - 1);
        }
    }
    
    // Auto-scroll
    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        nextSlide();
        startAutoScroll();
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        prevSlide();
        startAutoScroll();
    });
    
    // Touch/swipe support
    carousel.addEventListener('touchstart', (e) => {
        stopAutoScroll();
        startX = e.touches[0].clientX;
        isDragging = true;
        track.style.transition = 'none';
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const diff = startX - x;
        track.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diff}px))`;
    });
    
    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (diff > 50) { // Swipe left
            nextSlide();
        } else if (diff < -50) { // Swipe right
            prevSlide();
        } else { // Return to current position
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        startAutoScroll();
    });
    
    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    
    // Initialize
    initializeCarousel();
});