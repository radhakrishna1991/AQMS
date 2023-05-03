import React, { useCallback, useEffect, useState, useRef } from "react";

function AirQuality(){

    useEffect(() => {
       window.jQuery("#airquality").load("AirQuality.html");  
      /*  document.getElementById("airquality").innerHTML='<object type="text/html" data="AirQuality.html" ></object>'; */
      },[]);
    return(
<main id="main" className="main" >
<section id="airquality">

</section>
</main>
 );
}
export default AirQuality;