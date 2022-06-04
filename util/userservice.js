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


   
    fetchdepartment()
    fetchusers()
    
});

function logout() {
    localStorage.removeItem("adminuser");
    window.location.replace("../tokenlogin.html");
}


function GetSelectedTextValue(opt) {
    var selectedValue = opt.value;
    if (selectedValue == 'client') {
        document.querySelector("#departmentfield").hidden = true;
        document.querySelector("#add-user-department").value = 'null';
        document.querySelector("#update-user-department").value = 'null';
    } else if (selectedValue == 'officer') {
        document.querySelector("#departmentfield").hidden = false;
    }
}


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
            $('#add-user-department').append(departmentselect)
            $('#update-user-department').append(departmentselect)
        })
        .catch(function (error) {
            console.log(error);
        })
}

//fetch user
function fetchusers() {
    let url = `${serverurl}/token/user/fetch`
    let userclient = ''
    let userofficer = ''
    let userclientcount = 0
    let userofficercount = 0
    axios.get(url)
        .then(function (response) {
            if (response.status == 200) {
                for (const userdata of response.data.data) {
                    if (userdata.user_type == 'client') {
                        userclientcount++
                        userclient += `
                        <tr>
                        <td hidden>${userdata._id + '_' + userdata.user_uid}</td>
                        <td>${userdata.name}</td>
                        <td>${userdata.email_id}</td>
                        <td>${userdata.mobile_no}</td>
                        <td>${userdata.activate_status}</td>
                        <td><a href="#" ><i class="far fa-edit updateuser"></i></a> 
                        <a href="#"><i class="ml-2 far fa-trash-alt text-danger deleteuser"></i></a>
                        </td>
                      </tr>
                          `
                        document.querySelector('#client-table-body').innerHTML = userclient
                    } else if (userdata.user_type == 'officer') {
                        userofficercount++
                        let departname = departmentdata.find((elm) => elm.department_uid == userdata.department_uid)
                        userofficer += `
                        <tr>
                        <td hidden>${userdata._id + '_' + userdata.user_uid}</td>
                        <td>${userdata.name}</td>
                        <td>${userdata.email_id}</td>
                        <td>${userdata.mobile_no}</td>
                                <td>${departname.department_name}</td>
                                <td>${userdata.activate_status}</td>
                                <td><a href="#" ><i class="far fa-edit updateuser"></i></a> 
                                <a href="#"><i class="ml-2 far fa-trash-alt text-danger deleteuser"></i></a>
                                </td>
                        </tr>`
                        document.querySelector('#officer-table-body').innerHTML = userofficer
                    }
                }
                if (userclientcount == 0) {
                    userclient += `
            <tr class="no-data">
                    <td colspan="14" class="text-center">No data available</td>
                </tr>`
                    document.querySelector('#client-table-body').innerHTML = userclient
                } else if (userofficercount == 0) {
                    userofficer += `
                    <tr class="no-data">
                            <td colspan="14" class="text-center">No data available</td>
                        </tr>`
                    document.querySelector('#officer-table-body').innerHTML = userofficer

                }
            } else if (response.status == 204) {
                userofficer += `
                <tr class="no-data">
                        <td colspan="14" class="text-center">No data available</td>
                    </tr>`
                userclient += `
                <tr class="no-data">
                        <td colspan="14" class="text-center">No data available</td>
                    </tr>`
                document.querySelector('#officer-table-body').innerHTML = userofficer
                document.querySelector('#client-table-body').innerHTML = userclient
            }

        })
        .catch(function (error) {
            console.log(error);
        })
}


//create user
let adduserform = document.querySelector("#add-user-form")
adduserform.addEventListener('submit', (e) => {

    e.preventDefault();
    $('#adduser').modal('hide')
    let userdata
    if (document.querySelector("#add-user-type").value == "officer" && document.querySelector("#add-user-department").value !== "null") {
        userdata = {
            name: document.querySelector("#add-user-name").value,
            password: document.querySelector("#add-user-password").value,
            user_type: document.querySelector("#add-user-type").value,
            mobile_no: document.querySelector("#add-user-mobilenum").value,
            email_id: document.querySelector("#add-user-emailid").value,
            department_uid: document.querySelector("#add-user-department").value,
        }
    } else if (document.querySelector("#add-user-type").value == "client" && document.querySelector("#add-user-department").value == "null") {
        userdata = {
            name: document.querySelector("#add-user-name").value,
            password: document.querySelector("#add-user-password").value,
            user_type: document.querySelector("#add-user-type").value,
            mobile_no: document.querySelector("#add-user-mobilenum").value,
            email_id: document.querySelector("#add-user-emailid").value,
        }

    }

    let url = `${serverurl}/token/user/create`
    axios.post(url, userdata)
        .then((res) => {
            console.log(res.data);
            fetchusers();
        })
        .catch((err) => {
            console.log(res);
        })
    formclear()


})

