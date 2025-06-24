const params = new URLSearchParams(window.location.search);
const dob = params.get('dob');

function showGuestNotFound() {
  document.getElementById('guestName').textContent = 'ゲスト情報が見つかりません';
  document.getElementById('guestMessage').textContent = 'ページが表示できませんでした。URLをご確認ください。';
}

if (!dob) {
  showGuestNotFound();
  throw new Error('dob パラメータが指定されていません');
}

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    const guest = data.find(item => item.dob === dob);
    if (!guest) {
      showGuestNotFound();
      return;
    }

    document.getElementById('guestName').textContent = guest.name + ' へ';
    document.getElementById('guestMessage').textContent = guest.message;

    if (Array.isArray(guest.memories)) {
      const wrapper = document.querySelector('.swiper-wrapper');
      guest.memories.forEach(id => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const img = document.createElement('img');
        img.src = `memories/${id}.jpg`;
        img.alt = `Memory ${id}`;

        img.onerror = () => {
          slide.remove();
        };

        slide.appendChild(img);
        wrapper.appendChild(slide);
      });

      new Swiper('.swiper', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 60,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      });
    }

    if (Array.isArray(guest.portraits)) {
      const container = document.querySelector('.thumbnails');
      guest.portraits.forEach((path, index) => {
        const link = document.createElement('a');
        link.href = path;
        link.download = path.split('/').pop();
        link.setAttribute('aria-label', `イラスト${index + 1}をダウンロード`);

        const img = document.createElement('img');
        img.src = path;
        img.alt = `イラスト${index + 1}`;

        img.onerror = () => {
          link.remove();
        };

        link.appendChild(img);
        container.appendChild(link);
      });
    }

    triggerFireworks();
  })
  .catch(error => {
    console.error('ゲスト情報の読み込みに失敗しました:', error);
    showGuestNotFound();
  });

// 花火アニメーション
function triggerFireworks() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = 9999;
  document.body.appendChild(container);

  const colors = ['#f9c74f', '#90be6d', '#f94144', '#43aa8b', '#577590'];

  for (let i = 0; i < 3; i++) {
    setTimeout(() => createBurst(container, colors), i * 600);
  }

  setTimeout(() => {
    container.remove();
  }, 3000);
}

function createBurst(container, colors) {
  const centerX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
  const centerY = Math.random() * window.innerHeight * 0.3 + window.innerHeight * 0.2;
  const count = 12;

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.style.position = 'absolute';
    spark.style.width = '6px';
    spark.style.height = '6px';
    spark.style.borderRadius = '50%';
    spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    spark.style.left = `${centerX}px`;
    spark.style.top = `${centerY}px`;
    container.appendChild(spark);

    const angle = (Math.PI * 2 * i) / count;
    const distance = 80 + Math.random() * 30;

    spark.animate([
      { transform: 'translate(0, 0)', opacity: 1 },
      {
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
        opacity: 0
      }
    ], {
      duration: 1000 + Math.random() * 300,
      easing: 'ease-out',
      fill: 'forwards'
    });
  }
}
