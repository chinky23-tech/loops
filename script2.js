let counter = document.getElementById('counter');

for( let i =2; i <= 20; i +=2){
    setTimeout(() =>{
        counter.textContent = i;
    },(i/2) * 1000);
}