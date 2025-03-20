const loginButton = document.querySelector('.login-button');

const accountIcon = document.querySelector('.account-icon');
const accountIconImg = document.querySelector('.account-icon .account-icon-image');

const profileCard = document.querySelector('.profile-card');
const profileImg = document.querySelector('.profile-img');
const profileName = document.querySelector('.profile-name');
const profileEmail = document.querySelector('.profile-email');

const logoutButton = document.querySelector('.logout-button');

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
          profileCard.classList.toggle('active');
        });
        fetch('/user-data')
          .then(res => res.json())
          .then(data => {
            console.log(data);
            profileName.textContent = data.name;
            accountIconImg.src = `https://ui-avatars.com/api/?name=${data.name}`;
            profileImg.src = `https://ui-avatars.com/api/?name=${data.name}`;
            profileEmail.textContent = data.email;
          });
      } else {
        accountIcon.classList.remove('active');
        loginButton.classList.remove('hide');
      }

    }).catch((err) => {
      console.log(err);
    })
}

logoutButton.addEventListener('click', () => {
  const logout = confirm('Are you sure you want to logout?');
  if (logout) {
    window.location.href = '/logout';
  }
});



const fnTest = authStatusCheck();
console.log("fnTest: ", fnTest);

