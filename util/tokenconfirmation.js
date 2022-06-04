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


    fetchuser()
    fetchdepartment()
});


//fetch users
let users = []
function fetchuser() {
    let url = `${serverurl}/token/user/fetch`
    axios.get(url)
        .then(function (response) {
            users.push(response.data.data)
        })
        .catch(function (error) {
            console.log(error);
        })
}

function logout() {
    localStorage.removeItem("adminuser");
    window.location.replace("../tokenlogin.html");
}


let statusdispo = ["complete", "pending", "failure", "approval"]
function fetchdepartment() {
    let url = `${serverurl}/token/depart/fetch`
    let departmentselect = ''
    axios.get(url)
        .then(function (response) {
            for (const depart of response.data.data) {
                departmentselect += `
                <option value="${depart.department_uid}">${depart.name}</option>`
            }
            $('#get-department-book').append(departmentselect)
        })
        .catch(function (error) {
            console.log(error);
        })
}

let depart_id = ''
function departpartbookfetch(opt) {
    let selectdepart = opt.value
    getconfirmation(selectdepart)
    depart_id = selectdepart

}


function getconfirmation(selectdepart) {
    if (selectdepart != "") {
        let bookdepartval = ''
        let url = `${serverurl}/token/booking/fetch?department_uid=` + selectdepart
        axios.get(url)
            .then(function (response) {
                console.log(response);
    
                if (response.data.statusCode == 200) {
                    let count = 1
                    for (const data of response.data.data) {
                        let starttime = moment(data.schedule_starttime).format("DD/MM/YYYY LT")
                        let endtime = moment(data.schedule_endtime).format("DD/MM/YYYY LT")
                        bookdepartval += `
                            <tr>
                            <td hidden>${data.token_no}</td>
                            <td >${count}</td>
                            <td>${data.token_no}</td>
                            <td>${data.schdule_name}</td>
                            <td>${users[0].find(elm=> elm.user_uid==data.officer_uid).name}</td>
                            <td>${users[0].find(elm=> elm.user_uid==data.user_uid).name}</td>
                            <td>${"mobile"}</td>
                            <td>${starttime + "  -  " + endtime}</td> <td> <select class="form-control update" id="change-status" onchange="tokenstatus(this)">`
    
                        for (const data1 of statusdispo) {
                            if (data.status == data1) {
                                bookdepartval += `<option value="${data1 + "_" + data.token_no}" selected>${data.status}</option>`
                            } else {
                                bookdepartval += `<option value="${data1 + "_" + data.token_no}">${data1}</option>`
                            }
                        }
                        bookdepartval += `</select></td>`
                        document.querySelector('#confirmation-token-table').innerHTML = bookdepartval
                        count++
                    }
                } else if (response.status == 204) {
                    bookdepartval += `
                    <tr class="no-data">
                            <td colspan="14" class="text-center">No data available</td>
                        </tr>`
                    document.querySelector('#confirmation-token-table').innerHTML = bookdepartval
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    } else {
        document.querySelector('#confirmation-token-table').innerHTML = ` <tr class="no-data">
                    <td colspan="14" class="text-center">No data available</td>
                </tr>`
    }
}

function tokenstatus(opt) {
    let [sts, token] = opt.value.split('_')
    let url = `${serverurl}/token/booking/update/` + token
    let updatedata = {
        status: sts
    }
    axios.put(url, updatedata)
        .then((res) => {
            console.log(res.data);
            getconfirmation(depart_id)
        })
        .catch((err) => {
            console.log(res);
        })
}