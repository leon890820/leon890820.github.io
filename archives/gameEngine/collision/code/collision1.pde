/* removed the class block and any import statements */
        
Box box;
ArrayList<Box> boxes;

void setup() 
{
  // general setup
  size (600,600);
  background(0);
  boxes=new ArrayList<Box>();
  box=new Box(100, 100);
  box.transform.setPosition(new Vector2(width/2, height/2));
  boxes.add(box);
}

void draw(){
  background(0);
  

  box.show();
  box.update();
  stroke(255);
  line(0,400,width,100);
  Vector2 l=new Vector2(width,-300);
  float minRecord=1000000;
  float maxRecord=-100000;
  for(int i=0;i<4;i+=1){
    float a=box.realvertex[i].minus(new Vector2(0,400)).projectOntoLength(l);
    maxRecord=max(a,maxRecord);
    minRecord=min(a,minRecord);
    Vector2 projectPoint=box.realvertex[i].minus(new Vector2(0,400)).projectOnto(l);
    projectPoint=projectPoint.plus(new Vector2(0,400));
    fill(255,255,0);
    ellipse(projectPoint.x, projectPoint.y, 10, 10);
  }
  Vector2 minVector=new Vector2(width,-300);
  Vector2 maxVector=new Vector2(width,-300);
  minVector.mult(minRecord);
  maxVector.mult(maxRecord);
  fill(255,0,255);
  text("min",minVector.x,minVector.y+415);
  text("max",maxVector.x,maxVector.y+415);
}

class Box{
   float w;
   float h;
   Vector2[] vertexs=new Vector2[4];
   Vector2[] realvertex=new Vector2[4];
   Transform transform;
   boolean touch;
   boolean drags;
   boolean collision;
   
   
   Box(float _w,float _h){
     w=_w;
     h=_h;
     transform=new Transform();
     createVertex();
   }
   void createVertex(){
    Vector2 position=transform.getPosition();
    vertexs[0]=new Vector2(position.x+w/2,position.y-h/2);
    vertexs[1]=new Vector2(position.x-w/2,position.y-h/2);
    vertexs[2]=new Vector2(position.x-w/2,position.y+h/2);
    vertexs[3]=new Vector2(position.x+w/2,position.y+h/2);
    
  }
  
  
  
  
  void show(){
    if (touch)fill(255, 0, 0);
    else if(collision)fill(255,255,0);
    else fill(255);
    if (drags) stroke(0, 255, 0);
    else stroke(0);
    beginShape();
    int c=0;
    for(Vector2 v:vertexs){
      Vector2 newv=v.rotated(transform.angle);
      newv.add(transform.position);
      realvertex[c]=newv.copy();c+=1;
      vertex(newv.x,newv.y);
    }
    endShape(CLOSE);
  
  }
  void update(){
    pnpoly(mouseX,mouseY,this);
    drag();
	transform.angle+=0.01;
  }
  void drag() {
    if (drags) {
      Vector2 v=new Vector2(mouseX-pmouseX, mouseY-pmouseY);
      transform.position.add(v); 
    }
  }
   
}

static public class Vector2 {
  float x;
  float y;
  Vector2(float x, float y) {
    this.x=x;
    this.y=y;
  }
  Vector2() {
    x=0;
    y=0;
  }

  Vector2 copy() {
    return new Vector2(x, y);
  }

  static Vector2 plus(Vector2 v1, Vector2 v2) {
    return new Vector2(v1.x+v2.x, v1.y+v2.y);
  }
  Vector2 plus(Vector2 v) {
    return new Vector2(x+v.x, y+v.y);
  }

  void add(Vector2 v) {
    x+=v.x;
    y+=v.y;
  }

  static Vector2 minus(Vector2 v1, Vector2 v2) {
    return new Vector2(v1.x-v2.x, v1.y-v2.y);
  }
  Vector2 minus(Vector2 v) {
    return new Vector2(x-v.x, y-v.y);
  }

  void sub(Vector2 v) {
    x-=v.x;
    y-=v.y;
  }

  static Vector2 scalar(float n, Vector2 v) {
    return new Vector2(n*v.x, n*v.y);
  }
  Vector2 scalar(float n) {
    return new Vector2(n*x, n*y);
  }

  void mult(float n) {
    x*=n;
    y*=n;
  }

  static Vector2 divide(float n, Vector2 v) {
    return new Vector2(v.x/n, v.y/n);
  }
  Vector2 divide(float n) {
    return new Vector2(x/n, y/n);
  }

  void division(float n) {
    x/=n;
    y/=n;
  }
  Vector2 rotated(float a) {
    float newx=cos(a)*x-sin(a)*y;
    float newy=sin(a)*x+cos(a)*y;
    return new Vector2(newx, newy);
  }

  void rotate(float a) {
    float newx=cos(a)*x-sin(a)*y;
    float newy=sin(a)*x+cos(a)*y;
    x=newx;
    y=newy;
  }
  void translate(Vector2 p) {
    x+=p.x;
    y+=p.y;
  }

  float getLengthSquare() {
    return x*x+y*y;
  }
  float getLength() {
    return sqrt(getLengthSquare());
  }
  Vector2 getUnitVector() {
    return this.divide(getLength());
  }
  void normalize() {
    this.division(getLength());
  }

  float dot(Vector2 v) {
    return x*v.x+y*v.y;
  }

  float projectOntoLength(Vector2 v) {
    float a=this.dot(v)/v.getLengthSquare();
    return a;
  }
  Vector2 projectOnto(Vector2 v) {
    return v.scalar(this.projectOntoLength(v));
  }
  Vector2 getNormal() {
    return new Vector2(-x, y);
  }
  void println() {
    print("x : "+x+" y : "+y+"\n");
  }
  void set(Vector2 v){
    x=v.x;
    y=v.y;
  }

}

class Transform{
  Vector2 position;
  Vector2 oriented;
  float angle;
  Vector2 scale;
  Transform(){
    position=new Vector2();
    angle=0;
    oriented=new Vector2(cos(angle),sin(angle));
    scale=new Vector2(1,1);
  }
  void setPosition(Vector2 p){
    position.x=p.x;
    position.y=p.y;
  }
  void setOriented(float a){
    angle=a;
    oriented=new Vector2(cos(angle),sin(angle));    
  }
  void setScale(Vector2 s){
    scale.x=s.x;
    scale.y=s.y;
  }
  
  Vector2 getPosition(){
    return position.copy();
  }
  Vector2 getOriented(){
    return oriented.copy();
  }
  Vector2 getScale(){
    return scale.copy();
  }
  

}


boolean pnpoly(float x, float y,Box b) {
  
  boolean c=false;  
    for (int i=0, j=b.realvertex.length-1; i<b.realvertex.length; j=i++) {
      if (((b.realvertex[i].y>y)!=(b.realvertex[j].y>y))&&(x<(b.realvertex[j].x-b.realvertex[i].x)*(y-b.realvertex[i].y)/(b.realvertex[j].y-b.realvertex[i].y)+b.realvertex[i].x)) {
        c=!c;
      }
    }
    b.touch=c; 
    return c; 
  
}

void mousePressed() {
  for (Box b : boxes) {
      if (b.touch) b.drags=true;
      break;
    
  }
}

void mouseReleased() {
  for (Box b : boxes) {
      b.drags=false;
      break;   
  }
}