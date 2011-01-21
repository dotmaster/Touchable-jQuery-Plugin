$(document).ready(function(){
  $t=$('#Touchable').Hoverable();
  $t2=$('#Touchable2').Hoverable();  
  /*$link= $('#Touchable3 a').click(function(e){
    e.preventDefault()
    alert('sdasa')
    location.href=$(this).attr('href')
    });*/
  $t3=$('#Touchable3').Hoverable({disableHover:true, logging:true});
  $t4=$('#Touchable4').Hoverable({disableHover:true});

  $t.newHover(function(e, touch){ //hoverIN
    $tooltip=$(this).find('.tooltip');
    $tooltip.show();
  }, function(e, touch){//hoverOut
    $tooltip=$(this).find('.tooltip');    
    $tooltip.hide();
  });
  $t2.newHover2(function(e, touch){ //hoverIN
    $tooltip=$(this).find('.tooltip');    
    $tooltip.show();
  }, function(e, touch){//hoverOut
    $tooltip=$(this).find('.tooltip');    
    $tooltip.hide();
  });
  $t3.newHover(function(e, touch){ //hoverIN
    $tooltip=$(this).find('.tooltip');
    $tooltip.show();
  }, function(e, touch){//hoverOut
    $tooltip=$(this).find('.tooltip');    
    $tooltip.hide();
  });
  $t4.newHover2(function(e, touch){ //hoverIN
    $tooltip=$(this).find('.tooltip');    
    $tooltip.show();
  }, function(e, touch){//hoverOut
    $tooltip=$(this).find('.tooltip');    
    $tooltip.hide();
  });  
})