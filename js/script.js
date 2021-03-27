function reqListener () {
  console.log(this.responseText);
}

const database = firebase.database();
const apikey = database.ref('API key')
const prev = database.ref('Previous Refresh')
const currentDate = new Date()

console.log(apikey, prev)

const diffTime = Math.abs(prev - currentDate);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "https://graph.instagram.com/me?fields=id,media_type,media_url&access_token=IGQVJVV184YlVuaWxrcVJ1Y29xZAlk4VWZAlNW1EYlY0eWNEcVlEaFE5ZAXJhSjhKSV9sX09SYmtWaXJobzdvV081aWk2ZAVg2Q0J3cjV2UW9BVkdRN1VIbG4xSWl3clVrV1M4RlIwZAU1B");
oReq.send()
