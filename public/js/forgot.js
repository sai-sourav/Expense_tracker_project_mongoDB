const savepswd = document.getElementById('savepassword');
const resetpassword = document.getElementById('resetpswd');
const message = document.getElementById("message");

const IP = "localhost";

const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}

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
            newpswd : newpswd
            }, headers);
            resetpassword.innerHTML = "";
            const message = document.createElement('p');
            message.id = "message";
            message.innerText = "✔️ Your password reset successfull, Please signin again";
            resetpassword.appendChild(message);
            const btn = document.createElement('a');
            btn.id = "reset-signin"
            btn.href = "http://localhost:4000/html/signin.html";
            btn.innerText = "Signin"
            resetpassword.appendChild(btn);
    
        }catch(err) {
            if(err){
                console.log(err);
            }
        }
    }
})