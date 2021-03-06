$(document).ready(() => {

  // Likes
  $('.like').on('click', function() {
    const resourceID = $(this).attr('data-resource-id');
    $.ajax({
      type: "POST",
      url: `/resources/like/${resourceID}`,
      success: (data) => {
        $('.likes').text(data.likesData.length);
      }
    });
  });

  // Ratings
  $('.ratingButton').on('click', function() {
    const resourceID = $(this).attr('data-resource-id');
    const newRating = Number($(this).attr('data-rating'));
    $.ajax({
      type: "POST",
      url: `/resources/rating/${resourceID}`,
      data: { newRating },
      success: ({ avgRating }) => {
        $('.rating').text(avgRating);
      }
    });
  });
});



