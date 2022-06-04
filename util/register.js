let serverurl = 'http://localhost:8003'



let adduserform = document.querySelector("#add-user-form")
adduserform.addEventListener('submit', (e) => {
    e.preventDefault()
    userdata = {
        name: document.querySelector("#add-name").value,
        password: document.querySelector("#add-pass").value,
        user_type: 'client',
        mobile_no: document.querySelector("#add-mob").value,
        email_id: document.querySelector("#add-email").value,
    }


    let url = `${serverurl}/token/user/create`
    axios.post(url, userdata)
        .then((res) => {
            console.log(res.data);
            if(res.data){

                toastr.success('User Signup successfully ')
                setTimeout(() => {
                    window.location.replace("../tokenlogin.html");
                }, 2000);
               
            }
        })
        .catch((err) => {
            console.log(res);
            toastr.error(res)
        })
    
})