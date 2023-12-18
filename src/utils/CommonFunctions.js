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
    async  getAuthHeader()
    {
      const token = sessionStorage.getItem('Token');
      const tokenExpTime=sessionStorage.getItem('TokenExpTime');
      const userData=sessionStorage.getItem("UserData");
      var newdate=new Date(tokenExpTime);
      var currentDate=new Date();      
      //console.log("currentDate",currentDate);
      //console.log("exp date",tokenExpTime);
      if(currentDate >= newdate)
      {
        try {
          const response = await fetch(CommonFunctions.getWebApiUrl() + "Token", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: userData,
          });
         
          if (response.ok) {
            const responseJson = await response.json();
            if (responseJson.token) {
              console.log(responseJson);
              sessionStorage.setItem('Token', responseJson.token);
    
              const expirationTime = new Date();
              expirationTime.setMinutes(expirationTime.getMinutes() + responseJson.tokenExpirationTime);
              sessionStorage.setItem('TokenExpTime', expirationTime);
    
              return { Authorization: 'Bearer ' + responseJson.token, 'app-origin': 'http://localhost:3000' };
            }
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      
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
