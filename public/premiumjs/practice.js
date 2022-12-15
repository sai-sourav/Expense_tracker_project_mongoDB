const container = document.getElementById('popup-container');
const lbcontainer = document.getElementById('popup-container-leaderboard-id');
const downloadcontainer = document.getElementById('popup-container-downloads');
const adddetails = document.getElementById('adddetails');
const close = document.getElementById('close');
const leaderboardbtn = document.getElementById("leaderboard-btn");
const Dashbordbtn = document.getElementById('Dashbord-btn');
const Dashbordbtn1 = document.getElementById('Dashbord-btn1');
const downloadpdf = document.getElementById('downloadpdf');
const showdownload = document.getElementById('showdownload');
const savecreditbtn = document.getElementById('savecredit');
const saveexpensebtn = document.getElementById('saveexpense');
const creditmessage = document.getElementById("creditexists");
const debitmessage = document.getElementById("debitexists");
const IP = "18.141.13.248";
const getdatebtn = document.getElementById('getdate');
const getweekbtn = document.getElementById('getweek');
const getmonthbtn = document.getElementById('getmonth');
const credits_list_daily = document.getElementById('dailyleft');
const debits_list_daily = document.getElementById('dailyright');
const credits_list_weekly = document.getElementById('weeklyleft');
const debits_list_weekly = document.getElementById('weeklyright');
const credits_list_monthly = document.getElementById('monthlyleft');
const debits_list_monthly = document.getElementById('monthlyright');

const creditpagesdaily = document.getElementById('creditpagesdaily');
const debitpagesdaily = document.getElementById('debitpagesdaily');
const creditpagesweekly = document.getElementById('creditpagesweekly');
const debitpagesweekly = document.getElementById('debitpagesweekly');
const creditpagesmonthly = document.getElementById('creditpagesmonthly');
const debitpagesmonthly = document.getElementById('debitpagesmonthly');

const leaderboard_list = document.getElementById('leaderboard-list');
const label = document.getElementsByTagName('label');
const input =document.getElementsByTagName('input');
const textarea =  document.getElementsByTagName('textarea');
const global = document.getElementsByClassName('global');
const downloadslist = document.getElementById('downloads-list');

const token = localStorage.getItem('token');
const toggleswitch = document.getElementById("toggle");
const headers = { 
    headers: {
        'Authorization' : token
    }
}

document.getElementById("dailytab").addEventListener("click", (event) => {
  return openTab(event, 'daily');
} );
document.getElementById("weeklytab").addEventListener("click", (event) => {
  return openTab(event, 'weekly');
} );
document.getElementById("monthlytab").addEventListener("click", (event) => {
  return openTab(event, 'monthly');
} );

document.addEventListener("DOMContentLoaded", cleardisplaydata);
defaults();

toggleswitch.addEventListener("change", function() { 
  if (this.checked) {
    defaults();
  } else {
    for(i=0; i<global.length ; i++){
      global[i].classList.remove('dark');
    }
    for(i=0; i<textarea.length ; i++){
      textarea[i].classList.remove('dark');
    }
    for(i=0; i<input.length ; i++){
      input[i].classList.remove('dark');
    }
    for(i=0; i<label.length ; i++){
      label[i].classList.remove('dark');
    }
  }
})

adddetails.addEventListener("click", (e) => {
  e.preventDefault();
  container.classList.add("active");
  // default popup-tab and content
  defaultPopuptab("creditform","credittab");
})

close.addEventListener("click", (e)=> {
  e.preventDefault();
  container.classList.remove("active");
});

document.getElementById('credittab').addEventListener(("click"), (event)=> {
  return openpopupTab(event, 'creditform');
});

document.getElementById('expensetab').addEventListener(("click"), (event)=> {
  return openpopupTab(event, 'debitform');
});


Dashbordbtn.addEventListener("click", (e)=> {
  e.preventDefault();
  lbcontainer.classList.remove("active");
  downloadpdf.classList.remove("hide");
  downloadcontainer.classList.remove("active");
})

Dashbordbtn1.addEventListener("click", (e)=> {
  e.preventDefault();
  downloadpdf.classList.remove("hide");
  downloadcontainer.classList.remove("active");
})
// default tab and content
document.getElementById("daily").style.display = "block";
document.getElementById("dailytab").classList.add("active");

