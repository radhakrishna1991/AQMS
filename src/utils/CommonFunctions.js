import { React } from "react";

const CommonFunctions = {
  
   
  truncateNumber(number,digits) {
        
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = number.toString().match(re);
    return m ? parseFloat(m[1]) : number.valueOf();

    //return with2Decimals = value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
 
     },

     
}


export default CommonFunctions;
