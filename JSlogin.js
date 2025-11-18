// Login form (localStorage simulation)
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  var email = document.getElementById('email').value.trim().toLowerCase();
  var pwd = document.getElementById('password').value;
  var msg = document.getElementById('loginMessage');
  var stored = localStorage.getItem('pillpal_user_' + email);
  if(!stored){
    msg.textContent = 'No account with that email.';
    return;
  }
  var user = JSON.parse(stored);
  if(user.pwdHash !== btoa(pwd)){
    msg.textContent = 'Incorrect password.';
    return;
  }
  localStorage.setItem('pillpal_session', JSON.stringify({email:email,name:user.first + ' ' + user.last}));
  msg.textContent = 'Login successful. Redirecting...';
  setTimeout(function(){ location.href='dashboard2.html'; }, 700);
});
