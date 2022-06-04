let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {

    userdata()
    fetchdepartment()
    fetchschdule()
    getbookingtable()
});


function logout() {
    localStorage.removeItem("clientuser");
    window.location.replace("../tokenlogin.html");
}

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


let user_id = storedNames.user_uid
//fetch department
let departmentdata = []
function fetchdepartment() {
    let url = `${serverurl}/token/depart/fetch`
    let departmentselect = ''
    axios.get(url)
        .then(function (response) {
            for (const depart of response.data.data) {
                departmentdata.push({
                    department_uid: depart.department_uid,
                    department_name: depart.name
                })
                departmentselect += `
                <option value="${depart.department_uid}">${depart.name}</option>`
            }
            $('#get-schedule-token').append(departmentselect)
        })
        .catch(function (error) {
            console.log(error);
        })
}

//getbookingtable
let bookingdata = []
function getbookingtable() {
    let url = `${serverurl}/token/booking/fetch`
    axios.get(url)
        .then(function (response) {
            if (response.data.statusCode == 200) {
                for (const data of response.data.data) {
                    bookingdata.push(data)
                }
            } else if (response.data.statusCode == 204) {
                bookingdata = []
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

//fetchschdule
let fetchschduledata = []
function fetchschdule() {
    let url = `${serverurl}/token/schduletoken/fetch`
    axios.get(url)
        .then(function (res) {
            if (res.status == 200 && res.data.statusCode != 204) {
                for (const data of res.data.data) {
                    fetchschduledata.push(data)
                }
            } else if (res.data.statusCode = 204) {
                fetchschduledata = []
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

// getdepartment choose department
function getschedule(opt) {
    bookingtable(opt.value)
}

// getbooking
function bookingtable(depart){
    let departfilter = fetchschduledata.filter(elm => elm.department_uid == depart)
    let schduledata = ''
    if (departfilter.length > 0) {
        let count = 1
        for (const data of departfilter) {         
            if (!bookingdata.find(elm => elm.user_uid == user_id && elm.schdule_uid ==data.schdule_uid)) {
                let starttime = moment(data.Start_time).format("DD/MM/YYYY LT")
                let endtime = moment(data.End_time).format("DD/MM/YYYY LT")
                schduledata += `
            <tr>
            <td hidden>${data.schdule_uid}</td>
            <td >${count}</td>
            <td>${data.name}</td>
            <td>${userdetail.find(elm=> elm.user_uid==data.user_uid).name}</td>
            <td>${starttime + "  -  " + endtime}</td>
            <td>${data.count}</td>
            <td>${data.remaining_count}</td>
            <td>${data.remaining_count == 0 ? '<a href="#" class="btn btn-primary disabled" tabindex="-1" aria-disabled="true" role="button" data-bs-toggle="button">No Book</a>' : '<a href="#" class="btn btn-primary confirmation" role="button" data-bs-toggle="button" >Book</a>'}</td>
          </tr>
              `
                document.querySelector('#Schdule-table').innerHTML = schduledata
            }
        }

    } else {
        schduledata += `
    <tr class="no-data">
            <td colspan="14" class="text-center">No data available</td>
        </tr>`
        document.querySelector('#Schdule-table').innerHTML = schduledata
    }
    let status = bookingdata.filter(elm => elm.department_uid == depart && elm.user_uid==user_id)
    let statusdata=''
    if(status.length>0){
        let count =1
        for (const data of status) {
                let starttime = moment(data.schedule_starttime).format("DD/MM/YYYY LT")
                let endtime = moment(data.schedule_endtime).format("DD/MM/YYYY LT")
                statusdata += `
            <tr>
            <td >${count}</td>
            <td>${data.token_no}</td>
            <td>${data.schdule_name}</td>
            <td>${userdetail.find(elm=> elm.user_uid===data.officer_uid).name}</td>
            <td>${starttime + "  -  " + endtime}</td>
            <td>${data.status}</td>
          </tr>
              `
            document.querySelector('#Status-table').innerHTML = statusdata
        }
    }else{
        statusdata +=`
        <tr class="no-data">
            <td colspan="14" class="text-center">No data available</td>
        </tr>`
        document.querySelector('#Status-table').innerHTML = statusdata
    }


}


//confirm
let confirmationbtn = document.querySelector('#Schdule-table')
confirmationbtn.addEventListener('click', (e) => {
    let targetelm = e.target
    if (targetelm.classList.contains('confirmation')) {
        let getschdlid = targetelm.parentElement.parentElement.firstElementChild.innerHTML
        let getschdldetail = fetchschduledata.find(elm => elm.schdule_uid == getschdlid)
        let payload = {
            schdule_name: getschdldetail.name,
            schdule_uid: getschdldetail.schdule_uid,
            user_uid: user_id,
            department_uid: getschdldetail.department_uid,
            officer_uid: getschdldetail.user_uid,
            schedule_starttime: getschdldetail.Start_time,
            schedule_endtime: getschdldetail.End_time
        }
        let url = `${serverurl}/token/booking/create`
        axios.post(url, payload)
            .then((res1) => {
                
                // console.log(res.data.token_no);
                // console.log(res.data.schdule_uid);
                let livepayload={
                    status:"A",
                    token_no:res1.data.create.token_no
                }
                console.log(res1.data.create);
                let urllive = `${serverurl}/token/live/update/` + res1.data.create.schdule_uid
                axios.put(urllive, livepayload)
                    .then((res) => {
                        location.reload();
                        bookingtable(res1.data.create.department_uid)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                
            })
            .catch((err) => {
                console.log(err);
            })
    }
})







