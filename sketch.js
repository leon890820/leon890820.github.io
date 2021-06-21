let s;
let mrtStation=[];
let minLongtitude=1000000;
let maxLongtitude=-10000000;
let minLatitude=1000000;
let maxLatitude=-10000000;
let Oline=[];
let BRline=[];
let Bline=[];
let Rline=[];
let Gline=[];
let R2line=[];
let Pline=[];
let O2line=[];
let G2line=[];
let test=[];
let bias;
let scales=0;
let nowState;

function preload(){
  s=loadStrings("data/MRT.txt");

}


function setup() {
  createCanvas(800, 800);
  bias=createVector(0,0)
  
  print
  for(let i=1;i<s.length-1;i+=1){
    sp=s[i].split(" ");
    let station=new MRTstation(float(sp[2]),float(sp[3]),sp[4],float(sp[5]),sp[0])
    mrtStation.push(station); 
    if(sp[4]=='O'){
      Oline.push(station);      
    }else if(sp[4]=='BR'){
      BRline.push(station);      
    }else if(sp[4]=='B'){
      Bline.push(station);      
    }else if(sp[4]=='G'){
      Gline.push(station);      
    }else if(sp[4]=='R'){
      Rline.push(station);      
    }else if(sp[4]=='R2'){
      R2line.push(station);      
    }else if(sp[4]=='O2'){
      O2line.push(station);      
    }else if(sp[4]=='G2'){
      G2line.push(station);      
    }else if(sp[4]=='P'){
      Pline.push(station);      
    }     
  }
  for(let i=0;i<mrtStation.length;i+=1){
    minLongtitude=min(mrtStation[i].longtitude,minLongtitude);
    maxLongtitude=max(mrtStation[i].longtitude,maxLongtitude);
    minLatitude=min(mrtStation[i].latitude,minLatitude);
    maxLatitude=max(mrtStation[i].latitude,maxLatitude);    
  }
  
  sortLine();
  
  Rline[0].child.push(Rline[1]);
  for(let i=1;i<Rline.length-1;i+=1){
    Rline[i].child.push(Rline[i-1]);
    Rline[i].child.push(Rline[i+1]);
    
  }
  Rline[Rline.length-1].child.push(Rline[Rline.length-2]);
  
  Oline[0].child.push(Oline[1]);
  for(let i=1;i<Oline.length-1;i+=1){
    Oline[i].child.push(Oline[i-1]);
    Oline[i].child.push(Oline[i+1]);
    
  }
  Oline[Oline.length-1].child.push(Oline[Oline.length-2]);
  
  Bline[0].child.push(Bline[1]);
  for(let i=1;i<Bline.length-1;i+=1){
    Bline[i].child.push(Bline[i-1]);
    Bline[i].child.push(Bline[i+1]);
    
  }
  Bline[Bline.length-1].child.push(Bline[Bline.length-2]);
  
  BRline[0].child.push(BRline[1]);
  for(let i=1;i<BRline.length-1;i+=1){
    BRline[i].child.push(BRline[i-1]);
    BRline[i].child.push(BRline[i+1]);
    
  }
  BRline[BRline.length-1].child.push(BRline[BRline.length-2]);
  
  Gline[0].child.push(Gline[1]);
  for(let i=1;i<Gline.length-1;i+=1){
    Gline[i].child.push(Gline[i-1]);
    Gline[i].child.push(Gline[i+1]);
    
  }
  Gline[Gline.length-1].child.push(Gline[Gline.length-2]);
  
  Pline[0].child.push(Pline[1]);
  for(let i=1;i<Pline.length-1;i+=1){
    Pline[i].child.push(Pline[i-1]);
    Pline[i].child.push(Pline[i+1]);
    
  }
  Pline[Pline.length-1].child.push(Pline[Pline.length-2]);
  
  R2line[0].child.push(R2line[1]);
  
  for(let i=1;i<R2line.length-1;i+=1){
    R2line[i].child.push(R2line[i-1]);
    R2line[i].child.push(R2line[i+1]);
    
  }
  R2line[R2line.length-1].child.push(R2line[R2line.length-2]);
  
  O2line[0].child.push(O2line[1]);
  for(let i=1;i<O2line.length-1;i+=1){
    O2line[i].child.push(O2line[i-1]);
    O2line[i].child.push(O2line[i+1]);
    
  }
  O2line[O2line.length-1].child.push(O2line[O2line.length-2]);
  
  G2line[0].child.push(G2line[1]);
  for(let i=1;i<G2line.length-1;i+=1){
    G2line[i].child.push(G2line[i-1]);
    G2line[i].child.push(G2line[i+1]);
    
  }
  G2line[G2line.length-1].child.push(G2line[G2line.length-2]);
  
  Rline[15].child.push(Oline[10]);
  Oline[10].child.push(Rline[15]);
  
  Oline[11].child.push(O2line[0]);
  O2line[0].child.push(Oline[11]);
  
  Gline[13].child.push(Rline[17]);
  Rline[17].child.push(Rline[13]);
  
  Gline[14].child.push(Oline[7]);
  Oline[7].child.push(Gline[14]);
  
  Gline[15].child.push(BRline[10]);
  BRline[10].child.push(Gline[15]);
  
  BRline[0].child.push(Bline[22]);
  Bline[22].child.push(BRline[0]);
  
  Rline[19].child.push(Bline[12]);
  Bline[12].child.push(Rline[19]);
  
  Bline[10].child.push(Gline[11]);
  Gline[11].child.push(Bline[10]);
  
  Bline[13].child.push(Oline[6]);
  Oline[6].child.push(Bline[13]);
  
  BRline[14].child.push(Bline[14]);
  Bline[14].child.push(BRline[14]);
  
  Gline[9].child.push(Rline[20]);
  Rline[20].child.push(Gline[9]);
  
  Rline[21].child.push(Oline[5]);
  Oline[5].child.push(Rline[21]);
  
  Rline[23].child.push(BRline[15]);
  BRline[15].child.push(Rline[23]);
  
  Gline[3].child.push(Pline[1]);
  Pline[1].child.push(Gline[3]);
  
  Oline[1].child.push(Pline[4]);
  Pline[4].child.push(Oline[1]);
  
  Oline[16].child.push(Pline[11]);
  Pline[11].child.push(Oline[16]);
  
  Rline[6].child.push(R2line[0]);
  R2line[0].child.push(Rline[6]);
  
  Gline[2].child.push(G2line[0]);
  G2line[0].child.push(Gline[2]);
  
  for(let i=0;i<mrtStation.length;i+=1){
    
    mrtStation[i].calcCost();    
  }
 
  
  serch(Rline[12]);
  nowState=Rline[12];
  
}

