$(document).ready(() => {
  // const userID = $('.user').attr('data-user-id')
  $('.like').on('click', function() {
    const resourceID = $(this).attr('data-resource-id');


    // alert(userID)
    // if (liked === 'true') {
      //delete
      $.ajax({
        type: "POST",
        url: `/resources/like/${resourceID}`,
        // succes data here is what the res.json sends
        success: (data) => {
          // let numOfLikes = Number($('.likes').text())
          //   // console.log('es')
          //   userLikes--;
          //   numOfLikes--;
          console.log('ajax', data);
          $('.likes').text(data.likesData.length)
          console.log(data.likesData.length)
        }
      })
    // } else {
    //   $.ajax({
    //     type: "POST",
    //     url: `/resources/like/${resourceID}`,
    //     success: () => {
    //       let numOfLikes = Number($('.likes').text())
    //         // console.log('es')
    //         userLikes++;
    //         numOfLikes++;
    //       $('.likes').text(numOfLikes)
    //       console.log('Updated')
    //       console.log(userLikes)
    //     }
    //   })
    // }
  })
})



