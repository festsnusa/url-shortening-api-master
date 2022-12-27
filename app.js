let burger = document.querySelector('.header__burger'),
  header = document.querySelector('.header'),
  button = document.querySelector('.header__button'),
  headerBox = document.querySelector('.header__box'),
  contentLink = document.querySelector('.content__link'),
  contentSpan = document.querySelector('.content__span'),
  contentLinks = document.querySelector('.content__links'),
  submit = document.querySelector('.content__submit'),
  mediaQuery = window.matchMedia("(min-width: 1000px)")

async function shortenLink(linkText) {

  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${linkText}`)
  const result = await response.text()

  let obj = JSON.parse(result)

  if (obj.ok) {
    contentSpan.classList.remove('content__span_active')
    addLink(obj.result)
  } else {
    console.log(obj)
    contentSpan.innerHTML = obj.error
    contentSpan.classList.add('content__span_active')
  }

}

function addLink(result) {

  contentLinks.insertAdjacentHTML('beforeend', `
          <div class="content__item">
            <p class="content__item_original-link">${result.original_link}</p>
            <div class="content__item_box">
              <a class="content__item_link" href="${result.full_short_link}" target="_blank">${result.full_short_link}</a>
              <button class="content__item_button" data-link="${result.full_short_link}">Copy</button>
            </div>
          </div>
      `)
    
  addButtonListeners()

}

function addButtonListeners() {
  
  let linkButtons = document.querySelectorAll('.content__item_button')

  linkButtons.forEach((button, i) => {

    button.addEventListener('click', () => {

      console.log(button.dataset.link)
      navigator.clipboard.writeText(button.dataset.link).then(
        () => {

          /* clipboard successfully set */
          linkButtons.forEach((linkButton, j) => {
            if (i == j) {
              return
            }

            linkButtons[j].classList.remove('content__item_button--copied')
            linkButtons[j].innerHTML = 'Copy'
          })

          button.classList.add('content__item_button--copied')
          button.innerHTML = 'Copied!'

        },
        () => {
          /* clipboard write failed */
          console.log('fail!')
        }
      )
    })
  })
}

burger.addEventListener('click', () => {
  burger.classList.toggle('header__burger_active')
  headerBox.classList.toggle('header__box_active')
  document.body.classList.toggle('body_active')
})

submit.addEventListener('click', () => {

  if (contentLink.value.length == 0) {
    contentLink.classList.add('content__link_active')
    contentSpan.classList.add('content__span_active')
    return
  } else {
    contentLink.classList.remove('content__link_active')
  }

  shortenLink(contentLink.value)
})

function changeVisibility() {

  if (mediaQuery.matches) {
    burger.classList.remove('header__burger_active')
    burger.classList.add('header__burger_invisible')
    headerBox.classList.remove('header__box_active')
    headerBox.classList.add('header__box_flex')

    return

  }

  burger.classList.remove('header__burger_invisible')
  headerBox.classList.remove('header__box_active')
  headerBox.classList.remove('header__box_flex')

}

mediaQuery.addEventListener("change", () => changeVisibility())
window.addEventListener('DOMContentLoaded', () => changeVisibility())