let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem("officeruser") == null) {
        window.location.replace("../tokenlogin.html");
    }else{
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
    officer_uid = storedNames.user_uid
    userdata()
    fetchtransaction(officer_uid)
    
});

function logout() {
    localStorage.removeItem("officeruser");
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


function fetchtransaction(officer_uid) {
    let url = `${serverurl}/token/tokentran/fetch?officer_uid=` + officer_uid
    let officertran = ''
    axios.get(url)
        .then(function (response) {
            console.log(response);
            if (response.data.statusCode == 200) {
                let count = 1;
                for (const data of response.data.data) {
                    let [start, end] = data.schdule_startend.split('_')
                    let startdatatime = moment(start).format("DD/MM/YYYY LT")
                    let enddatetime = moment(end).format("DD/MM/YYYY LT")
                    officertran += `
        <tr>
        <td>${count}</td>
        <td>${data.token_no}</td>
        <td>${data.schedulename}</td>
        <td>${userdetail.find(elm=>elm.user_uid==data.user_uid).name}</td>
        <td>${startdatatime + " - " + enddatetime}</td>
        <td>${moment(data.time).format("DD/MM/YYYY LT")}</td>
        <th>${data.status}</th>
        </tr>
      `
                    document.querySelector('#token-transaction').innerHTML = officertran
                }
            } else if (response.data.statusCode == 204) {
                officertran += `
                    <tr class="no-data">
                            <td colspan="14" class="text-center">No data available</td>
                        </tr>`
                document.querySelector('#token-transaction').innerHTML = officertran
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}