function defaultPopuptab(content,tab){
  let i, popuptabcontent, popuptablinks;
  popuptabcontent = document.getElementsByClassName("popup-tabcontent");

  for (i = 0; i < popuptabcontent.length; i++) {
    popuptabcontent[i].style.display = "none";
  }

  popuptablinks = document.getElementsByClassName("popup-tablinks");

  for (i = 0; i < popuptablinks.length; i++) {
    popuptablinks[i].className = popuptablinks[i].className.replace(" active", "");
  }

  document.getElementById(content).style.display = "block";
  document.getElementById(tab).classList.add("active");
}

function openTab(evt, tabname) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");

  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");

  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabname).style.display = "block";
  evt.target.classList.add("active");

  // clear everything by tab changes
  cleardisplaydata();
}

function defaults(){
  // darkmode
  for(i=0; i<global.length ; i++){
    global[i].classList.add('dark');
  }
  for(i=0; i<textarea.length ; i++){
    textarea[i].classList.add('dark');
  }
  for(i=0; i<input.length ; i++){
    input[i].classList.add('dark');
  }
  for(i=0; i<label.length ; i++){
    label[i].classList.add('dark');
  }
}

function cleardisplaydata(){
  creditpagesdaily.innerHTML = "";
  debitpagesdaily.innerHTML = "";
  creditpagesweekly.innerHTML = "";
  debitpagesweekly.innerHTML = "";
  creditpagesmonthly.innerHTML = "";
  debitpagesmonthly.innerHTML = "";
  document.getElementById('dailycredits').innerText = `Total credit: $0`;
  document.getElementById('dailydebits').innerText = `Total debit: $0`;
  document.getElementById('dailysavings').innerText = `Total Savings: $0`;
  document.getElementById('weeklycredits').innerText = `Total credit: $0`;
  document.getElementById('weeklydebits').innerText = `Total debit: $0`;
  document.getElementById('weeklysavings').innerText = `Total Savings: $0`;
  document.getElementById('monthlycredits').innerText = `Total credit: $0`;
  document.getElementById('monthlydebits').innerText = `Total debit: $0`;
  document.getElementById('monthlysavings').innerText = `Total Savings: $0`;
  document.getElementById('dailyleft').innerHTML = `<div class="no-expenses global">Select date to show Credits</div>`;
  document.getElementById('dailyright').innerHTML = `<div class="no-expenses global">Select date to show Debits</div>`;
  document.getElementById('weeklyleft').innerHTML = `<div class="no-expenses global">Select week to show Credits</div>`;
  document.getElementById('weeklyright').innerHTML = `<div class="no-expenses global">Select week to show Debits</div>`;
  document.getElementById('monthlyleft').innerHTML = `<div class="no-expenses global">Select month to show Credits</div>`;
  document.getElementById('monthlyright').innerHTML = `<div class="no-expenses global">Select month to show Debits</div>`;
}

function openpopupTab(evt, tabname) {
  let i, popuptabcontent, popuptablinks;
  popuptabcontent = document.getElementsByClassName("popup-tabcontent");

  for (i = 0; i < popuptabcontent.length; i++) {
    popuptabcontent[i].style.display = "none";
  }

  popuptablinks = document.getElementsByClassName("popup-tablinks");

  for (i = 0; i < popuptablinks.length; i++) {
    popuptablinks[i].className = popuptablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabname).style.display = "block";
  evt.target.classList.add("active");
}

leaderboardbtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  leaderboard_list.innerHTML = "";
  lbcontainer.classList.add("active");
  downloadpdf.classList.add("hide");
  try{
    const lifetime = await axios.get(`http://${IP}:4000/lifetime`,headers);
    const response = await axios.get(`http://${IP}:4000/leaderboard`, headers);
    const leaderboardarray = response.data.array;
    for(i=0;i<leaderboardarray.length;i++){
      const arrayitem = leaderboardarray[i];
      const row = document.createElement('div');
      row.innerHTML = `<p class="rank global">${i+1}</p>
                        <p class="name global">${arrayitem.name}</p>
                        <p class="credit global">${arrayitem.credits}</p>`
      row.className = "row"
      leaderboard_list.appendChild(row);
      const br = document.createElement('br');
      leaderboard_list.appendChild(br);
    }
    document.getElementById('totallifecredit').innerText = `$${lifetime.data.lifetimecredits}`;
    document.getElementById('totallifedebit').innerText = `$${lifetime.data.lifetimeexpenses}`;
    document.getElementById('totallifesaving').innerText = `$${lifetime.data.lifetimecredits-lifetime.data.lifetimeexpenses}`;
  }catch(err){
    if(err){
      console.log(err);
    }
  }
})

