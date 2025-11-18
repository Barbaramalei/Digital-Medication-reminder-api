// Dashboard interactions: populate reminders, quick actions (localStorage)
function getList(key){ return JSON.parse(localStorage.getItem(key) || '[]'); }
function setList(key, arr){ localStorage.setItem(key, JSON.stringify(arr)); }

function renderReminders(){
  var list = getList('pillpal_reminders');
  var container = document.getElementById('reminderList');
  container.innerHTML = '';
  if(list.length === 0){
    var li = document.createElement('li');
    li.className = 'reminder';
    li.innerHTML = '<div class="left"><div class="time">—</div><div class="name muted">No reminders set</div></div>';
    container.appendChild(li);
    return;
  }
  list.forEach(function(r,idx){
    var tpl = document.getElementById('reminderTpl');
    var clone = tpl.content.cloneNode(true);
    var li = clone.querySelector('li');
    li.querySelector('.time').textContent = r.time;
    li.querySelector('.name').textContent = r.name + (r.dose ? (' — ' + r.dose) : '');
    // buttons
    li.querySelector('.snooze').addEventListener('click', function(){ alert('Snoozed ' + r.name); });
    li.querySelector('.taken').addEventListener('click', function(){
      var notes = getList('pillpal_notifications');
      notes.unshift('Marked taken: ' + r.name + ' at ' + r.time);
      setList('pillpal_notifications', notes);
      renderNotifications();
      alert('Marked taken');
    });
    container.appendChild(li);
  });
}

function renderPres(){
  var arr = getList('pillpal_prescriptions');
  var el = document.getElementById('presList');
  el.innerHTML = '';
  if(arr.length === 0){ el.innerHTML = '<li class="muted">No prescriptions</li>'; return; }
  arr.forEach(function(p){ var li = document.createElement('li'); li.textContent = p; el.appendChild(li); });
}

function renderNotifications(){
  var arr = getList('pillpal_notifications');
  var el = document.getElementById('noteList');
  el.innerHTML = '';
  if(arr.length === 0){ el.innerHTML = '<li class="muted">No notifications</li>'; return; }
  arr.forEach(function(n){ var li = document.createElement('li'); li.textContent = n; el.appendChild(li); });
}

document.addEventListener('DOMContentLoaded', function(){
  // session
  var session = JSON.parse(localStorage.getItem('pillpal_session') || 'null');
  var userName = document.getElementById('userName');
  if(session && session.name){ userName.textContent = session.name; } else { userName.textContent = 'Guest'; }

  // set today's date
  var today = new Date();
  document.getElementById('todayDate').textContent = today.toLocaleDateString();

  // sample data (only if not set)
  if(getList('pillpal_reminders').length === 0){
    setList('pillpal_reminders', [
      {time:'08:00', name:'Vitamin D', dose:'1 tab'},
      {time:'13:00', name:'Metformin', dose:'2 tabs'},
      {time:'21:00', name:'Atorvastatin', dose:'1 cap'}
    ]);
  }
  if(getList('pillpal_prescriptions').length === 0){
    setList('pillpal_prescriptions', ['Metformin — 500mg', 'Atorvastatin — 20mg']);
  }

  renderReminders();
  renderPres();
  renderNotifications();

  // add reminder quick add
  var addBtn = document.getElementById('addBtn');
  if(addBtn){
    addBtn.addEventListener('click', function(){
      var time = prompt('Reminder time (e.g., 07:30)');
      var name = prompt('Medication name (e.g., Paracetamol)');
      var dose = prompt('Dose (e.g., 1 tab)');
      if(time && name){
        var arr = getList('pillpal_reminders');
        arr.push({time:time,name:name,dose:dose});
        setList('pillpal_reminders', arr);
        renderReminders();
      }
    });
  }

  // logout via profile nav
  var profileNav = document.getElementById('profileNav');
  if(profileNav){
    profileNav.addEventListener('click', function(e){ e.preventDefault(); if(confirm('Log out?')){ localStorage.removeItem('pillpal_session'); location.href='index.html'; }});
  }
});
