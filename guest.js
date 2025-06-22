// URLからdobパラメータを取得
const params = new URLSearchParams(window.location.search);
const dob = params.get('dob');

if (!dob) {
  document.body.innerHTML = '<p>認証情報が見つかりませんでした。</p>';
} else {
  fetch('guests.json')
    .then(res => res.json())
    .then(guests => {
      const guest = guests.find(g => g.dob === dob);
      if (!guest) {
        document.body.innerHTML = '<p>ゲスト情報が見つかりませんでした。</p>';
        return;
      }

      // 名前とメッセージを反映
      document.getElementById('guestName').textContent = guest.name || "";
      document.getElementById('guestMessage').textContent = guest.message || "";

      // スライダー画像挿入
      const sliderWrapper = document.querySelector('.swiper-wrapper');
      guest.memories.forEach(id => {
        const imgPath = `memories/${id}.jpg`;
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = `Memory ${id}`;
        slide.appendChild(img);
        sliderWrapper.appendChild(slide);
      });

      // サムネイル画像挿入
      const thumbContainer = document.querySelector('.thumbnails');
      guest.portraits.forEach((imgPath, index) => {
        const link = document.createElement('a');
        link.href = imgPath;
        link.download = imgPath.split('/').pop();
        const img = document.createElement('img');
        img.src = imgPath;
        img.alt = `Portrait ${index + 1}`;
        link.appendChild(img);
        thumbContainer.appendChild(link);
      });

      // Swiperスライダー初期化（自動再生 + スライド幅調整）
      new Swiper('.swiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        spaceBetween: 10,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      });
    })
    .catch(() => {
      document.body.innerHTML = '<p>ゲスト情報の読み込みに失敗しました。</p>';
    });
