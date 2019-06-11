var act_con = 'itre';

var itre = document.getElementById('tab_1');
var civil = document.getElementById('tab_2');
var former = document.getElementById('tab_3');

var itre_staff = document.getElementById('itre_staff');
var civil_staff = document.getElementById('civil_staff');
var former_staff = document.getElementById('former_staff');


if (itre) {
  itre.addEventListener('click', function() { toggleTabContent('itre') } )
}

if (civil) {
  civil.addEventListener('click', function() { toggleTabContent('civil') } )
}

if (former) {
  former.addEventListener('click', function() { toggleTabContent('former') } )
}


function toggleTabContent(clicked) {
  if (clicked === act_con) {
    return
  } else {
    switch(act_con) {
      case 'itre':
        itre.classList.remove("active_tab")
        itre_staff.classList.remove("active_content")
        break
      case 'civil':
        civil.classList.remove("active_tab")
        civil_staff.classList.remove("active_content")
        break
      case 'former':
        former.classList.remove("active_tab")
        former_staff.classList.remove("active_content")
        break
      default:
        break
    }
    switch(clicked) {
      case 'itre':
        itre.classList.add("active_tab")
        itre_staff.classList.add("active_content")
        break
      case 'civil':
        civil.classList.add("active_tab")
        civil_staff.classList.add("active_content")
        break
      case 'former':
        former.classList.add("active_tab")
        former_staff.classList.add("active_content")
        break
      default:
        break
    }
  }
  act_con = clicked;
  return;
}
