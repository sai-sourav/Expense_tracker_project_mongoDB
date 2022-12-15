const message = document.getElementById("exists");
const creditmessage = document.getElementById("exists1");
const container = document.getElementById('popup-container');
const container1 = document.getElementById('popup-container1');
const premiumcontainer = document.getElementById('popup-container-premium');
const premiumaccountbtn = document.getElementById('premium');
const proceedtopayment = document.getElementById('payment');
const close = document.getElementById('close');
const close1 = document.getElementById('close1');
const closepremium = document.getElementById('closepremium');
const addexpensebtn = document.getElementById('addexpensebtn');
const addcreditbtn = document.getElementById('addcreditbtn');
const saveexpensebtn = document.getElementById('saveexpense');
const savecreditbtn = document.getElementById('savecredit');
const credits_list = document.getElementById('dailyleft');
const debits_list = document.getElementById('dailyright');
const list_container = document.getElementById('expenses-list');
const token = localStorage.getItem('token');
const headers = { 
    headers: {
        'Authorization' : token
    }
}

let payment_success = "";

const IP = "18.141.13.248";

premiumaccountbtn.addEventListener("click", (e)=>{
    e.preventDefault();
    premiumcontainer.classList.add("active");
});

closepremium.addEventListener("click", (e)=> {
    e.preventDefault();
    premiumcontainer.classList.remove("active");
});

proceedtopayment.addEventListener("click", async (e)=> {
    e.preventDefault();
    const response  = await axios.get(`http://${IP}:4000/premiummembership`,headers);
    var options =
    {
        "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
         "name": "Test Company",
         "order_id": response.data.order.id, // For one time payment
        "prefill": {
            "name": "Test User",
            "email": "test.user@example.com",
            "contact": "7003442036"
        },
        "theme": {
            "color": "#3399cc"
        },
        // This handler function will handle the success payment
        "handler": function (response) {
            axios.post(`http://${IP}:4000/updatetransactionstatus`,{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, headers).then(() => {
                var url = new URL(`http://${IP}:4000/premiumhtml/practice.html`);
                location.replace(url);
            }).catch(() => {
                alert('Something went wrong. Try Again!!!')
            })
        },
    };
    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response){
        alert("payment failed");
    });
})

close.addEventListener("click", (e)=> {
    e.preventDefault();
    container.classList.remove("active");
});

close1.addEventListener("click", (e)=> {
    e.preventDefault();
    container1.classList.remove("active");
});

addexpensebtn.addEventListener("click", (e) => {
    e.preventDefault();
    container.classList.add("active");
})

addcreditbtn.addEventListener("click", (e) => {
    e.preventDefault();
    container1.classList.add("active");
})

document.addEventListener("DOMContentLoaded", async ()=>{
    const page = 1;
    let response = await axios.get(`http://${IP}:4000/credits?page=${page}`, headers);
    response = response.data;
    showcredits(response.credits);
    showcreditpages(response);
});
document.addEventListener("DOMContentLoaded", async () => {
    const page = 1;
    let response = await axios.get(`http://${IP}:4000/expenses?page=${page}`, headers);
    response = response.data;
    showexpenses(response.expenses);
    showdebitpages(response);

});

