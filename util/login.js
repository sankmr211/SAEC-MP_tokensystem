let serverurl = 'http://localhost:8003'
let adduserform = document.querySelector("#login-form-data")
adduserform.addEventListener('submit', (e) => {
 e.preventDefault();
    let username=document.querySelector('#userid').value
    let userpass=document.querySelector('#userpass').value

    let url = `${serverurl}/token/user/fetch?email_id=`+username+"&pass="+userpass
    axios.get(url)
        .then((res) => {
            if(res.status==200){
                toastr.success('User login successfully ')
                if(res.data.data[0].user_type=='admin'){
                    localStorage.setItem("adminuser", JSON.stringify(res.data.data[0]));
                    window.location.replace("../index.html");
                }else if(res.data.data[0].user_type=='client'){
                    localStorage.setItem("clientuser", JSON.stringify(res.data.data[0]));
                    window.location.replace("../tokenclientindex.html");
                }else if(res.data.data[0].user_type=='officer'){
                    localStorage.setItem("officeruser", JSON.stringify(res.data.data[0]));
                    window.location.replace("../tokenoffindex.html");
                }
            }else if(res.status==204){
                toastr.error('Username and password not register.')
            }
           console.log(res);
        })
        .catch((err) => {
            console.log(err);
        })


})
