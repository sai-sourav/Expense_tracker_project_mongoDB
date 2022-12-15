const signupbtn = document.getElementById('signupbtn');
const message = document.getElementById("exists");
const container = document.getElementById('container');
const ok = document.getElementById('ok');

const IP = "18.141.13.248";

ok.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
});

signupbtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const emailid = document.getElementById('email').value;
    const pswd = document.getElementById('pswd').value;
    try{
        message.innerText = "";
        const response = await axios.post(`http://${IP}:4000/signup`,{
            name : name,
            emailid : emailid,
            pswd : pswd
        });
        if(response.data.found === true){
            message.innerText = "❌ User already exists!";
        }
        else{
            container.classList.add("active");
            document.getElementById('name').value = "";
            document.getElementById('email').value = "";
            document.getElementById('pswd').value = "";
        }
    }catch(err){
        if(err.response.data.fields === "empty"){
            message.innerText = "❌ Please fill all the fields";
        } else {
            message.innerText = "❌ Network error";
        }
    }
})
