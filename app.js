function AppViewModel(){
  var self = this;
  self.keyword = ko.observable();
  self.myrestaurants = ko.observableArray();
  getRestaurants('food', self.myrestaurants);

  self.foodchoice = ko.observable("Food");
  self.foodlist = ko.observableArray(["Sushi","Hotpot","Pho","Hamburger","Pizza","Seafood","Fastfood","BBQ"]);
  self.restaurants = ko.computed(function(){
    if(!self.keyword()){
      self.myrestaurants().forEach(function(e){
        if(e.marker){
            e.marker.setVisible(true);
          }
      });
      return self.myrestaurants();
    }
    else if (self.myrestaurants()){
      if(currentInfoWindow){currentInfoWindow.close();}
      var temArray = ko.observableArray();
      self.myrestaurants().forEach(function(e){
      if(e.title.toLowerCase().indexOf(self.keyword().toLowerCase()) >= 0&&e.marker) 
      {   e.marker.setVisible(true);
          temArray().push(e);
      }
      else if (e.marker)
      {
          e.marker.setVisible(false);
      }
        });
    return temArray();
    }
   
  }, this);


  self.getfood = function(){
    var randomNum = Math.round(self.foodlist().length * Math.random())-1;
    clearMarkers(self.myrestaurants);
    self.myrestaurants.removeAll();
    getRestaurants(self.foodlist()[randomNum], self.myrestaurants);
    console.log(self.foodlist()[randomNum]);
    self.foodchoice(self.foodlist()[randomNum]);
  };
  //randomly select food choice and fetch data of that food chocie


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
