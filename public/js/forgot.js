const savepswd = document.getElementById('savepassword');
const resetpassword = document.getElementById('resetpswd');
const message = document.getElementById("message");

const IP = "18.141.13.248";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

savepswd.addEventListener("click", async (e)=> {
    e.preventDefault();
    message.innerText = "";
    const newpswd = document.getElementById('newpswd').value;
    const confirmpswd = document.getElementById('confirmpswd').value;
    if (newpswd === "" || confirmpswd === ""){
        message.innerText = "❌ Please fill all the fields";
    }
    else if (newpswd !== confirmpswd){
        message.innerText = "❌ Passwords do not match";
    }
    else{
        try{
            const result = await axios.post(`http://${IP}:4000/password/resetpassword`, {
                uid : urlParams.get('uniqueid'),
                newpswd : newpswd
            });
            resetpassword.innerHTML = "";
            const message = document.createElement('p');
            message.id = "message";
            message.innerText = "✔️ Your password reset successfull, Please signin again";
            resetpassword.appendChild(message);
            const btn = document.createElement('a');
            btn.id = "reset-signin"
            btn.href = `http://${IP}:4000/html/signin.html`;
            btn.innerText = "Signin"
            resetpassword.appendChild(btn);
    
        }catch(err) {
            if(err){
                if(err.response.status === 404){
                    resetpassword.innerHTML = "";
                    const message = document.createElement('p');
                    message.id = "message";
                    message.innerText = "❌ Your Reset password link is Expired";
                    resetpassword.appendChild(message);
                }
                else{
                    resetpassword.innerHTML = "";
                    const message = document.createElement('p');
                    message.id = "message";
                    message.innerText = "❌ Something went wrong";
                    resetpassword.appendChild(message);
                }
            }
        }
    }
})