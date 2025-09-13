
let timer = document.getElementById('timer');
let start = 10;

   // countdown using for loop + setTimeout

for( let i = start; i >= 0; i --){

    setTimeout(() =>{
if(i === 0){
    timer.textContent = "Time's Up!";
}else{
    timer.textContent = i;
}
    
    }, (start - i) * 1000);
}


