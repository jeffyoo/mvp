angular.module('app', [])

// controller communicates with the user's input
.controller('MyController', function(MyFactory){
var vm = this;

vm.monthlySalary = null;
vm.carAllowance = null;
vm.carCost = null;
vm.carMakes = [];
vm.carMake = "";
vm.carModels = [];
vm.carModel = "";
vm.vehicleId = null;

vm.inputSalary = function(){
  vm.monthlySalary = vm.monthlySalary
  vm.carAllowance = vm.monthlySalary/5;
  // console.log(vm.monthlySalary);
  // console.log(vm.carAllowance)
}
vm.getMake = function(){
  MyFactory.getMake()
  .then(function(response) {
    vm.carMakes = response.data;
  })
}

vm.getModel = function(carMake){
  MyFactory.getModel(carMake)
  .then(function(response) {
    vm.carModels = response.data;
    console.log('this is car models:', vm.carModels);
  })
}

vm.getVehicleId = function(carMake, carModel) {
  MyFactory.getVehicleId(carMake, carModel)
  .then(function(response) {
    console.log('this is response.data:', response.data);
    vm.vehicleId = response.data[0];
  })
}

// activated by the submit button
vm.makeCall = function(vehicleId) {
  MyFactory.getPrice(vehicleId)
    .then(function(response) {
      vm.carCost = response.data/60;
      console.log('this is the carCost:', vm.carCost)
      if (vm.carCost < vm.carAllowance) {
        console.log('i can buy it')
        vm.price=1;
      } else if (vm.carCost > vm.carAllowance) {
        console.log('cant buy it')
        vm.price=2;
      }
  })
}






})


.factory('MyFactory', function($http){
  // this talks to the app.get on the server side
  var getPrice = function(val){
    console.log('inside of MAKECALL:', val)
    return $http({
      method: "GET",
      url: '/trueCost/' + val
    })
    // .then(function(response) {
    //   console.log('response.data:', response.data);
    //   vm.cost = response.data;
    // })
  }

  var getMake = function(){
    return $http({
      method: "GET",
      url: '/carMake'
    })
  }

  var getModel = function(carMake){
    return $http({
      method: "GET",
      url: '/carModel/' + carMake
    })
  }
//JEFF - Sam told me to look up params object for http module
  var getVehicleId = function(carMake, carModel){
    return $http({
      method:"GET",
      url: '/vehicleId/' + carMake + '/' + carModel
    })
  }

  return {
    getPrice: getPrice,
    getMake: getMake,
    getModel: getModel,
    getVehicleId: getVehicleId
  }

})