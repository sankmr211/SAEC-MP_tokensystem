let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem("clientuser") == null) {
        window.location.replace("../tokenlogin.html");
    }else{
        var storedNames = JSON.parse(localStorage.getItem("clientuser"));
        document.getElementById("username").innerText = storedNames.name
        document.getElementById("username1").innerText = storedNames.name + "(" + storedNames.user_type + ")"
        document.getElementById("emailid").innerText = storedNames.email_id
        document.getElementById("mobno").innerText = storedNames.mobile_no
    }
     if (storedNames.user_type == "officer") {
        window.location.replace("../tokenoffindex.html");
    } else if (storedNames.user_type == "admin") {
        window.location.replace("../index.html");
    }
    fetchschdule()
});

function logout() {
    localStorage.removeItem("clientuser");
    window.location.replace("../tokenlogin.html");
}


//fetch
let schduledata=[]
function fetchschdule() {
    let url = `${serverurl}/token/schduletoken/fetch`
    let getschedule = ''
    axios.get(url)
        .then(function (res) {
            if (res.status == 200 && res.data.statusCode != 204 ) {
                for (const data of res.data.data) {
                    schduledata.push(data)
                    let starttime = moment(data.Start_time).format("DD/MM/YYYY LT")
                    let endtime = moment(data.End_time).format("DD/MM/YYYY LT")
                  
                    getschedule += `
                    <option value="${data.schdule_uid}">${data.name +"("+starttime +"-"+endtime+")" }</option>`
                }
                $('#get-schdule').append(getschedule)
            } else if (res.data.statusCode = 204) {
                getschedule += ` <option value="">No Data</option>`
                  $('#get-schdule').append(getschedule)
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}



function getschdle(opt){
    let url = `${serverurl}/token/live/fetch?schdule_uid=`+opt.value
    axios.get(url)
    .then(function (res) {
        
    }).catch((err)=>{
        console.log(err);
    })
}
