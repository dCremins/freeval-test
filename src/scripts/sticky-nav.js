// When the user scrolls the page, execute myFunction
window.onscroll = function() {checkStick()}

// Get the navbar
const navbar = document.getElementById("navbar")
const mobile = document.getElementById("mobile_navbar")
const header = document.getElementById("header")
const logo = document.getElementById("logo")
const logo_holder = document.getElementById("logo_holder")
const title = document.getElementById("title")
const blurb = document.getElementById("blurb")

// Get the offset position of the navbar
let sticky_title
let sticky_nav
let sticky_mobile
let sticky_logo
if (navbar) {
  sticky_title = title.offsetTop;
  sticky_nav = navbar.offsetTop-78;
  sticky_mobile = mobile.offsetTop;
  sticky_logo = logo.offsetTop;
}
let stuck = false;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function checkStick() {
  if(!navbar) {
    return
  }
  if (window.pageYOffset >= sticky_title) {
    stuck = true;
    title.classList.add("sticky_title")
    header.classList.add("sticky_padding")
    logo.classList.add("sticky_logo")
    logo_holder.classList.add("sticky_logo")
    blurb.classList.add("shrink_blurb")
    navbar.classList.add("sticky_nav")
  }
  if (window.pageYOffset < sticky_title && stuck) {
    stuck = false;
    title.classList.remove("sticky_title")
    header.classList.remove("sticky_padding")
    logo.classList.remove("sticky_logo")
    logo_holder.classList.remove("sticky_logo")
    blurb.classList.remove("shrink_blurb")
    navbar.classList.remove("sticky_nav")
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  if (sticky_mobile) {
    if (window.pageYOffset >= sticky_mobile) {
      mobile.classList.add("sticky_mobile")
    } else {
      mobile.classList.remove("sticky_mobile")
    }
  }
}
