let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    var storedNames = JSON.parse(localStorage.getItem("adminuser"));
    if (localStorage.getItem("adminuser") == null) {
        window.location.replace("../tokenlogin.html");
    }
    if (storedNames.user_type == "officer") {
        window.location.replace("../tokenoffindex.html");
    } else if (storedNames.user_type == "client") {
        window.location.replace("../tokenclientindex.html");
    }



    document.getElementById("username").innerText = storedNames.name
    document.getElementById("username1").innerText = storedNames.name + "(" + storedNames.user_type + ")"
    document.getElementById("emailid").innerText = storedNames.email_id
    document.getElementById("mobno").innerText = storedNames.mobile_no

    userdata()
    fetchtransaction()
    
    
});


function logout() {
    localStorage.removeItem("adminuser");
    window.location.replace("../tokenlogin.html");
}

let userdetail=[]
function userdata(){
    let url = `${serverurl}/token/user/fetch`
    axios.get(url)
    .then(function (response) {
        if (response.status == 200) {
            for (const data of response.data.data) {
                userdetail.push(data)
            }
        } else if (response.status == 204) {
           userdetail=[]
        }
    })
    .catch(function (error) {
        console.log(error);
    })
}
console.log(userdetail);

function fetchtransaction() {
    let url = `${serverurl}/token/tokentran/fetch`
    let usertran = ''
    axios.get(url)
        .then(function (response) {
            if (response.data.statusCode == 200) {
                let count = 1;
                for (const data of response.data.data) {
                    let [start, end] = data.schdule_startend.split('_')
                    let startdatatime = moment(start).format("DD/MM/YYYY LT")
                    let enddatetime = moment(end).format("DD/MM/YYYY LT")
                    usertran += `
        <tr>
        <td>${count}</td>
        <td>${data.token_no}</td>
        <td>${data.schedulename}</td>
        <td>${userdetail.find(elm=>elm.user_uid==data.user_uid).name}</td>
        <td>${userdetail.find(elm=>elm.user_uid==data.officer_uid).name}</td>
        <td>${startdatatime + " - " + enddatetime}</td>
        <td>${moment(data.time).format("DD/MM/YYYY LT")}</td>
        <th>${data.status}</th>
        </tr>
      `
                    document.querySelector('#token-transaction').innerHTML = usertran
                }
            } else if (response.data.statusCode == 204) {
                usertran += `
                    <tr class="no-data">
                            <td colspan="14" class="text-center">No data available</td>
                        </tr>`
                document.querySelector('#token-transaction').innerHTML = usertran
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}
