import axios from "axios"
import { checkAuth, logOut } from "../components/authentication";
import { isLogin } from "../components/navigation-estimates";
import { fetchFavourites, fetchOwnCalls } from "../components/productInfo/productInfo";
import { toggleMenuAuth } from "../components/sandwichmenu";
import { data } from "../data/data";
import { getToken } from "../utils/getToken"

export const getUserInfo = () => {    
    axios.defaults.headers.common['Authorization'] = getToken();
    axios.get('https://callboard-backend.herokuapp.com/user').then(response => data.user = {...data.user, ...response.data}).then(()=> console.log(data))
}
export const refreshAuth = () => {
    axios.defaults.headers.common['Authorization'] = data.auth.accessToken;
    console.log(data.auth.sid);
    axios.post('https://callboard-backend.herokuapp.com/auth/refresh', {
        sid: data.auth.sid
      }).then(response => {
          data.auth.sid = response.data.newSid;
        data.auth.accessToken = response.data.newAccessToken;
        data.auth.refreshToken = response.data.newRefreshToken;
        data.auth.token = response.data.newAccessToken;
        // localStorage.setItem('accessToken', response.data.newAccessToken)
        console.log(data.auth);
    })
}
export const isActualToken = async () => {    
        axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('accessToken'));
    
        await axios.get('https://callboard-backend.herokuapp.com/user').then(response => data.user = {...data.user, ...response.data}).catch(()=> console.log('unauthorized'))
    
      if (data.user.sid) {
///////// !!!!!!!!!!! error!!!!!!!!!!!!!!!!

        // await refreshAuth();
        setInterval(()=>{refreshAuth()}, 5000);
        await checkAuth();
  if (data.auth.isAuth === true) {
    await fetchFavourites();
    await fetchOwnCalls();
  }   
      } else {
        isLogin();
        toggleMenuAuth('menuPane');
      }
       
   
}
// {data.auth.sid = response.data.newSid}
// newAccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmRkMzdhZTczOWMzNTAwMTc1YTE4NTciLCJzaWQiOiI1ZmY0MjVjNTE2NzI2ZDAwMTdmNjA4NTgiLCJpYXQiOjE2MDk4MzU5NzMsImV4cCI6MTYwOTgzOTU3M30.q8ZO8aR973_jcrusy0Xq97tQG9QaYl1lR4aAMql7d0c"
// newRefreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmRkMzdhZTczOWMzNTAwMTc1YTE4NTciLCJzaWQiOiI1ZmY0MjVjNTE2NzI2ZDAwMTdmNjA4NTgiLCJpYXQiOjE2MDk4MzU5NzMsImV4cCI6MTYxMjQ2Mzk3M30.NuQ9ufemuNp8fjvDsN8aobNHfZY7Ys9Y3HENfwnVHTw"
// newSid: "5ff425c516726d0017f60858"