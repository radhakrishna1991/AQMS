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
    getAuthHeader()
    {
      const token = sessionStorage.getItem('Token');
     // const LoggedInTime = sessionStorage.getItem('LoggedInTime');
      const tokenExpTime=sessionStorage.getItem('TokenExpTime');
      var newdate=new Date(tokenExpTime);

     // var expTime=LoggedInTime.set
      var currentDate=new Date();
      console.log("currentDate",currentDate);
      console.log("exp date",tokenExpTime);
      if(currentDate > newdate)
      {
        fetch(CommonFunctions.getWebApiUrl() + "Token", {
          method: 'POST',
        }).then((response) => response.json())
        .then((responseJson) => {
          if (responseJson) {
            console.log(responseJson);
            sessionStorage.setItem("Token",responseJson.token);
            var currentDate=new Date();
            currentDate.setMinutes(currentDate.getMinutes()+responseJson.tokenExpirationTime);            
            sessionStorage.setItem("TokenExpTime",currentDate);
            console.log(responseJson.token);
            return { Authorization: 'Bearer ' +responseJson.token ,'app-origin': 'http://localhost:3000'};
          }
        })
      
      }
      else{
        if (token) {
          return { Authorization: 'Bearer ' +token ,'app-origin': 'http://localhost:3000'};
        } else {
          return {};
        }
      }


     //alert(LoggedInTime);
    // alert(tokenExpTime);


     
    }
}


export default CommonFunctions;
