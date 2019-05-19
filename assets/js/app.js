// Insert new Block data
function writeNewData(blockid, color, quantity) {
    var postData = {
        blockid: blockid,
        color: color,
        quantity: quantity,
      };
      var newPostKey = firebase.database().ref().child('/').push().key;
      var updates = {};
      updates['/' + newPostKey] = postData;

      return firebase.database().ref().update(updates);
    
  }

  //Modify unique data
  function writeExistingData(key,blockid, color, quantity){
    var postData = {
        blockid: blockid,
        color: color,
        quantity: quantity,
      };
      firebase.database().ref(key+'/').set(postData, function(error) {
        if (error) {
          console.log('Error')
        } else {
          console.log("Data Saved");
        }
      });

  }

  //delete particular block
  function deleteData(key){
    firebase.database().ref(key+'/').remove();
  }


  //get current stored data
  function getData(){
  $("#tb").html('<tr class="text-center"><td colspan="4"><i class="fa fa-spinner fa-spin" aria-hidden="true"></i></td></tr>');
  firebase.database().ref('/').once("value", function(snapshot) {
    var res=null;
    snapshot.forEach(function(childSnapshot) {
      res +='<tr><input type="hidden" name='+childSnapshot.key+'><td scope="row"><input class="form-control blockid" type="text" readonly value='+childSnapshot.val().blockid+'></td><td><input class="form-control color" type="text" readonly value='+childSnapshot.val().color+'></td><td><input class="form-control quantity" type="number" readonly value='+childSnapshot.val().quantity+'></td><th class="text-right"><button class="btn" onclick="editNode(this)"><i class="fa fa-pencil-square-o" aria-hidden="true"></i>  Edit</button> <button class="btn" onclick="deleteNode(this)"><i class="fa fa-trash-o" aria-hidden="true"></i>  Delete</button></th> </tr>';
      });
      $("#tb").html(res);
 }, function (error) {
    console.log("Error: " + error.code);
 });
}

// Function callled when edit button presssed
function editNode(e){
  if($(e).text() == "SAVE"){
    var key=$(e).parent().parent().find('input').attr('name');
    var blockid = $(e).parent().parent().find('.blockid').val();
    var color = $(e).parent().parent().find('.color').val();
    var quantity = $(e).parent().parent().find('.quantity').val();

    if(!blockid || !color || !quantity){
    alert('Required Fields');
  }
    else{
    writeExistingData(key,blockid,color,quantity);
    $(e).html('<i class="fa fa-pencil-square-o" aria-hidden="true"></i>  Edit');
    $(e).parent().parent().find('td').each(function(i,val) {
      $(val).children().attr('readonly','readonly');
    });
   }
    
 }
else{
  $(e).parent().parent().find('td').each(function(i,val) {
    $(val).children().removeAttr('readonly');
  }); 
  $(e).text("SAVE"); 
}
}


//function called when delete button pressed
function deleteNode(e){
   $(e).parent().parent().remove();
  var key=$(e).parent().parent().find('input').attr('name');
  deleteData(key);
  
}

//function called when new block added by modal
function addNewBlock(){
  var field1=$("#idInput").val();
     var field2=$("#colorInput").val();
     var field3=$("#quantityInput").val();
     if(navigator.onLine){
      writeNewData(field1,field2,field3);
     $('#newDataModal').modal('hide');
     $('#newDataModal').find('form')[0].reset();
     getData();
     } else {
      alert('Please connect to internet');
     }
  return false;
}

$(document).ready(function(){
    //checks you are connected to internet
    if(navigator.onLine){
      getData();
     } else {
      alert('Please connect to internet');
     }
   
     
})

