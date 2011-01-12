$(document).ready(function(){
  $t=$('#Touchable').Hoverable({logging:true});
  $t.newHover(function(e, touch){ //hoverIN
    $tooltip=$(this).find('.tooltip');
    $tooltip.show();
  }, function(e, touch){//hoverOut
    $tooltip=$(this).find('.tooltip');    
    $tooltip.hide();
  });

})