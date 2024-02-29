var amount = document.getElementById('amt');
var description = document.getElementById('desc');
var category = document.getElementById('category');
let btn = document.getElementById('submit');
let display = document.getElementById('display');
let ldrBoard = document.getElementById('ldrboard');
let download = document.getElementById('download');

var currPage = 0;
var rowsPerPage = 0;

const token = localStorage.getItem('token');
btn.addEventListener('click', addExpense);
ldrBoard.addEventListener('click',showLeaderboard);

async function rowsInPage(rows){
   await axios.get(`http://localhost:3000/updaterow/${rows}`,{headers:{"Authorization":token}});
   location.reload();
}

window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        const res  = await axios.get('http://localhost:3000/data',{headers:{"Authorization":token}})
        
        await axios.get('http://localhost:3000/membership',{headers:{"Authorization":token}}).then(res=>{
      
            localStorage.setItem("noOfPages",res.data.rowPreference)//store the rowPreference in local storage
            rowsPerPage = localStorage.getItem("noOfPages");

            if(res.data.premium == true ){
                document.getElementById('premium').style.visibility='visible'
                document.getElementById('ldrboard').style.visibility = 'visible'
                document.getElementById('download').style.visibility='visible'

                leaderboardApiCall();
            }
            else{ document.getElementById('rzp-button1').style.visibility='visible'}
        }) 
        document.getElementById('select').value = rowsPerPage

        //initial pagination when page load
        let pages = await paginate(res.data , rowsPerPage);
        let page =  pages[currPage];

        for(let i = 2;i<=pages.length;i++ ){
            let parent = document.getElementById('paginationUl');
            parent.innerHTML = parent.innerHTML+(` <li class="page-item" onclick="activeLink(${i})" value="${i}"><a class="page-link" href="#" >${i}</a></li>  `)
        }

        for (let i = 0; i < page.length; i++) {
            let id = page[i].id;
            displayOnExpense(id, page[i]);
        }
    }
    
    catch(err){
        console.log(err)
    }
})


   //when user clicks on different page number
   async function activeLink(currPage){
    let pageTab = document.getElementsByClassName('page-link');
    for(index of pageTab){
        index.classList.remove('active');
    }

    event.target.classList.add('active'); 

    const res  = await axios.get('http://localhost:3000/data',{headers:{"Authorization":token}});
    let pages = await paginate(res.data , rowsPerPage);
    currPage = currPage-1;
    let page =  pages[currPage];
    
    //display rows acc. to the "rows per page" and "page number"
    document.getElementById('display').innerHTML = ""; 
    for (let i = 0; i < page.length; i++) {
        let id = page[i].id;
        displayOnExpense(id, page[i]);
    }
}


//It will give the array of pages according to the "rows per page"
function  paginate(arr,size){
    return new Promise((resolve,reject)=>{
       const d =  arr.reduce((acc, val, i)=>{
            let idx = Math.floor(i/size);
            let page = acc[idx] || (acc[idx]=[])
            page.push(val);
            return acc;
        },[])

        resolve(d);
    })
}


download.addEventListener('click',downloadReport);
async function downloadReport(){
let users= await axios.get('http://localhost:3000/downloadexpense',{headers:{"Authorization":token}})
window.location.replace(users.data.fileURL);
}


async function leaderboardApiCall(){
    let users= await axios.get('http://localhost:3000/premium/leaderboard',{headers:{"Authorization":token}})
   
    users.data.forEach(element => {
       displayOnLeaderBoard(element)
    });
}


function showLeaderboard(e){
    e.preventDefault();
    //if expense is visible then hide it and display leaderboard
    if( document.getElementsByClassName('data_container')[0].style.display=='block'){
        document.getElementsByClassName('data_container')[0].style.display='none';
        document.getElementsByClassName('leaderboard')[0].style.display='block';
    }
    //if leaderboard is visible then hide it and display expense
    else if(document.getElementsByClassName('leaderboard')[0].style.display=='block'){
        document.getElementsByClassName('leaderboard')[0].style.display='none';
        document.getElementsByClassName('data_container')[0].style.display='block';   
    }

   }


//razor pay integeration
document.getElementById('rzp-button1').onclick = async function(e){
    const response = await axios.get('http://localhost:3000/purchase/createorder',{headers:{"Authorization":token}});

    var options = {
        "key": response.data.key_id,
        "order_id": response.data.orderid, 
        "amount": response.data.amount,
        "currency": response.data.currency,
        "name": "Buy premium",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "theme": {
            "color": "#3399cc"
        },
        //handler will be executed if transaction is successful
        "handler" : async function(response){
        await axios.post('http://localhost:3000/purchase/checkout', {
        order_id: response.razorpay_order_id,
        payment_id: response.razorpay_payment_id,
        status:"successful"
        }, {headers:{"Authorization":token}})

        document.getElementById('rzp-button1').style.visibility='hidden';
        document.getElementById('premium').style.visibility='visible';
        document.getElementById('ldrboard').style.visibility = 'visible'
        document.getElementById('download').style.visibility='visible'

        alert("You are a premium user now")
        },
    };
    


    //if transaction successful
    var rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();


    //if transaction failed
    rzp1.on('payment.failed',async function (response){
        alert("payment failed try again later");

        await axios.post('http://localhost:3000/purchase/checkout', {
            order_id: response.error.metadata.order_id,
            payment_id: response.error.metadata.payment_id,
            status:"failed"
    }, {headers:{"Authorization":token}})
    })
}


async function addExpense(e) {
    e.preventDefault();
    try{
        if(amount.value==''||description.value=='') return false;

        let obj = {
            amount: amount.value,
            description: description.value,
            category: category.value  
        };
        let exp = `${amount.value}  -  ${description.value}  -  ${category.value}`;
    
        const id= await axios.post('http://localhost:3000/', obj,{headers:{"Authorization":token}});
        displayOnExpense(id.data, obj);
    }

    catch(err){
        console.log(err.response);
    }
}


function displayOnExpense(id, expense) {

    let exp =`<tr id="${id}">
    <td id="${id}">${expense.category}</td>
    <td>${expense.description}</td>
    <td style="text-align: right;">$${expense.amount}</td>
    <td class="edit_delete_column"><button class="edit_button" id="${id}" onClick = "editExpense('${id}')"> </button>
                                   <button class="delete_button" id="${id}" onClick="deleteExpense('${id}')"></button></td>
    </tr>`
    display.innerHTML = display.innerHTML + exp;
}

function displayOnLeaderBoard(user){
    let ldrBoardTable = document.getElementById('ldrboard_table')
    let element =`<tr>
    <td >${user.name}</td>
    <td>${user.total}</td>
    </tr>`
    ldrBoardTable.innerHTML = ldrBoardTable.innerHTML + element;
}
 
function deleteExpense(id) {
    try{
        let elementToRemove = document.getElementById(id);
        elementToRemove.remove();
        return axios.get(`http://localhost:3000/delete/${id}`)
    }

    catch(err){
     console.log(err)
    }
}


async function editExpense(id) {
    try{   
        let res = await deleteExpense(id)
        let amt = res.data.amount;
        let des = res.data.description;
        let cat = res.data.category;

        amount.value = amt,
        description.value = des,
        category.value = cat;
    }

    catch(err){
        console.log(err);
    }
}