//clear createmodel
function formclear() {
    document.querySelector("#add-user-name").value = ""
    document.querySelector("#add-user-password").value = ""
    document.querySelector("#add-user-type").value = ""
    document.querySelector("#add-user-mobilenum").value = ""
    document.querySelector("#add-user-emailid").value = ""
    document.querySelector("#add-user-department").value = "null"
}

let tabledataclient = document.querySelector('#client-table-body')
tabledataclient.addEventListener('click', (e) => {
    let targetelm = e.target;
    if (targetelm.classList.contains('updateuser')) {
        let uptuser = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/user/fetch?_id=` + uptuser[0]
        axios.get(url)
            .then((res) => {
                data = res.data.data[0]
                showupdatemodel(data);
            })
            .catch((err) => {
                console.log(res);
            })
    }
    if (targetelm.classList.contains('deleteuser')) {
        let deluser = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/user/delete/` + deluser[0]
        axios.delete(url)
            .then((res) => {
                console.log(res.data);
                fetchusers()
            })
            .catch((err) => {
                console.log(res);
            })
    }
})


let tabledataofficer = document.querySelector('#officer-table-body')
tabledataofficer.addEventListener('click', (e) => {
    let targetelm = e.target;
    if (targetelm.classList.contains('updateuser')) {
        let uptuser = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/user/fetch?_id=` + uptuser[0]
        axios.get(url)
            .then((res) => {
                data = res.data.data[0]
                showupdatemodel(data);
            })
            .catch((err) => {
                console.log(res);
            })
    }
    if (targetelm.classList.contains('deleteuser')) {
        let deluser = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/user/delete/` + deluser[0]
        axios.delete(url)
            .then((res) => {
                console.log(res.data);
                fetchusers()
            })
            .catch((err) => {
                console.log(res);
            })
    }
})

function showupdatemodel(data) {

    if (data.user_type == 'client') {
        document.querySelector("#departmentfield").hidden = true;
        document.querySelector('#update-user-department').value = "null"
        document.querySelector("#updatedepartmentfield").hidden = true;
    }
    if (data.user_type == 'officer') {
        document.querySelector("#departmentfield").hidden = false;
        document.querySelector('#update-user-department').value = data.department_uid;
        document.querySelector("#updatedepartmentfield").hidden = false;
    }
    document.querySelector("#update-user-id").value = data.user_uid
    document.querySelector('#update-user-name').value = data.name
    document.querySelector('#update-user-type').disabled = true;
    document.querySelector('#update-user-type').value = data.user_type
    document.querySelector('#update-user-mobilenum').value = data.mobile_no
    document.querySelector('#update-user-emailid').value = data.email_id
    document.querySelector('#update-user-password').value = data.password
    $('#updateuser').modal('show')
}

let updateform = document.querySelector('#update-user-form')
updateform.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#updateuser').modal('hide')
    let userupdatedata
    if (document.querySelector('#update-user-type').value == 'client') {
        userupdatedata = {
            name: document.querySelector('#update-user-name').value,
            password: document.querySelector('#update-user-password').value,
            mobile_no: document.querySelector('#update-user-mobilenum').value,
            email_id: document.querySelector('#update-user-emailid').value,
        }
    } else if (document.querySelector('#update-user-type').value == 'officer') {
        userupdatedata = {
            name: document.querySelector('#update-user-name').value,
            password: document.querySelector('#update-user-password').value,
            department_uid: document.querySelector('#update-user-department').value,
            mobile_no: document.querySelector('#update-user-mobilenum').value,
            email_id: document.querySelector('#update-user-emailid').value,
        }
    }

    let url = `${serverurl}/token/user/update/` + document.querySelector('#update-user-id').value
    axios.put(url, userupdatedata)
        .then((res) => {
            console.log(res.data);
            fetchusers()
        })
        .catch((err) => {
            console.log(res);
        })
})