savecreditbtn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  creditmessage.innerText = "";
  const creditamount = document.getElementById('creditamount').value;
  const creditdesc = document.getElementById('creditdesc').value;
  const creditcategory = document.getElementById('creditcategory').value;

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
      creditmessage.innerText = "✔️ Credit added to your list";
      setTimeout(()=>{
        creditmessage.innerText = "";
      },3000);
    }catch(err){
      if(err){
        console.log(err);
      }
    }
  }
});

saveexpensebtn.addEventListener("click", async (evt)=> {
  evt.preventDefault();
  const amount = document.getElementById('amount').value;
  const desc = document.getElementById('desc').value;
  const category = document.getElementById('category').value;
  debitmessage.innerText = "";
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
      debitmessage.innerText = "✔️ Expense added to your list";
      setTimeout(()=>{
        debitmessage.innerText = "";
      },3000);
  }
  catch(err){
      if(err.response.data.fields === "empty"){
        debitmessage.innerText = "❌ Please fill all the fields";
      } else {
        debitmessage.innerText = "❌ Something went wrong";
      }
  }
})

getdatebtn.addEventListener("click", (e)=> {
  e.preventDefault();
  const datevalue = document.getElementById('date').value;
  if (datevalue !== ""){
    let page = 1
    getcredits(datevalue, "date", credits_list_daily, page, creditpagesdaily);
    getexpenses(datevalue, "date",debits_list_daily, page, debitpagesdaily);
  }
})

getweekbtn.addEventListener("click", (e)=> {
  e.preventDefault();
  const weekvalue = document.getElementById('week').value;
  if (weekvalue !== ""){
    let page = 1
    getcredits(weekvalue, "week", credits_list_weekly, page, creditpagesweekly);
    getexpenses(weekvalue, "week", debits_list_weekly, page, debitpagesweekly);
  }
})

getmonthbtn.addEventListener("click", (e)=> {
  e.preventDefault();
  const monthvalue = document.getElementById('month').value;
  if (monthvalue !== ""){
    let page = 1
    getcredits(monthvalue, "month", credits_list_monthly, page, creditpagesmonthly);
    getexpenses(monthvalue, "month", debits_list_monthly, page, debitpagesmonthly);
  }
})

async function getcredits(entity,type,container,page, pagecontainer){
  try{
    container.innerHTML = "";
    let response = await axios.get(`http://${IP}:4000/premium/credits?entity=${entity}&type=${type}&page=${page}`, headers);
    response = response.data;
    showcredits(response.credits, container);
    showcreditpages(entity,type,container, response, pagecontainer);
  }catch(err){
    if(err !== null){
        console.log(err);
        const div = document.createElement('div');
        div.id = "networkerror";
        div.className = "no-credits global";
        div.innerText = "❌ Something went wrong";
        container.appendChild(div);
    }
  }
}

