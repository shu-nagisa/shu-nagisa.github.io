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
        img.onerror = () => { slide.remove(); };

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
        img.onerror = () => { link.remove(); };

        link.appendChild(img);
        container.appendChild(link);
      });
    }
  })
  .catch(error => {
    console.error('ゲスト情報の読み込みに失敗しました:', error);
    showGuestNotFound();
  });

// 花火アニメーションループ
function launchFireworks() {
  const container = document.getElementById('fireworkContainer');
  setInterval(() => {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * window.innerWidth + 'px';
    firework.style.top = Math.random() * window.innerHeight + 'px';
    firework.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
    firework.style.animationDuration = (1 + Math.random()).toFixed(1) + 's';

    container.appendChild(firework);

    setTimeout(() => {
      firework.remove();
    }, 1500);
  }, 300);
}

launchFireworks();
