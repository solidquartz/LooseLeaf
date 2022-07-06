$(document).ready(() => {
  let userLikes = 0;


  $('.like').on('click', function() {
    const resourceID = $(this).attr('data-resource-id');
    // console.log(this, resourceID)


    $.ajax({
      type: "POST",
      url: `/resources/like/${resourceID}`,
      success: () => {
        let numOfLikes = Number($('.likes').text())
        if(!userLikes) {
          // console.log('es')
          userLikes++;
          numOfLikes++;
        }
        $('.likes').text(numOfLikes)
        console.log('Updated')
      }
    })
  })
})



//   $.ajax({
//     type: "POST",
//     url: '/tweets',
//     // Use $form.serialize here instead of $tweetData since if you have more than one text area in the form you can get all with form
//     // with $tweetData you could only get the one you selected and that defeats the whole serization process
//     data: $form.serialize(),
//     success: () => {console.log($form.serialize())}
//   });
