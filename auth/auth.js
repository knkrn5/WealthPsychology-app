const loginButton = document.querySelector('.login-button');

const accountIcon = document.querySelector('.account-icon');
const accountIconImg = document.querySelector('.account-icon .account-icon-image');

const profileCard = document.querySelector('.profile-card');
const profileImg = document.querySelector('.profile-img');
const profileName = document.querySelector('.profile-name');
const profileEmail = document.querySelector('.profile-email');

const logoutButton = document.querySelector('.logout-button');

loginButton.addEventListener('click', () => {
  loginButton.innerHTML = '<span class="spinner"></span> Logging in...';
  loginButton.disabled = true;
  window.location.href = '/login';
});


logoutButton.addEventListener('click', () => {
  const logout = confirm('Are you sure you want to logout?');
  if (logout) {
    window.location.href = '/logout';
  }
});

function outsideClick(e) {
  if (profileCard.classList.contains('active')) {
    if (!accountIcon.contains(e.target) && !profileCard.contains(e.target)) {
      profileCard.classList.remove('active');
    }
  }
}
document.addEventListener('click', outsideClick);

// other way to close when clicked outside using closest
/* function outsideClick(e) {
  if (
    profileCard.classList.contains('active') &&
    !e.target.closest('.account-icon') &&  
    !e.target.closest('.profile-card')     
  ) {
    profileCard.classList.remove('active');
  }
} */

document.addEventListener('click', outsideClick);



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
            accountIconImg.src = data.picture;
            profileImg.src = `https://ui-avatars.com/api/?name=${data.name}`;
            profileEmail.textContent = data.email;
          });
      } else {
        accountIcon.classList.remove('active');
        loginButton.classList.remove('hide');
      }

    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      console.log("change loading state");
    });
}

authStatusCheck();