async function getexpenses(entity,type,container,page, pagecontainer){
  try{
      container.innerHTML = "";
      let response = await axios.get(`http://${IP}:4000/premium/expenses?entity=${entity}&type=${type}&page=${page}`, headers);
      response = response.data;
      showexpenses(response.expenses, container);
      showdebitpages(entity,type,container,response, pagecontainer);
      if(type === "date"){
        document.getElementById('dailycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('dailydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('dailysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
      }else if(type === "week"){
        document.getElementById('weeklycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('weeklydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('weeklysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
      }else if(type === "month"){
        document.getElementById('monthlycredits').innerText = `Total credit: $${response.totalcredits}`;
        document.getElementById('monthlydebits').innerText = `Total debit: $${response.totalexpenses}`;
        document.getElementById('monthlysavings').innerText = `Total Savings: $${response.totalcredits-response.totalexpenses}`;
      }
  }catch(err){
      if(err){
          console.log(err);
          const div = document.createElement('div');
          div.id = "networkerror";
          div.className = "no-credits global";
          div.innerText = "❌ Something went wrong";
          container.appendChild(div);
      }
  }
};

function showcreditpages(
  entity,
  type,
  container,
  {
      currentpage,
      hasnextpage,
      haspreviouspage,
      nextpage,
      previouspage
  },
  pagecontainer
){
  const pages = pagecontainer;
  pages.innerHTML = ""
  
  if(haspreviouspage){
      const prevbtn = document.createElement('button');
      prevbtn.innerHTML = previouspage;
      prevbtn.addEventListener('click', ()=>getcredits(entity,type,container,previouspage,pagecontainer));
      pages.appendChild(prevbtn);
  }
  const currbtn = document.createElement('button');
  currbtn.innerHTML = currentpage;
  currbtn.classList.add('active');
  currbtn.addEventListener('click', ()=>getcredits(entity,type,container,currentpage,pagecontainer));
  pages.appendChild(currbtn);

  if(hasnextpage){
      const nextbtn = document.createElement('button');
      nextbtn.innerHTML = nextpage;
      nextbtn.addEventListener('click', ()=>getcredits(entity,type,container,nextpage,pagecontainer));
      pages.appendChild(nextbtn);
  }
}

function showdebitpages(
  entity,
  type,
  container,
  {
      currentpage,
      hasnextpage,
      haspreviouspage,
      nextpage,
      previouspage
  },
  pagecontainer
){
  const pages = pagecontainer;
  pages.innerHTML = ""
  
  if(haspreviouspage){
      const prevbtn = document.createElement('button');
      prevbtn.innerHTML = previouspage;
      prevbtn.addEventListener('click', ()=>getexpenses(entity,type,container,previouspage,pagecontainer));
      pages.appendChild(prevbtn);
  }
  const currbtn = document.createElement('button');
  currbtn.innerHTML = currentpage;
  currbtn.classList.add('active');
  currbtn.addEventListener('click', ()=>getexpenses(entity,type,container,currentpage,pagecontainer));
  pages.appendChild(currbtn);

  if(hasnextpage){
      const nextbtn = document.createElement('button');
      nextbtn.innerHTML = nextpage;
      nextbtn.addEventListener('click', ()=>getexpenses(entity,type,container,nextpage,pagecontainer));
      pages.appendChild(nextbtn);
  }
}

function showexpenses(expenses,container){
  container.innerHTML = "";
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
          container.appendChild(div);
          const br = document.createElement('br');
          container.appendChild(br);
      }
  }else{
      const div = document.createElement('div');
      div.id = "noexpenses";
      div.className = "no-expenses global";
      div.innerText = "No Expenses to show";
      container.appendChild(div);
  }
}

function showcredits(credits,container){
  container.innerHTML = "";
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
        container.appendChild(div);
        const br = document.createElement('br');
        container.appendChild(br);
    }
  }else{
      const div = document.createElement('div');
      div.id = "nocredits";
      div.className = "no-credits global";
      div.innerText = "No Credits to show";
      container.appendChild(div);
  }
}
const dailycont = document.getElementById('daily-cont');
const weeklycont = document.getElementById('weekly-cont');
const monthlycont = document.getElementById('monthly-cont');
dailycont.addEventListener("click", deleteentity);
weeklycont.addEventListener("click", deleteentity);
monthlycont.addEventListener("click", deleteentity);
async function deleteentity(e){
  e.preventDefault();
  if( e.target.className === "delete-expense-button"){
      const expenseid = e.target.parentNode.id;
      try{
          const response = await axios.post(`http://${IP}:4000/deleteexpense`, {
              expenseid : expenseid
          },
          headers)
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
    } catch(err){
        if(err){
            console.log(err.response);
        }
    }
}
};

downloadpdf.addEventListener("click", async (evt) => {
  evt.preventDefault();
  try{
    const response = await axios.get(`http://${IP}:4000/download`, headers)
    var a = document.createElement('a');
    a.href = response.data.fileurl;
    a.download = "myexpenses.txt";
    a.click();
  }catch(err){
        if(err){
            console.log(err);
        }
  }
})

showdownload.addEventListener("click", async (evt) => {
  evt.preventDefault();
  downloadslist.innerHTML = "";
  downloadcontainer.classList.add("active");
  downloadpdf.classList.add("hide");
  try{
    const response = await axios.get(`http://${IP}:4000/downloadhistory`, headers);
    const list = response.data.result;
    for(i=0; i<list.length ; i++){
      const item = list[i];
      const div = document.createElement('div');
      div.id = item.id;
      div.className = "row";
      div.innerHTML = `<p class="slno">${i+1}</p>
                       <p class="filelink"><a href="${item.fileurl}">Download file</a></p>
                       <p class="date">${item.createdAt}</p>`
      downloadslist.appendChild(div);
      const br = document.createElement('br');
      downloadslist.appendChild(br);
    }
  }catch(err){
        if(err){
            console.log(err);
        }
  }
})