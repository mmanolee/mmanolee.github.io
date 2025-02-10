const W = window.innerWidth;
const H = window.innerHeight;

function rnd(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function cmykToRGB(c,m,y,k) 
{
    c = (c / 100);
    m = (m / 100);
    y = (y / 100);
    k = (k / 100);
    
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    
    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;
    
    
    r = Math.round(255 * r);
    g = Math.round(255 * g);
    b = Math.round(255 * b);
    
    
    return `rgb(${r},${g},${b})`
}

function update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2)
{
    if (K<0)
        K=0;
    else if (K>1)
        K=1;

    color_1 = cmykToRGB(c_1,m_1,y_1,k_1);
    color_2 = cmykToRGB(c_2,m_2,y_2,k_2);

    console.log("Color 1")
    console.log(color_1)
    console.log(c_1,m_1,y_1,k_1)
    console.log("Color 2")
    console.log(color_2)
    console.log(c_2,m_2,y_2,k_2)

    color_avg = cmykToRGB((c_2*K+c_1*(1-K)),
                          (m_2*K+m_1*(1-K)),
                          (y_2*K+y_1*(1-K)),
                          (k_2*K+k_1*(1-K)));

document.getElementById("c1").style.backgroundColor= color_avg;
document.getElementById("c2").style.backgroundColor= color_avg;

document.getElementById("q1").style.backgroundColor= color_1;
document.getElementById("q2").style.backgroundColor= color_2;

//document.getElementById("container").innerHTML = `${2} ciao`
/*
    ctx.fillStyle = color_1;
    ctx.fillRect(0, 0, W, H/2); 
    
    ctx.beginPath();
    ctx.arc(W/2, H/4, r, 0, 2*Math.PI);
    ctx.fillStyle = color_avg;
    ctx.fill(); 
    
    ctx.fillStyle = color_2;
    ctx.fillRect(0, H/2, W, H); 
    
    ctx.beginPath();
    ctx.arc(W/2, H/2+H/4, r, 0, 2*Math.PI);
    ctx.fillStyle = color_avg;
    ctx.fill(); 

    ctx.fillStyle = color_avg;
    ctx.textAlign = "center";
    ctx.font = "80px Arial";
    txt = `${K.toFixed(1)}`;
    var fM = ctx.measureText(txt);
    var txtH = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent;
    ctx.fillText(txt, canvas.width/2, canvas.height/2+txtH/2 + (0.5-K)*100 );
*/
}


document.getElementById("c_1").value = c_1 = rnd(0,100); 
document.getElementById("m_1").value = m_1 = rnd(0,100); 
document.getElementById("y_1").value = y_1 = rnd(0,100); 
document.getElementById("k_1").value = k_1 = rnd(0,100);

document.getElementById("c_2").value = c_2 = rnd(0,100); 
document.getElementById("m_2").value = m_2 = rnd(0,100); 
document.getElementById("y_2").value = y_2 = rnd(0,100); 
document.getElementById("k_2").value = k_2 = rnd(0,100); 


r = H/8;
K = 0.5;

update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);


is_down = false;
drag = false;

canvas = document.getElementById("container");


canvas.onmousedown = function (e) {
    is_down = true;
    //console.log("down")

    document.getElementById("q1").style.cursor = "grab";
    document.getElementById("q2").style.cursor = "grab";

    let x = e.clientX; 
    let y = e.clientY; 

    K = y/H;    

    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2)

};

canvas.onmouseup = function (e) {
    is_down = false;    
    //console.log("up")
    
    document.getElementById("q1").style.cursor = "";
    document.getElementById("q2").style.cursor = "";
 };

canvas.onmouseleave = function (e) {
    is_down = false;
 };

canvas.onmousemove = function (e) {
    
    if (is_down)
    {

        let x = e.clientX; 
        let y = e.clientY; 
        
        K = y/H;    

        update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2)

    }

 }; 



document.getElementById("c_1").addEventListener('input', function (e) {
    c_1 = document.getElementById("c_1").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

 document.getElementById("m_1").addEventListener('input', function (e) {
    m_1 = document.getElementById("m_1").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

document.getElementById("y_1").addEventListener('input', function (e) {
    y_1 = document.getElementById("y_1").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

document.getElementById("k_1").addEventListener('input', function (e) {
    k_1 = document.getElementById("k_1").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});


document.getElementById("c_2").addEventListener('input', function (e) {
    c_2 = document.getElementById("c_2").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

 document.getElementById("m_2").addEventListener('input', function (e) {
    m_2 = document.getElementById("m_2").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

document.getElementById("y_2").addEventListener('input', function (e) {
    y_2 = document.getElementById("y_2").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});

document.getElementById("k_2").addEventListener('input', function (e) {
    k_2 = document.getElementById("k_2").value;
    update_color(K, c_1,m_1,y_1,k_1, c_2,m_2,y_2,k_2);
});
