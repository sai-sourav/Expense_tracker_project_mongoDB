const signinbtn = document.getElementById('signinbtn');
const message = document.getElementById("message");
const forgotten = document.getElementById('forgotten');
const popupcontainer = document.getElementById('popup-container');
const closeforgotpassword = document.getElementById('close-forgotpassword');
const forgotok = document.getElementById('forgot-ok');
const forgotfieldset = document.getElementById('forgotpassword');
const forgotmessage = document.getElementById("forgotmessage");

const IP = "localhost";

forgotten.addEventListener("click", (e)=> {
    e.preventDefault();
    popupcontainer.classList.add("active");
});

closeforgotpassword.addEventListener("click", (e)=> {
    e.preventDefault();
    popupcontainer.classList.remove("active");
})

signinbtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const emailid = document.getElementById('email').value;
    const pswd = document.getElementById('pswd').value;
    try{
        message.innerText = "";
        const response = await axios.post(`http://${IP}:4000/signin`,{
            emailid : emailid,
            pswd : pswd
        });
        if(response.data.email === true && response.data.pswd === true){
            document.getElementById('email').value = "";
            document.getElementById('pswd').value = "";
            var url = new URL(response.data.url);
            localStorage.setItem('token', response.data.token);
            location.replace(url);
        }
        
    }catch(err){
        if(err.response.status !== 500){
            if(err.response.data.email === false){ 
                message.innerText = "❌ Wrong Email entered";
            }
            else if(err.response.data.pswd === false){
                message.innerText = "❌ Wrong Password entered";
            }
        }
        else{
            if(err.response.data.fields === "empty"){
                message.innerText = "❌ Please fill all the fields";
            } else {
                message.innerText = "❌ Network error";
            }
        }
    }
});

forgotok.addEventListener("click", async (e) =>{
    e.preventDefault();
    forgotmessage.innerText = "";
    const emailid = document.getElementById('forgot-email').value;
    if(emailid === ""){
        forgotmessage.innerText = "❌ Please fill all the fields";
    }
    else{
        try{
            let response = await axios.get(`http://${IP}:4000/password/forgotpassword/${emailid}`);
            response = response.data;
            document.getElementById('forgot-email').value = "";
            forgotfieldset.innerHTML = "";
            const message = document.createElement('p');
            message.id = "forgotmessage1";
            message.innerHTML = `✔️ Please Reset your password using this <a href='${response.link}'>Reset Password link</a>`;
            forgotfieldset.appendChild(message);
            forgotfieldset.classList.add("link");
        }catch(err){
            if(err.response.status !== 500){
                    forgotmessage.innerText = "❌ Wrong Email entered";
            }else {
                forgotmessage.innerText = "❌ Something went wrong";
            }
        }
    }
})