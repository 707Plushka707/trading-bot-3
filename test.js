let tst = { a:1, b:2}
let tst2 = { ...tst, b:3 }
// console.log(tst2)

// let a = 31432.382344560476;
const origin = 38469.5;
let a = 38469.5;


for(i=1;i<10;i++) {
    a = origin * Math.pow(0.98, i);
    console.log(a)
}

console.log("--");


for(i=1;i<10;i++) {
    a = origin * Math.pow(1.02, i);
    console.log(a)
}