const hamburger = document.getElementById('mobile_button')
let mobileActive = false

hamburger.addEventListener('click', toggleMobile)

function toggleMobile() {
  console.log(mobileActive)
  if (mobileActive) {
    mobileActive = false
    hamburger.classList.remove('is-active')
    hamburger.setAttribute('aria-expanded', 'false')
  } else {
    mobileActive = true
    hamburger.classList.add('is-active')
    hamburger.setAttribute('aria-expanded', 'true')
  }
}
