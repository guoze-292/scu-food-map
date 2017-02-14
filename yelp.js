var getRestaurants = function(keyword, restaurants) {
  var auth = {
      consumerKey : "ZEJbboIQpvTcVuik7f4ebQ",
      consumerSecret : "Nb5RCfwciGqIlSSG_WY3BM5He1I",
      accessToken : "GkjEi6HMLbo4mLrycv27eugWPsZSv_hZ",
      accessTokenSecret : "07sNGZkbO1LBdT6JgNljszzfQ88",
      serviceProvider : {
        signatureMethod : "HMAC-SHA1"
      }
    };

  var urls = {
      search : "https://api.yelp.com/v2/search",
      businesses : "https://api.yelp.com/v2/business/{id}"
    };
  var terms = keyword;
  var place = "95053";

  function nonce_generate() {
          return (Math.floor(Math.random() * 1e22).toString());
        }

  var parameters = {
      term: terms,
      location: place,
      oauth_consumer_key: auth.consumerKey,
      oauth_token: auth.accessToken,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      callback: 'cb'
    };

  var encodedSignature = oauthSignature.generate('GET',urls.search, parameters, auth.consumerSecret, auth.accessTokenSecret);
    parameters.oauth_signature = encodedSignature;

  $.ajax({
      url: urls.search,
      data: parameters,
      cache: true,
      dataType: 'jsonp',
      // jsonpCallback: 'cb',
      success: function(data) {
        console.log("success"+ data);
        search_result = data;
        businesses = data.businesses;
        setRestaurants(businesses,restaurants);
        initMarkers(restaurants);
        initInfoWindows(restaurants);
        console.log("current array length: ");
        console.log(restaurants().length);
      },
      error: function(data){
        $("#searchbar").prepend("<div class='warning'> unable to fetch result</div>");

      }
    });

  };

// getRestaurants(restaurants);



var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'),{
    center: {lat: 37.354107, lng: -121.955238},
    zoom: 13
  });

}


var initMarkers = function(restaurants){
  restaurants().forEach(function(e){
      e.marker = new google.maps.Marker({
      position: {lat:e.location.latitude,lng:e.location.longitude},
      map: map,
      title: e.title,
      animation: google.maps.Animation.DROP
    });

  });

};


// Removes the markers from the map, but keeps them in the array.
function clearMarkers(restaurants) {
  restaurants().forEach(function(e){
    e.marker.setMap(null);
  });
}

var currentInfoWindow = null;
var currentAnimationMarker = null;


var initInfoWindows = function(restaurants) {
  var info = '<div id="content"><p><h3> {content} </h3></p>'+
            '<div id="content-img"><img src={image}><p><li>{comment}</li></p>'+
            '<strong><a id="url" href={page_url}>read more</a></strong>  <p id="citation">data cited@Yelp</p></div>';
  restaurants().forEach(function(e){
    var infowindow = new google.maps.InfoWindow({
      content: info.replace("{content}",e.title).replace("{image}",e.img_url)
                    .replace("{comment}",e.comment).replace("{page_url}", e.page_url)
    });
    e.infowindow = infowindow;
    e.marker.addListener('click',function(){
      if(currentInfoWindow){

        currentInfoWindow.close();
      }
      if (currentAnimationMarker!==null)
      {
        currentAnimationMarker.setAnimation(null);
      }
      e.marker.setAnimation(google.maps.Animation.BOUNCE);
      //stop the Animation after a while
      setTimeout(function(){e.marker.setAnimation(null);}, 1400);

      currentAnimationMarker = e.marker;
      e.infowindow.open(map,e.marker);
      currentInfoWindow = infowindow;
    });
  });
};

var setRestaurants = function (businesses,restaurants) {
  if(businesses==undefined|restaurants==undefined)
        $("#searchbar").prepend("<div class='warning'> unable to fetch result</div>");
  else
  {  
  for (var n = 0; n <businesses.length; n++){
    restaurants.push({title:businesses[n].name,
                      id:businesses[n].id,
                      location:{latitude:businesses[n].location.coordinate.latitude,longitude:businesses[n].location.coordinate.longitude},
                      rating:businesses[n].rating,
                      img_url: businesses[n].rating_img_url_large,
                      comment: businesses[n].snippet_text,
                      page_url: businesses[n].url,
                      marker:undefined
                    }
                  );
  }}
};

  var mapError = function(){
    alert("fail to load the Google Map Component");
  };
