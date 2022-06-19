console.log("Let's get this party started!");

$("#search-form").submit(async (e) => {
  e.preventDefault();
  console.log(e.target);
  const imgObj = await getImage($("#search-term").val())
  console.log(imgObj);
  appendImage(imgObj);

})

async function getImage(term) {

  // make axios request
  const response = await axios.get(`https://api.giphy.com/v1/gifs/search?q=${term}&api_key=MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym`);

  // image results are an array in response.data.data
  console.log(response.data.data);

  // return first image that is not already displayed
  for (let imgObj of response.data.data) {
    console.dir(imgObj);
    const url = imgObj.images.original.url;
    const height = imgObj.images.original.height;
    const width = imgObj.images.original.width;
    const {id, title} = imgObj;
    if ($(`img[data-id=${id}]`).length === 0) {
      return {id, url, title, height, width}
    }
  }
  // if not found
  return null;


}

function appendImage(imgObj) {
  const heightToWidthRatio = (+imgObj.height) / (+imgObj.width);
  const $imgDiv = $(
    `<div class="col-4 mb-2 d-flex justify-content-center image-div">
      
    </div>`
  )

  const $img = $(`
    <img class="img" style="max-width: 100%;" alt=${imgObj.title} src=${imgObj.url} data-id=${imgObj.id} data-hwratio=${heightToWidthRatio}>
    </img>
  `);


  // maintain image dimension ratio instead of stretching images
  $("#image-row").append($imgDiv)

  $img.on('load', function(){
    $img.height( heightToWidthRatio * $img.width() ) 
    console.log(heightToWidthRatio)
    console.log($img.width())
    console.log( heightToWidthRatio * $img.width() ) 
    console.log($img);
  })
  $imgDiv.append($img);


}

// logic to maintain size and ratio on window resize
$(window).resize(function(){
  const $imgs = $("img");
  const imgArr = Array.from($imgs);

  imgArr.forEach(function(img) {
    const $img = $(img);
    $img.width("100%");
    $img.height(img.dataset.hwratio * $img.width());
  })
})


$("#remove-button").click((e) => {
  e.preventDefault();
  $("#image-row").empty();
})