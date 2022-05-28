let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    fetchuser()
    fetchdepartment()
    fetchschdule()

});

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
            $('#add-tokenschdule-department').append(departmentselect)
            $('#update-tokenschdule-department').append(departmentselect)
        })
        .catch(function (error) {
            console.log(error);
        })
}

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

//department user
function getofficer(opt) {
    var selectedValue = opt.value;
    if (selectedValue == '') {
        document.querySelector("#add-tokenschdule-officer").value = '';
    }
    let officer = ''
    let url = `${serverurl}/token/user/fetch`
    axios.get(url)
        .then(function (response) {
            if (response.status == 200) {
                let officerdata = response.data.data.filter(elm => elm.department_uid == selectedValue)
                if (officerdata.length > 0) {
                    for (let i = 0; i < officerdata.length; i++) {
                        if (i == 0) {
                            officer += `
                <option value="">Select</option>
                <option value="${officerdata[i].user_uid}">${officerdata[i].name}</option> `
                        }
                        else {
                            officer += `
                            <option value="${officerdata[i].user_uid}">${officerdata[i].name}</option>
                            `
                        }

                    }
                    document.querySelector('#add-tokenschdule-officer').innerHTML = officer
                } else {
                    document.querySelector('#add-tokenschdule-officer').innerHTML = `<option value="">No Data</option>`
                }

            } else if (response.status == 204) {
                document.querySelector('#add-tokenschdule-officer').innerHTML = `<option value="">No Data</option>`
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}


//create schdule
let addschduleform = document.querySelector("#add-tokenschdule-form")
addschduleform.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#createtokenschdulemodal').modal('hide')
    let starttime = moment(document.querySelector("#add-tokenschdule-start").value).format("YYYY-MM-DD[T]HH:mm:ss") + '.000Z'
    let endtime = moment(document.querySelector("#add-tokenschdule-end").value).format("YYYY-MM-DD[T]HH:mm:ss") + '.000Z'
    console.log(document.querySelector("#add-tokenschdule-end").value);
    console.log(starttime);
    userdata = {
        name: document.querySelector("#add-tokenschdule-name").value,
        user_uid: document.querySelector("#add-tokenschdule-officer").value,
        department_uid: document.querySelector("#add-tokenschdule-department").value,
        Start_time: starttime,
        End_time: endtime,
        count: document.querySelector("#add-tokenschdule-count").value,
        active: document.querySelector("#add-tokenschdule-status").value
    }
    let url = `${serverurl}/token/schduletoken/create`
    axios.post(url, userdata)
        .then((res) => {
            console.log(res.data);
            fetchschdule()
        })
        .catch((err) => {
            console.log(res);
        })
    formclear()
})

//clear createmodel
function formclear() {
    document.querySelector("#add-tokenschdule-name").value = ""
    document.querySelector("#add-tokenschdule-department").value = ""
    document.querySelector("#add-tokenschdule-officer").value = ""
    document.querySelector("#add-tokenschdule-start").value = ""
    document.querySelector("#add-tokenschdule-end").value = ""
    document.querySelector("#add-tokenschdule-count").value = ""
    document.querySelector("#add-tokenschdule-status").value = ""
}

//fetch
function fetchschdule() {
    let url = `${serverurl}/token/schduletoken/fetch`
    let fetchtokensetup = ''
    axios.get(url)
        .then(function (res) {
            if (res.status == 200 && res.data.statusCode != 204 ) {
                for (const data of res.data.data) {
                    let starttime = moment(data.Start_time).format("DD/MM/YYYY LT")
                    let endtime = moment(data.End_time).format("DD/MM/YYYY LT")
                    fetchtokensetup += `
                    <tr>
                     <td hidden>${data._id + '_' + data.user_uid}</td>
                    <td>${data.name}</td>
                    <td>${users[0].find(elm=> elm.user_uid==data.user_uid).name}</td>
                    <td>${departmentdata.find(elm=> elm.department_uid==data.department_uid).department_name}</td>
                    <td>${starttime}</td>
                    <td>${endtime}</td>
                    <td>${data.count}</td>
                    <td>${data.active}</td>
                    <td><a href="#" ><i class="far fa-edit updateuser"></i></a> 
                    <a href="#"><i class="ml-2 far fa-trash-alt text-danger deleteuser"></i></a>
                    </td>
                  </tr>
                      `
                    document.querySelector('#tokenschdule-table-body').innerHTML = fetchtokensetup
                }
            } else if (res.data.statusCode = 204) {
                fetchtokensetup += `
            <tr class="no-data">
                    <td colspan="14" class="text-center">No data available</td>
                </tr>`
                document.querySelector('#tokenschdule-table-body').innerHTML = fetchtokensetup
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}


let tabledataclient = document.querySelector('#tokenschdule-table-body')
tabledataclient.addEventListener('click', (e) => {
    let targetelm = e.target;
    if (targetelm.classList.contains('updateuser')) {
        let uptschl = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/schduletoken/fetch?_id=` + uptschl[0]
        axios.get(url)
            .then((res) => {
                data = res.data.data[0]
                updatemodal(data)
                showupdatemodel(data);

            })
            .catch((err) => {
                console.log(err);
            })
    }
    if (targetelm.classList.contains('deleteuser')) {
        let delschl = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/schduletoken/` + delschl[0]
        axios.delete(url)
            .then((res) => {
                console.log(res.data);
                fetchschdule()
            })
            .catch((err) => {
                console.log(err);
            })
    }
})

//load officer modal
let updateofficerdata = ''
function updatemodal(data) {
    let selecteddepartment = users[0].filter(elm => elm.department_uid == data.department_uid)
    if (selecteddepartment.length > 0) {
        for (let i = 0; i < selecteddepartment.length; i++) {
            if (i == 0) {
                updateofficerdata += `
    <option value="">Select</option>
    <option value="${selecteddepartment[i].user_uid}">${selecteddepartment[i].name}</option> `
            }
            else {
                updateofficerdata += `
                <option value="${selecteddepartment[i].user_uid}">${selecteddepartment[i].name}</option>
                `
            }

        }
        document.querySelector('#update-tokenschdule-officer').innerHTML = updateofficerdata
    } else {
        updateofficerdata = ''
        document.querySelector('#update-tokenschdule-officer').innerHTML = `<option value="">No Data</option>`
    }
}

function showupdatemodel(data) {
    let starttime = moment(data.Start_time).format("MM/DD/YYYY LT")
    let endtime = moment(data.End_time).format("MM/DD/YYYY LT")
    document.querySelector("#update-tokenschdule-id").value = data._id
    document.querySelector("#update-tokenschdule-name").value = data.name
    document.querySelector('#update-tokenschdule-department').value = data.department_uid
    document.querySelector('#update-tokenschdule-officer').value = data.user_uid
    document.querySelector('#update-tokenschdule-start').value = starttime
    document.querySelector('#update-tokenschdule-end').value = endtime
    document.querySelector('#update-tokenschdule-count').value = data.count
    document.querySelector('#update-tokenschdule-status').value = data.active
    $('#updatetokenschduleModal').modal('show')
}


//getdepartment officer
function updateofficer(opt) {
    var selectedValue = opt.value;
    if (selectedValue == '') {
        updateofficerdata = '<option value="" selected>Select</option>'
        document.querySelector("#update-tokenschdule-officer").value = '';
        updatemodal({ department_uid: '' })
    } else {
        updatemodal({ department_uid: `${selectedValue}` })
    }

}



let updateschedule = document.querySelector('#update-tokenschdule-form');
updateschedule.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#updatetokenschduleModal').modal('hide')
    let starttime = moment(document.querySelector('#update-tokenschdule-start').value).format("YYYY-MM-DD[T]HH:mm:ss") + '.000Z'
    let endtime = moment(document.querySelector('#update-tokenschdule-end').value).format("YYYY-MM-DD[T]HH:mm:ss") + '.000Z'
    let userupdatedata = {
        name: document.querySelector('#update-tokenschdule-name').value,
        user_uid: document.querySelector('#update-tokenschdule-officer').value,
        department_uid: document.querySelector('#update-tokenschdule-department').value,
        Start_time: starttime,
        End_time: endtime,
        count: document.querySelector('#update-tokenschdule-count').value,
        remaining_count: document.querySelector('#update-tokenschdule-count').value,
        active: document.querySelector('#update-tokenschdule-status').value
    }
    let url = `${serverurl}/token/schduletoken/update/` + document.querySelector('#update-tokenschdule-id').value
    axios.put(url, userupdatedata)
        .then((res) => {
            console.log(res.data);
            fetchschdule()
        })
        .catch((err) => {
            console.log(res);
        })
})







