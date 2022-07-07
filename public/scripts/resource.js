$(document).ready(() => {
  // const userID = $('.user').attr('data-user-id')
  $('.like').on('click', function() {
    const resourceID = $(this).attr('data-resource-id');

      $.ajax({
        type: "POST",
        url: `/resources/like/${resourceID}`,
        success: (data) => {
          console.log('ajax', data);
          $('.likes').text(data.likesData.length)
          console.log(data.likesData.length)
        }
      })
  })
})



