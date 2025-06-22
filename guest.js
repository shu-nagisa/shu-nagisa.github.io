// Retrieve guest data from localStorage (assuming key "guest" holds the JSON string)
const guestData = localStorage.getItem('guest');
let guest;
if (guestData) {
  guest = JSON.parse(guestData);
} else {
  // If no data in localStorage, you could define a dummy object for testing:
  guest = {
    name: "ゲスト名",
    message: "メッセージをここに表示します。\nこのメッセージは4〜5行程度で表示されます。",
    memories: [1, 2, 3],  // example image IDs for memory photos
    portraits: [
      "images/19900101_1.png",
      "images/19900101_2.png",
      "images/19900101_3.png",
      "images/19900101_4.png"
    ]
  };
}

// Insert guest name and message into the page
document.getElementById('guestName').textContent = guest.name || "";
document.getElementById('guestMessage').textContent = guest.message || "";

// If the guest message contains explicit line breaks (\n), they will be preserved 
// by CSS white-space: pre-line on #guestMessage.

// Populate the Swiper slider with memory photos
if (Array.isArray(guest.memories)) {
  const sliderWrapper = document.querySelector('.swiper-wrapper');
  guest.memories.forEach(id => {
    // Construct image file path. Assuming images are named as "<id>.jpg" in "memories/" directory.
    const imgPath = `memories/${id}.jpg`;
    // Create slide element
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    // Create image element
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;
    imgEl.alt = `Memory ${id}`;
    // Append image to slide, and slide to slider wrapper
    slideEl.appendChild(imgEl);
    sliderWrapper.appendChild(slideEl);
  });
}

// Populate portrait thumbnails with download links
if (Array.isArray(guest.portraits)) {
  const thumbContainer = document.querySelector('.thumbnails');
  guest.portraits.forEach((imgPath, index) => {
    // Create anchor with download attribute
    const linkEl = document.createElement('a');
    linkEl.href = imgPath;
    // Set download filename (optional: use original filename)
    linkEl.download = imgPath.split('/').pop() || "";
    // Create thumbnail image element
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;
    imgEl.alt = `Portrait ${index + 1}`;
    // Assemble and append to thumbnails container
    linkEl.appendChild(imgEl);
    thumbContainer.appendChild(linkEl);
  });
}

// Initialize Swiper slider (with pagination bullets)
const swiper = new Swiper('.swiper', {
  loop: true,              // loop slides continuously
  pagination: {
    el: '.swiper-pagination',
    clickable: true        // allow clicking bullets to change slide
  }
  // (No navigation arrows or scrollbar needed for this use-case)
});
