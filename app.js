function AppViewModel(){
  var self = this;
  self.keyword = "";
  self.myrestaurants = ko.observableArray();
  // for(var n=0;n<restaurants.length;n++){
  //   self.myrestaurants.push(
  //     {title:restaurants[n].title,
  //     location: {latitude:restaurants[n].location.coordinate.latitude, longitude:restaurants[n].location.coordinate.longitude},
  //     id: restaurants[n].id});
  // }
  self.getfood = function(){
    clearMarkers(self.myrestaurants);
    self.myrestaurants.removeAll();
    getRestaurants(self.keyword, self.myrestaurants);
  };
  console.log("initial array"+ self.myrestaurants());
  console.log(self.myrestaurants());

  self.selectMarker = function(e){
      if(currentInfoWindow){

        currentInfoWindow.close();

      }
      if (currentAnimationMarker!==null)
      {
        currentAnimationMarker.setAnimation(null);
      }
      e.infowindow.open(map,e.marker);
      currentInfoWindow = e.infowindow;
      e.marker.setAnimation(google.maps.Animation.BOUNCE);
      //stop the Animation after a while
      setTimeout(function(){e.marker.setAnimation(null);}, 1500);


  };

}

 ko.applyBindings(new AppViewModel());
