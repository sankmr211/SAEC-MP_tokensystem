let serverurl = 'http://localhost:8003'
window.addEventListener('DOMContentLoaded', (event) => {
    fetchdepartment()
    // fetchbookedtoken()
    // fetchusers()
    // fetchschudule()
});


//fetch department
function fetchdepartment() {
    let url = `${serverurl}/token/depart/fetch`
    axios.get(url)
        .then(function (response) {
        let fetchdepart=response.data.data
        document.querySelector('#departid').innerHTML= fetchdepart.length
        })
        .catch(function (error) {
            console.log(error);
        })
}


