

function a() {
    let i = 0;
    for(i=0; i<20; i++) {
        console.log("i-" + i);
        for(let j=0;j<100000; j++){  };
    }
}

function b() {
    let j = 0;
    for(j=0; j<20; j++) {
        console.log("z-" + j);
        sleep(20);
    }
}

a();
b();