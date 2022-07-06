$(document).ready(() => {
  let userLikes = 0;
  $('.like').on('click', () => {
    let numOfLikes = Number($('.likes').text())
    if(!userLikes) {
      // console.log('es')
      userLikes++;
      numOfLikes++;
    }
    $('.likes').text(numOfLikes)
  })
})
