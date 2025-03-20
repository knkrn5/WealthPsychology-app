const loginButton = document.querySelector('.login-button');
const userAccount = document.querySelector('.user-account');
const accountIcon = document.querySelector('.account-icon');

loginButton.addEventListener('click', () => {
  console.log("clicked login");
  // userAccount.classList.toggle('active');
  window.location.href = '/login';

});

function authStatusCheck() {
  fetch('/auth-status')
    .then(res => res.text())
    .then(data => {
      console.log(data);
      if (data === 'Logged in') {
        accountIcon.classList.add('active');
        loginButton.classList.add('hide');
        accountIcon.addEventListener('click', () => {
          userAccount.classList.toggle('active');
        });
        fetch('/profile')
          .then(res => res.text())
          .then(data => {
            console.log(data);
          })
        return true;
      } else {
        accountIcon.classList.remove('active');
        loginButton.classList.remove('hide');
      }

    }).catch((err) => {
      console.log(err);
      return false;
    })
}



const fnTest = authStatusCheck();
console.log("fnTest: ", fnTest);

