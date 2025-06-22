// URLパラメータから生年月日を取得
const params = new URLSearchParams(window.location.search);
const dob = params.get('dob');

if (!dob) {
  document.getElementById('guestName').textContent = 'ゲスト情報が見つかりません';
  throw new Error('dob パラメータが指定されていません');
}

fetch('guests.json')
  .then(response => response.json())
  .then(data => {
    const guest = data.find(item => item.dob === dob);
    if (!guest) {
      document.getElementById('guestName').textContent = 'ゲスト情報が見つかりません';
      return;
    }

    // ゲスト名・メッセージ表示
    document.getElementById('guestName').textContent = guest.name + ' 様';
    document.getElementById('guestMessage').textContent = guest.message;

    // メモリー画像のスライダー
    if (Array.isArray(guest.memories)) {
      const wrapper = document.querySelector('.swiper-wrapper');
      guest.memories.forEach(id => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';

        const img = document.createElement('img');
        img.src = `memories/${id}.jpg`;
        img.alt = `Memory ${id}`;

        slide.appendChild(img);
        wrapper.appendChild(slide);
      });

      // Swiper 初期化
      new Swiper('.swiper', {
        loop: true,
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

    // イラスト画像（4枚）
    if (Array.isArray(guest.portraits)) {
      const container = document.querySelector('.thumbnails');
      guest.portraits.forEach((path, index) => {
        const link = document.createElement('a');
        link.href = path;
        link.download = path.split('/').pop();

        const img = document.createElement('img');
        img.src = path;
        img.alt = `イラスト${index + 1}`;

        link.appendChild(img);
        container.appendChild(link);
      });
    }
  })
  .catch(error => {
    console.error('ゲスト情報の読み込みに失敗しました:', error);
    document.getElementById('guestName').textContent = 'エラーが発生しました';
  });
