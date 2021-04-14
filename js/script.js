const database = firebase.database();
const data = database.ref('Data')
let APIKey = database.ref('/Data/APIKey/value')
const currentDate = new Date()
let PrevRef = database.ref('/Data/PrevRef/value')
const Parent = document.querySelector('.InstaPosts')
const PostTemplate = document.querySelector('.Instagram-DisplayCard-Template')

function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}


let APISuccessCallback = (Data) =>{
	APIKey = Data.val()
	console.log(Data.val())
}

let APIRefSuccessCallback = (Data) =>{
	APIKey = Data.val()
	//data.child('APIKey').set({"value":APIKey})
}

let DateRefSuccessCallback = (Data) => {
	PrevRef = Data.val()
	Final()
}

let APIErrorCallback = (Data) =>{
	console.log("ERROR!!!" , Data)
}

let DateSuccessCallback = (Data) =>{
	PrevRef = new Date(Data.val().split("-")[0], Data.val().split("-")[1], Data.val().split("-")[2].split('T')[0], Data.val().split("-")[2].split("T")[1].split(":")[0], Data.val().split("-")[2].split("T")[1].split(":")[1], Data.val().split("-")[2].split("T")[1].split(":")[2].split("Z")[0])
	ChkApiRefTimeOut()
}

let DateErrorCallback = (Data) =>{
	console.log("ERROR!!!" , Data)
}

APIKey.on('value', APISuccessCallback, APIErrorCallback)
PrevRef.on('value', DateSuccessCallback, DateErrorCallback)

let ChkApiRefTimeOut = () =>{
	const diffTime = Math.abs(PrevRef - currentDate);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if(diffDays>=58){
		console.log("foo")
		makeRequest("GET", "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=IGQVJVV184YlVuaWxrcVJ1Y29xZAlk4VWZAlNW1EYlY0eWNEcVlEaFE5ZAXJhSjhKSV9sX09SYmtWaXJobzdvV081aWk2ZAVg2Q0J3cjV2UW9BVkdRN1VIbG4xSWl3clVrV1M4RlIwZAU1B").then((value)=>{
			database.ref("/Data/APIKey").update({ value: JSON.parse(value)["access_token"] });
			APIKey = database.ref('/Data/APIKey/value')
			APIKey.on('value', APIRefSuccessCallback, APIErrorCallback)
			//Now for promises
			//
			database.ref("/Data/PrevRef").update({ value: currentDate });
			PrevRef = database.ref('/Data/PrevRef/value')
			PrevRef.on('value', DateRefSuccessCallback, DateErrorCallback)
		})
	}
	Final()
}

let Final = () =>{
	makeRequest("GET", "https://graph.instagram.com/me/media?fields=id,caption,media_url&access_token="+APIKey).then((value)=>{//,media_type,media_url
		value = JSON.parse(value)['data']
		value.forEach((elem)=>{
			let Post = PostTemplate.content.cloneNode(true)
			console.log(Post.childNodes)
			console.log(Post.getElementById('picture'))
			Post.getElementById('picture').src = elem['media_url']
			Post.getElementById('picture').title = elem['caption']
			Post.querySelector('.caption').innerText = elem['caption']
			Parent.append(Post)
		})
	})
}