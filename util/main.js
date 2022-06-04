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




});


function logout() {
    localStorage.removeItem("adminuser");
    window.location.replace("../tokenlogin.html");
}

//fetch department
function fetchdepartment() {
    let url = `${serverurl}/token/depart/fetch`
    let departmentrow = ''
    axios.get(url)
        .then(function (response) {
            for (const depart of response.data.data) {
                departmentrow += `
        <tr>
        <td hidden>${depart._id + '_' + depart.department_uid}</td>
        <td>${depart.name}</td>
        <td>${depart.description}</td>
        <td>${depart.status}</td>
        <td>
        <a href="#"><i class="far fa-edit dpartupdate"></i></a> 
        <a href="#"><i class="ml-2 far fa-trash-alt text-danger dpartdelete"></i></a></td>
        </tr>
      `
                document.querySelector('#table-body').innerHTML = departmentrow
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

//create
let adddepartmentform = document.querySelector("#add-department-form");
adddepartmentform.addEventListener('submit', function (e) {
    e.preventDefault();
    $('#add-depart').modal('hide')
    let departmentdata = {
        name: document.querySelector('#add-department-name').value,
        description: document.querySelector('#add-department-description').value,
        status: document.querySelector('#add-department-status').value,
    }
    let url = `${serverurl}/token/depart/create`
    axios.post(url, departmentdata)
        .then((res) => {
            console.log(res.data);
            fetchdepartment();
        })
        .catch((err) => {
            console.log(res);
        })
    formclear()
})


//clear createmodel
function formclear() {
    document.querySelector('#add-department-name').value = ''
    document.querySelector('#add-department-description').value = ''
    document.querySelector('#add-department-status').value = ''
}


let tabledata = document.querySelector('#table-body')
tabledata.addEventListener('click', (e) => {
    let targetelm = e.target;
    if (targetelm.classList.contains('dpartupdate')) {
        let departupdt = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/depart/fetch?_id=` + departupdt[0]
        axios.get(url)
            .then((res) => {
                data = res.data.data[0]
                showupdatemodel(data);
            })
            .catch((err) => {
                console.log(res);
            })
    }
    if (targetelm.classList.contains('dpartdelete')) {
        let departdel = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML.split('_')
        let url = `${serverurl}/token/depart/delete/` + departdel[0]
        axios.delete(url)
            .then((res) => {
                console.log(res.data);
                fetchdepartment();
            })
            .catch((err) => {
                console.log(res);
            })
    }
})

function showupdatemodel(data) {
    document.querySelector('#update-department-name').value = data.name
    document.querySelector('#update-department-id').value = data.department_uid
    document.querySelector('#update-department-description').value = data.description
    document.querySelector('#update-department-status').value = data.status
    $('#update-depart').modal('show')
}


let updateform = document.querySelector('#update-department-form')
updateform.addEventListener('submit', (e) => {
    e.preventDefault();
    $('#update-depart').modal('hide')
    let departmentdata = {
        name: document.querySelector('#update-department-name').value,
        description: document.querySelector('#update-department-description').value,
        status: document.querySelector('#update-department-status').value,
    }
    let url = `${serverurl}/token/depart/update/` + document.querySelector('#update-department-id').value
    axios.put(url, departmentdata)
        .then((res) => {
            console.log(res.data);
            fetchdepartment();
        })
        .catch((err) => {
            console.log(res);
        })
})