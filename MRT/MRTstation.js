class MRTstation{
  constructor(x,y,Line,number,name){
    this.longtitude=y;
    this.latitude=x;  
    this.line=Line;
    this.number=number;
    this.child=[]
    this.distance=0;
    this.cost=[];
    this.newX=0;
    this.newY=0;
    this.name=name;
    this.center=false;
  }
  
  calcCost(){
    for(let i=0;i<this.child.length;i+=1){
      
      let lad=(this.latitude-this.child[i].latitude)*110.751
      let lod=(this.longtitude-this.child[i].longtitude)*101.751
     
      let d=pow(lad*lad+lod*lod,0.5);    
      this.cost.push(d);
    }
    
  }
  
  show(){
    if(this.line=='O') fill(255,97,0);
    if(this.line=='R') fill(227,23,13);
    if(this.line=='G') fill(34,139,34);
    if(this.line=='B') fill(65,115,255);
    if(this.line=='P') fill(255,0,255);
    if(this.line=='BR') fill(139,69,19);
    if(this.line=='O2') fill(255,97,0);
    if(this.line=='G2') fill(0,0,255);
    if(this.line=='R2') fill(255,192,203);
    this.newX=map(this.longtitude,minLongtitude,maxLongtitude,0+bias.x+scales,width+bias.x-scales);
    this.newY=map(this.latitude,minLatitude,maxLatitude,height+bias.y-scales,0+bias.y+scales);
    //text(str(this.longtitude)+" "+str(this.latitude) ,newX,newY)
    circle(this.newX,this.newY,10);
    if(this.center==true){
      fill(255,0,0);
      circle(this.newX,this.newY,20);
      
    }
    noFill();
    if(this.line=='O') stroke(255,97,0);
    if(this.line=='R') stroke(227,23,13);
    if(this.line=='G') stroke(34,139,34);
    if(this.line=='B') stroke(65,115,255);
    if(this.line=='P') stroke(255,0,255);
    if(this.line=='BR') stroke(139,69,19);
    if(this.line=='O2') stroke(255,97,0);
    if(this.line=='G2') stroke(0,0,255);
    if(this.line=='R2') stroke(255,192,203);
    vertex(this.newX,this.newY);
    
    
    
  }
  showmoney(){
    fill(0);
    stroke(0);
    this.newX=map(this.longtitude,minLongtitude,maxLongtitude,0+bias.x+scales,width+bias.x-scales);
    this.newY=map(this.latitude,minLatitude,maxLatitude,height+bias.y-scales,0+bias.y+scales);
    let money=0;
    if(this.distance<=5) money=20;
    else if(this.distance<=8) money=25;
    else if(this.distance<=11) money=30;
    else if(this.distance<=14) money=35;
    else if(this.distance<=17) money=40;
    else if(this.distance<=20) money=45;
    else if(this.distance<=23) money=50;
    else if(this.distance<=27) money=55;
    else if(this.distance<=31) money=60;
    else money=65
    
    text(money,this.newX+5,this.newY+5);
    
    if(scales<-600){
      textSize(20);
      //text(this.name,this.newX+20,this.newY+20);
      
    }
    
  }
  
  
}