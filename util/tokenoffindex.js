let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem("officeruser") == null) {
        window.location.replace("../tokenlogin.html");
    }else{
        toastr.success('User login successfully ')
        var storedNames = JSON.parse(localStorage.getItem("officeruser"));
        document.getElementById("username").innerText = storedNames.name
        document.getElementById("username1").innerText = storedNames.name + "(" + storedNames.user_type + ")"
        document.getElementById("emailid").innerText = storedNames.email_id
        document.getElementById("mobno").innerText = storedNames.mobile_no
    }
     if (storedNames.user_type == "client") {
        window.location.replace("../tokenclientlive.html");
    } else if (storedNames.user_type == "admin") {
        window.location.replace("../index.html");
    }
    fetchbooking(storedNames)
    fetchtran(storedNames)
});

function logout() {
    localStorage.removeItem("officeruser");
    window.location.replace("../tokenlogin.html");
}

function fetchbooking(storedNames){
    let url = `${serverurl}/token/booking/fetch?officer_uid=`+storedNames.user_uid
    axios.get(url)
        .then(function (response) {
        let fetchbook=response.data.data
        if(response.status==204){
            fetchbook=[]
           }
        document.querySelector('#bookid').innerHTML= fetchbook.length
        })
        .catch(function (error) {
            console.log(error);
        })
}

function fetchtran(storedNames){
    let url = `${serverurl}/token/tokentran/fetch?officer_uid=`+storedNames.user_uid
    axios.get(url)
        .then(function (response) {
        let fetchbook=response.data.data
        if(response.status==204){
            fetchbook=[]
           }
        document.querySelector('#usertran').innerHTML= fetchbook.length
        })
        .catch(function (error) {
            console.log(error);
        })
}