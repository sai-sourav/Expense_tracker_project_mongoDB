const signinbtn = document.getElementById('signinbtn');
const message = document.getElementById("message");
const forgotten = document.getElementById('forgotten');
const popupcontainer = document.getElementById('popup-container');
const closeforgotpassword = document.getElementById('close-forgotpassword');
const forgotok = document.getElementById('forgot-ok');

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
            var url = new URL("file:///D:/sharpner/Expensetracker_project/public/html/addExpense.html");
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
    try{
        const emailid = document.getElementById('forgot-email').value;
        const response = await axios.get(`http://${IP}:4000/password/forgotpassword/${emailid}`)
        document.getElementById('forgot-email').value = "";
        popupcontainer.classList.remove("active");
    }catch(err){
        if(err){
            console.log(err);
        }
    }
})