// Fetching all the necessary HTML elements
const cardContainer = document.getElementById("card-container");
const cardCountElem = document.getElementById("card-count");
const cardTotalElem = document.getElementById("card-total");
const loader = document.getElementById("loading");

// cardLimit tells total images to be fetched and cardIncrease tells total images to be shown before end of page is reached
const cardLimit = 32;
const cardIncrease = 8;
const pageCount = Math.ceil(cardLimit / cardIncrease);
let currentPage = 1;

cardTotalElem.innerHTML = cardLimit;

// Constants for the lightbox i.e. the click to expand image functionality
const lightBoxContainer = document.createElement("div");
const lightBoxContent = document.createElement("div");
const lightBoxImg = document.createElement("img");
const lightBoxPrev = document.createElement("div");
const lightBoxNext = document.createElement("div");

// setting necessary heirarchy of divs and giving class names
lightBoxContainer.classList.add("lightbox");
lightBoxContent.classList.add("lightbox-content");
lightBoxPrev.classList.add("fa", "fa-angle-left", "lightbox-prev");
lightBoxNext.classList.add("fa", "fa-angle-right", "lightbox-next");

lightBoxContainer.appendChild(lightBoxContent);
lightBoxContent.appendChild(lightBoxImg);
lightBoxContent.appendChild(lightBoxPrev);
lightBoxContent.appendChild(lightBoxNext);

lightBoxNext.innerHTML = '>';
lightBoxPrev.innerHTML = '<';

// adding the lightbox container to the document

document.body.appendChild(lightBoxContainer);

window.onload = function () {
    addCards(currentPage);
};

// Creates new img items inside the card-container div and adds event listener to them to check for clicks on the image

const createCard = (index) => {
    const card = document.createElement("img");
    card.className = "card";
    card.setAttribute('data-index', index - 1);
    card.src = "https://picsum.photos/1280/720?random=" + index;
    card.addEventListener("click", currentImage);
    cardContainer.appendChild(card);
};

// Calls for new images to be added to the grid, Updates images fetched and shows it using the card-actions div

const addCards = (pageIndex) => {
    currentPage = pageIndex;
    const startRange = (pageIndex - 1) * cardIncrease;
    const endRange =
        currentPage == pageCount ? cardLimit : pageIndex * cardIncrease;
    cardCountElem.innerHTML = endRange;
    for (let i = startRange + 1; i <= endRange; i++) {
        createCard(i);
    }
};

// Removes the loading animation and the event listener when end of page has been achieved and all images have been loaded

const removeInfiniteScroll = () => {
    loader.remove();
    window.removeEventListener("scroll", handleInfiniteScroll);
};

// Function to execute aftermath of each scroll or when an image is requested(using arrow/next button) which hasn't been fetched yet

const handleInfiniteScroll = (nextFlag = 0) => {
    loader.style.visibility = 'visible';
    throttle(() => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (clientHeight + scrollTop >= scrollHeight - 5 || nextFlag === 1) {
            // show the loading animation
            addCards(currentPage + 1);
        }
        if (currentPage === pageCount) {
            removeInfiniteScroll();
        }
    }, 2000);
};

// throttle delays the fetching 

var throttleTimer;

const throttle = (callback, time) => {
    if (throttleTimer) return;

    throttleTimer = true;

    setTimeout(() => {
        callback();
        throttleTimer = false;
        loader.style.visibility = 'hidden';
        lightBoxNext.style.visibility = 'visible';
    }, time);
};

// The below part handles the Lightbox part i.e. click to expand, click to move to next/previous image
let index = 0;

function showLightBox(n) {
    if (n > cardContainer.children.length) {
        if (n > cardLimit) {
            index = 0;
        }
        else {
            lightBoxNext.style.visibility = 'hidden';
            lightBoxNext.addEventListener("click", handleInfiniteScroll(1));
        }
    } else if (n < 0) {
        index = 0;
    } else if (n >= cardContainer.length - 4) {
        if (n < cardLimit) {
            lightBoxNext.addEventListener("click", handleInfiniteScroll(1));
        }
    }
    const currElement = '[data-index="' + (index) + '"]';
    document.querySelector(currElement).scrollIntoView();
    lightBoxImg.style.opacity = '0';
    lightBoxImg.style.visibility = 'hidden';
    const imageLocation = cardContainer.children[index].getAttribute("src");
    setTimeout(() => {
        lightBoxImg.style.opacity = '1';
        lightBoxImg.style.visibility = 'visible';
        lightBoxImg.setAttribute("src", imageLocation);
    }, 200)

}

function currentImage() {                                                   //Gets the index of the current image being shown in lightbox
    lightBoxContainer.style.display = "block";
    const imageIndex = parseInt(this.getAttribute("data-index"));
    showLightBox(index = imageIndex);
}
function slideImage(n) {
    showLightBox(index += n);
}
function prevImage() {
    slideImage(-1);
}
function nextImage() {
    slideImage(1);
}


// event Listeners
lightBoxPrev.addEventListener("click", prevImage);          //arrow buttons functionality
lightBoxNext.addEventListener("click", nextImage);

window.addEventListener("scroll", handleInfiniteScroll);    //Event listener for scrolling

lightBoxContainer.addEventListener("click", (e) => {        //Event listener for coming out of lightbox on click
    if (lightBoxContent.contains(e.target)) {
        ;
    } else {
        lightBoxContainer.style.display = "none";
        lightBoxImg.removeAttribute("src");
    }
});


// Adding keyboard functionality to move between images

document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
        prevImage();
    }
    if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
        nextImage();
    }
    if (event.code === 'Escape') {
        lightBoxContainer.style.display = "none";
        lightBoxImg.removeAttribute("src");
    }
})