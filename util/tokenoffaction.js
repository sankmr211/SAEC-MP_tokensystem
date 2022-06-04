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
    user_id=storedNames.user_uid
    officerschdule(user_id)
    userdata()
});

function logout() {
    localStorage.removeItem("officeruser");
    window.location.replace("../tokenlogin.html");
}


let officerschdle=[]
function officerschdule(user_id){
    let url = `${serverurl}/token/schduletoken/fetch?user_uid=`+user_id
    let officerschduledata=''
    axios.get(url)
    .then(function (res) {
        if (res.status == 200 && res.data.statusCode != 204 ) {
            for (const data of res.data.data) {
                officerschdle.push(data)
                officerschduledata += `
                <option value="">Select</option>
                <option value="${data.schdule_uid+"-"+data._id}">${data.name}</option> `
                document.querySelector('#get-officer-schdule').innerHTML = officerschduledata
            }
        } else if (res.data.statusCode = 204) {
            document.querySelector('#get-officer-schdule').innerHTML = `<option value="">No Data</option>`
        }
    })
    .catch(function (error) {
        console.log(error);
    })
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

let schduledata=[]
function fetchschdule(opt){
const button = document. querySelector('#userstatus')
if(opt.value!==''){
    button.disabled =false
    if(officerschdle[0].active ==true){
        button.checked=true
    }
    
    if(officerschdle[0].active ==false){
        button.checked=false
    }

    getuserbooking(opt.value)

    schduledata=opt.value.split('-')

}else{
    button.disabled =true
    button.checked=false
}





}

function getuserbooking(value){
    let url = `${serverurl}/token/booking/fetch?schdule_uid=`+value.split('-')[0]+`&status=approval`
    let schduleuserdata=''
    axios.get(url)
        .then(function (res) {
            if (res.status == 200 && res.data.statusCode != 204) {
                let count =1
                for (const data of res.data.data) {
                    schduleuserdata+=`
                    <tr>
                            <td hidden>${data.token_no}</td>
                            <td >${count}</td>
                            <td>${data.token_no}</td>
                            <td>${data.schdule_name}</td>
                            <td>${userdetail.find(elm=> elm.user_uid==data.user_uid).name}</td>
                            <td>${userdetail.find(elm=> elm.user_uid==data.user_uid).mobile_no}</td>
                            <td>${data.status}</td>
                            <td><div class="btn-group btn-group-toggle " data-toggle="buttons">
                            <label class="btn btn-secondary complete">
                              <input type="radio" name="options" id="option1" autocomplete="off"> Complete
                            </label>
                            <label class="btn btn-secondary failure">
                              <input type="radio" name="options" id="option2" autocomplete="off"> Failure
                            </label>
                          </div></td>`
                    document.querySelector('#action-token-table').innerHTML=schduleuserdata
                    count++
                }
            } else if (res.data.statusCode = 204) {
                schduleuserdata += `
                    <tr class="no-data">
                            <td colspan="14" class="text-center">No data available</td>
                        </tr>`
                    document.querySelector('#action-token-table').innerHTML = schduleuserdata
            }
        })
        .catch(function (error) {
            console.log(error);
        })
}

var checkbox = document.querySelector('input[type="checkbox"]');
checkbox.addEventListener('change', function () {
    let filter={}
    if (checkbox.checked) {
            filter.active=true
    } else {
        filter.active=false
    }
    let url = `${serverurl}/token/schduletoken/update/` + schduledata[1]
        axios.put(url, filter)
            .then((res) => {
                console.log(res.data);
               officerschdle.shift()
               officerschdle.push(res.data.data)
            })
            .catch((err) => {
                console.log(err);
            })

  });


  let tabledata = document.querySelector('#action-token-table')
  tabledata.addEventListener('click', (e) => {
    let targetelm = e.target;
    let updatests={}
    let tokenid=''
    if (targetelm.classList.contains('complete')) {
        tokenid = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML
        let url = `${serverurl}/token/booking/update/`+tokenid
        updatests.status='complete'
        axios.put(url, updatests)
        .then((res) => {
            console.log(res.data);
            transactiontoken(res.data.data)
        })
        .catch((err) => {
            console.log(err);
        })
    }
    if (targetelm.classList.contains('failure')) {
        tokenid = targetelm.parentElement.parentElement.parentElement.firstElementChild.innerHTML
        updatests.status='failure'
        let url = `${serverurl}/token/booking/update/`+tokenid
        axios.put(url, updatests)
            .then((res) => {
                console.log(res.data);
                transactiontoken(res.data.data)
                
            })
            .catch((err) => {
                console.log(res);
            })
    }

})



function transactiontoken(data){
        let trandata = {
            token_no:data.token_no,
            schedulename:data.schdule_name,
            department_uid:data.department_uid,
            schdule_uid:data.schdule_uid,
            user_uid:data.user_uid,
            time: moment().format("YYYY-MM-DD[T]HH:mm:ss") + '.000Z',
            mobile_no:userdetail.find(elm=>elm.user_uid==data.user_uid).mobile_no,
            status:data.status,
            officer_uid:data.officer_uid,
            schdule_startend:`${data.schedule_starttime}_${data.schedule_endtime}`
        }
        let url = `${serverurl}/token/tokentran/create`
        axios.post(url, trandata)
            .then((res) => {
                console.log(res.data);
                location.reload();
            })
            .catch((err) => {
                console.log(res);
            })

    
}