function draw() {
  background(220);
  nowState.center=true
  text("查詢站名 : "+nowState.name,10,30);
beginShape();
  
  for(let i=0;i<Rline.length;i+=1){
    Rline[i].show();
   
  }
  endShape();
  
  
  
  beginShape();
  
  for(let i=0;i<Oline.length;i+=1){
    Oline[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<Bline.length;i+=1){
    Bline[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<BRline.length;i+=1){
    BRline[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<Gline.length;i+=1){
    Gline[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<Pline.length;i+=1){
    Pline[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<G2line.length;i+=1){
    G2line[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<R2line.length;i+=1){
    R2line[i].show();
  }
  endShape();
  beginShape();
  
  for(let i=0;i<O2line.length;i+=1){
    O2line[i].show();
  }
  endShape();
  
  for(let i=0;i<mrtStation.length;i+=1){
    
    mrtStation[i].showmoney();
  }
   
  
  
}


function serch(spot){
  for(let i=0;i<mrtStation.length;i+=1){
    mrtStation[i].distance=0;
     mrtStation[i].center=false;
  }
  
  let queue=[]
  queue.push(spot);
  
  let finds=[]
  
  while(true){
    if(queue.length==0) break;
    finds.push(queue[0]);
    //print(queue[0]);
    for(let i=0;i<queue[0].child.length;i+=1){
      if(isin(finds,queue[0].child[i])) continue;
      queue[0].child[i].distance=queue[0].cost[i]+queue[0].distance;
      
      queue.push(queue[0].child[i]);         
    }
    let tem=[]
    for(let i=0;i<queue.length-1;i+=1){
      tem.push(queue[i+1]);
      
    }
    queue=tem;
   
  }
  
  
  
}

function isin(f,c){
  
  for(let i=0;i<f.length;i+=1){
    if(f[i].line==c.line && f[i].number==c.number) {
      
      f[i].distance=min(f[i].distance,c.distance);
      return true;
    }
  }
  return false;
  
  
}




function sortLine(){
   nRL=[];
  let count=1;
  for(let i=0;i<Rline.length+10;i+=1){
    for(let j=0;j<Rline.length;j+=1){
      if(Rline[j].number==count) {
        nRL.push(Rline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  Rline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<Oline.length+10;i+=1){
    for(let j=0;j<Oline.length;j+=1){
      if(Oline[j].number==count) {
        nRL.push(Oline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  Oline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<Bline.length+10;i+=1){
    for(let j=0;j<Bline.length;j+=1){
      if(Bline[j].number==count) {
        nRL.push(Bline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  Bline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<Gline.length+10;i+=1){
    for(let j=0;j<Gline.length;j+=1){
      if(Gline[j].number==count) {
        nRL.push(Gline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  Gline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<BRline.length+10;i+=1){
    for(let j=0;j<BRline.length;j+=1){
      if(BRline[j].number==count) {
        nRL.push(BRline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  BRline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<Pline.length+10;i+=1){
    for(let j=0;j<Pline.length;j+=1){
      if(Pline[j].number==count) {
        nRL.push(Pline[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  Pline=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<R2line.length+10;i+=1){
    for(let j=0;j<R2line.length;j+=1){
      if(R2line[j].number==count) {
        nRL.push(R2line[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  R2line=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<G2line.length+10;i+=1){
    for(let j=0;j<G2line.length;j+=1){
      if(G2line[j].number==count) {
        nRL.push(G2line[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  G2line=nRL;
  
  nRL=[];
  count=1;
  for(let i=0;i<O2line.length+10;i+=1){
    for(let j=0;j<O2line.length;j+=1){
      if(O2line[j].number==count) {
        nRL.push(O2line[j]);   
        break;
      }
      
    }
    count+=1
  }
  
  O2line=nRL;
  
  
  
}

function mouseDragged(){
  bias.x+=mouseX-pmouseX;
  bias.y+=mouseY-pmouseY;
  
}


function mousePressed(){
  for(let i=0;i<mrtStation.length;i+=1){
    if(dist(mouseX,mouseY,mrtStation[i].newX,mrtStation[i].newY)<8){
      nowState=mrtStation[i]
      nowState.center=true;
      serch(mrtStation[i]);
      break;
      
    }    
  }
  
  
  
}

function mouseWheel(event) {
 
  scales+=event.delta*0.3;
  
}
