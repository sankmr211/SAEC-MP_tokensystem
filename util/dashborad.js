let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    var storedNames = JSON.parse(localStorage.getItem("adminuser"));
    if(localStorage.getItem("adminuser")==null){
        window.location.replace("../tokenlogin.html");
    }
    if(storedNames.user_type=="admin"){
        console.log("ssssssssss");
        toastr.success('User login successfully ')
    }else if(storedNames.user_type=="officer"){
        window.location.replace("../tokenoffindex.html");
    }else if(storedNames.user_type=="client"){
        window.location.replace("../tokenclientindex.html");
    }
    

    document.getElementById("username").innerText = storedNames.name
    document.getElementById("username1").innerText = storedNames.name+"("+storedNames.user_type+")"
    document.getElementById("emailid").innerText = storedNames.email_id
    document.getElementById("mobno").innerText = storedNames.mobile_no
    
    fetchdepartment()
    fetchbooking()
    fetchusers()
    fetchschedule()

    
    
  
});

function logout() {
    localStorage.removeItem("adminuser");
    window.location.replace("../tokenlogin.html");
}



//fetch department
function fetchdepartment() {
    let url = `${serverurl}/token/depart/fetch`
    axios.get(url)
        .then(function (response) {
        let fetchdepart=response.data.data
        document.querySelector('#departid').innerHTML= fetchdepart.length
        })
        .catch(function (error) {
            console.log(error);
        })
}


function fetchbooking(){
    let url = `${serverurl}/token/booking/fetch`
    axios.get(url)
        .then(function (response) {
        let fetchbook=response.data.data
        document.querySelector('#bookid').innerHTML= fetchbook.length
        })
        .catch(function (error) {
            console.log(error);
        })
}


function fetchusers(){
    let url = `${serverurl}/token/user/fetch`
    axios.get(url)
        .then(function (response) {
        let fchuser=response.data.data
        document.querySelector('#userid').innerHTML= fchuser.length-1
        })
        .catch(function (error) {
            console.log(error);
        })
}

function fetchschedule() {
    let url = `${serverurl}/token/schduletoken/fetch`
    axios.get(url)
        .then(function (response) {
        let schl=response.data.data
        document.querySelector('#schlid').innerHTML= schl.length
        })
        .catch(function (error) {
            console.log(error);
        })
}





