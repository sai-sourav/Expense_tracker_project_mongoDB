const signinbtn = document.getElementById('signinbtn');
const message = document.getElementById("message");

const IP = "localhost";

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
            url.searchParams.set('id', response.data.userid);
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