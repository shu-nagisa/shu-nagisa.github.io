function authenticate() {
  const dob = document.getElementById('dob').value.trim();
  const errorEl = document.getElementById('error');

  if (!/^\d{8}$/.test(dob)) {
    errorEl.textContent = '8桁の生年月日を入力してください。';
    return;
  }

  // 誕生日に一致するゲストを探して、URLにクエリパラメータで渡す
  fetch('guests.json')
    .then(res => res.json())
    .then(guests => {
      const guest = guests.find(g => g.dob === dob);
      if (guest) {
        window.location.href = `guest.html?dob=${dob}`;
      } else {
        errorEl.textContent = '該当するゲストが見つかりませんでした。';
      }
    })
    .catch(() => {
      errorEl.textContent = 'データの読み込みに失敗しました。';
    });
}
