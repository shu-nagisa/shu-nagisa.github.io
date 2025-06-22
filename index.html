function authenticate() {
  const dob = document.getElementById('dob').value.trim();
  const errorEl = document.getElementById('error');

  if (!/^\d{8}$/.test(dob)) {
    errorEl.textContent = '正しい8桁の生年月日を入力してください。';
    return;
  }

  // 該当ファイルが存在すると仮定して遷移
  fetch(`guests/${dob}.html`)
    .then(response => {
      if (response.ok) {
        window.location.href = `guests/${dob}.html`;
      } else {
        errorEl.textContent = '該当のページが見つかりませんでした。';
      }
    })
    .catch(() => {
      errorEl.textContent = 'エラーが発生しました。';
    });
}
