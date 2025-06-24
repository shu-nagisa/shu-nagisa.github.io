// 花火アニメーションの表示
function createFirework() {
  const fireworksContainer = document.getElementById('fireworks');
  
  const firework = document.createElement('div');
  firework.classList.add('fireworks');

  // ランダムな位置と時間を設定
  firework.style.top = `${Math.random() * 100}vh`;
  firework.style.left = `${Math.random() * 100}vw`;
  firework.style.animationDuration = `${Math.random() * 2 + 3}s`; // ランダムなアニメーション時間

  fireworksContainer.appendChild(firework);

  // 一定時間後に花火を削除
  setTimeout(() => {
    firework.remove();
  }, 5000); // 5秒後に花火を削除
}

// ページ読み込み時に花火を作成
document.addEventListener('DOMContentLoaded', () => {
  setInterval(createFirework, 1000); // 毎秒新しい花火を作成
});

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

    // スライダー画像
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

    // イラスト画像
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
  })
  .catch(error => {
    console.error('ゲスト情報の読み込みに失敗しました:', error);
    showGuestNotFound();
  });
