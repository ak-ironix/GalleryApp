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
const lightBoxRotate = document.createElement("div");
const lightBoxDownload = document.createElement("div");

// setting necessary heirarchy of divs and giving class names
lightBoxContainer.classList.add("lightbox");
lightBoxContent.classList.add("lightbox-content");
lightBoxPrev.classList.add("lightbox-prev");
lightBoxNext.classList.add("lightbox-next");
lightBoxRotate.classList.add("lightbox-rotate");
lightBoxDownload.classList.add("lightbox-download");

lightBoxContainer.appendChild(lightBoxContent);
lightBoxContent.appendChild(lightBoxImg);
lightBoxContent.appendChild(lightBoxPrev);
lightBoxContent.appendChild(lightBoxNext);
lightBoxContent.appendChild(lightBoxRotate);
lightBoxContent.appendChild(lightBoxDownload);

lightBoxNext.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/> </svg >';
lightBoxPrev.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/> </svg>';
lightBoxRotate.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/> <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/> </svg>';
lightBoxDownload.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/> <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/> </svg>'
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
    let x = Math.random() * 100;
    card.src = "https://picsum.photos/seed/" + index * x + "/900/900/";
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
    lightBoxImg.style.transform = "rotate(0deg)";
    rotations = 0;
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
    lightBoxImg.style.transform = "rotate(0deg)";
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
let rotations = 0;
function rotateImage() {
    rotations += 1;
    const degrees = rotations * 90;
    lightBoxImg.style.transform = "rotate(" + degrees + "deg)";
}
async function downloadImage() {
    const imageSrc = lightBoxImg.getAttribute("src");

    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'image ' + index;
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// event Listeners
lightBoxPrev.addEventListener("click", prevImage);          //arrow buttons functionality
lightBoxNext.addEventListener("click", nextImage);
lightBoxRotate.addEventListener("click", rotateImage);
lightBoxDownload.addEventListener("click", downloadImage);

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