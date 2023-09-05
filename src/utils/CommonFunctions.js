const CommonFunctions = {
  getWebApiUrl()
  {
      const baseUrl=window.location.origin;
      //alert(baseUrl);
      if(baseUrl.indexOf(":")!==-1)
        return process.env.REACT_APP_WSurl;
      else
        return baseUrl+process.env.REACT_APP_WSurl;
  },
  truncateNumber(number,digits) {
    return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits)
   },

    SetFlagColor(flagcode,flaglist){  
      for(var i=0; i<flaglist.length;i++){      
        if(flaglist[i].id ===flagcode){   
          return flaglist[i].colorCode
        }      
      }
    },
}


export default CommonFunctions;