async function getcredits(page){
    try{
      credits_list.innerHTML = "";
      let response = await axios.get(`http://${IP}:4000/credits?page=${page}`, headers);
      response = response.data;
      showcredits(response.credits);
      showcreditpages(response);
      document.getElementById('dailycredits').innerText = `Total credit: $${response.totalcredits}`;
      document.getElementById('dailydebits').innerText = `Total debit: $${response.totalexpenses}`;
      document.getElementById('dailysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
    }catch(err){
      if(err !== null){
          console.log(err.response);
          const div = document.createElement('div');
          div.id = "networkerror";
          div.className = "no-credits global";
          div.innerText = "❌ Something went wrong";
          credits_list.appendChild(div);
      }
    }
}
  
async function getexpenses(page){
try{
    debits_list.innerHTML = "";
    let response = await axios.get(`http://${IP}:4000/expenses?page=${page}`, headers);
    response = response.data;
    showexpenses(response.expenses);
    showdebitpages(response);
    document.getElementById('dailycredits').innerText = `Total credit: $${response.totalcredits}`;
    document.getElementById('dailydebits').innerText = `Total debit: $${response.totalexpenses}`;
    document.getElementById('dailysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
}catch(err){
    if(err){
        console.log(err);
        const div = document.createElement('div');
        div.id = "networkerror";
        div.className = "no-credits global";
        div.innerText = "❌ Something went wrong";
        debits_list.appendChild(div);
    }
}
};

function showexpenses(expenses){
    debits_list.innerHTML = "";
    if(expenses.length > 0){
        for(i=0; i< expenses.length ; i++){
            const expense = expenses[i];
            const div = document.createElement('div');
            div.id = `${expense.id}`;
            div.className = "expense-item";
            div.innerHTML = `<h3 class="showamount">Amount spent: $${expense.amount}</h3>
                            <h3 class="showdesc">Description: ${expense.Description}</h3>
                            <h3 class="showcat">Category: ${expense.category}</h3>
                            <button class="delete-expense-button" type='button'>Delete Expense</button>`;
            debits_list.appendChild(div);
            const br = document.createElement('br');
            debits_list.appendChild(br);
        }
    }else{
        const div = document.createElement('div');
        div.id = "noexpenses";
        div.className = "no-expenses global";
        div.innerText = "No Expenses to show";
        debits_list.appendChild(div);
    }
  }
  
function showcredits(credits){
    credits_list.innerHTML = "";
    if(credits.length > 0){
      for(i=0; i< credits.length ; i++){
          const credit = credits[i];
          const div = document.createElement('div');
          div.id = `${credit.id}`;
          div.className = "expense-item";
          div.innerHTML = `<h3 class="showamount">Amount spent: $${credit.amount}</h3>
                          <h3 class="showdesc">Description: ${credit.Description}</h3>
                          <h3 class="showcat">Category: ${credit.category}</h3>
                          <button class="delete-credit-button" type='button'>Delete credit</button>`;
           credits_list.appendChild(div);
          const br = document.createElement('br');
          credits_list.appendChild(br);
      }
    }else{
        const div = document.createElement('div');
        div.id = "nocredits";
        div.className = "no-credits global";
        div.innerText = "No Credits to show";
        credits_list.appendChild(div);
    }
}

function showcreditpages(
    {
        currentpage,
        hasnextpage,
        haspreviouspage,
        nextpage,
        previouspage
    }
){
    const pages = document.getElementById('creditpages');
    pages.innerHTML = ""
    
    if(haspreviouspage){
        const prevbtn = document.createElement('button');
        prevbtn.innerHTML = previouspage;
        // prevbtn.classList.add('btn');
        prevbtn.addEventListener('click', ()=>getcredits(previouspage));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = currentpage;
    currbtn.classList.add('active');
    // currbtn.classList.add('btn');
    currbtn.addEventListener('click', ()=>getcredits(currentpage));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        // nextbtn.classList.add('btn');
        nextbtn.addEventListener('click', ()=>getcredits(nextpage));
        pages.appendChild(nextbtn);
    }
}

function showdebitpages(
    {
        currentpage,
        hasnextpage,
        haspreviouspage,
        nextpage,
        previouspage
    }
){
    const pages = document.getElementById('debitpages');
    pages.innerHTML = ""
    
    if(haspreviouspage){
        const prevbtn = document.createElement('button');
        prevbtn.innerHTML = previouspage;
        prevbtn.classList.add('btn');
        prevbtn.addEventListener('click', ()=>getexpenses(previouspage));
        pages.appendChild(prevbtn);
    }
    const currbtn = document.createElement('button');
    currbtn.innerHTML = currentpage;
    currbtn.classList.add('active');
    currbtn.classList.add('btn');
    currbtn.addEventListener('click', ()=>getexpenses(currentpage));
    pages.appendChild(currbtn);

    if(hasnextpage){
        const nextbtn = document.createElement('button');
        nextbtn.innerHTML = nextpage;
        nextbtn.classList.add('btn');
        nextbtn.addEventListener('click', ()=>getexpenses(nextpage));
        pages.appendChild(nextbtn);
    }
}

saveexpensebtn.addEventListener("click", async (e)=> {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const desc = document.getElementById('desc').value;
    const category = document.getElementById('category').value;
    message.innerText = "";
    try{
        const response = await axios.post(`http://${IP}:4000/expenses`,{
            amount : amount,
            Description : desc,
            category : category
        },
        headers);
        document.getElementById('amount').value = "";
        document.getElementById('desc').value = "";
        document.getElementById('category').value = "";
        message.innerText = "✔️ Expense added to your list";
        setTimeout(()=>{
            message.innerText = "";
        },3000)
        getexpenses(1);
    }
    catch(err){
        if(err.response.data.fields === "empty"){
            message.innerText = "❌ Please fill all the fields";
        } else {
            message.innerText = "❌ Something went wrong";
        }
    }
});

savecreditbtn.addEventListener("click", async (e)=> {
    e.preventDefault();
    creditmessage.innerText = "";
    const creditamount = document.getElementById('amount1').value;
    const creditdesc = document.getElementById('desc1').value;
    const creditcategory = document.getElementById('category1').value;

    if(creditamount === "" || creditdesc === "" || creditcategory === ""){
        creditmessage.innerText = "❌ Please fill all the fields";
    }
    else {
        try{
            const result = await axios.post(`http://${IP}:4000/credits`,{
                amount : creditamount,
                Description : creditdesc,
                category : creditcategory
            },
            headers);
            document.getElementById('amount1').value = "";
            document.getElementById('desc1').value = "";
            document.getElementById('category1').value = "";
            creditmessage.innerText = "✔️ Credit added to your list";
            setTimeout(()=>{
                creditmessage.innerText = "";
            },3000);
            getcredits(1);
        }catch(err){
            if(err){
                console.log(err);
            }
        }
    }

});

list_container.addEventListener("click", async (e)=>{
    e.preventDefault();
    if( e.target.className === "delete-expense-button"){
        const expenseid = e.target.parentNode.id;
        try{
            const response = await axios.post(`http://${IP}:4000/deleteexpense`, {
                expenseid : expenseid
            },
            headers)
            getexpenses(1);
        } catch(err){
            if(err){
                console.log(err.response);
            }
        }
    }
    if( e.target.className === "delete-credit-button"){
        const creditid = e.target.parentNode.id;
        try{
            const response = await axios.post(`http://${IP}:4000/deletecredit`, {
                creditid : creditid
            },
            headers)
            getcredits(1);
        } catch(err){
            if(err){
                console.log(err.response);
            }
        }

    }
});