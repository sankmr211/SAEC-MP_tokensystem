let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem("clientuser") == null) {
        window.location.replace("../tokenlogin.html");
    }else{
        toastr.success('User login successfully ')
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
    fetchbooking(storedNames)
});


function fetchbooking(storedNames){
    let url = `${serverurl}/token/booking/fetch?user_uid=`+storedNames.user_uid
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


function logout() {
    localStorage.removeItem("clientuser");
    window.location.replace("../tokenlogin.html");
}