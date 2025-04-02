
var live_missiles = [];
var mousex = 1;
var mousey = 1;
var step = 10;


class missile{
    constructor(){
        this.damage = 10;
        this.x = 500;
        this.y = 0;
        this.speed = 1;

        this.body = document.createElement('button');
        this.body.classList.add('missile');
        document.body.append(this.body);
        live_missiles.push(this);

    }
}

new missile();


function mousepos(p){
    //console.log('Position X : ' + p.pageX + '<br />Position Y : ' + p.pageY);
    mousex = p.pageX;
    mousey = p.pageY;
}

addEventListener('mousemove', mousepos, false);

function update_loop(){
    live_missiles.forEach((m) => {
        var ma = (mousey - m.y) / (mousex - m.x);
        var ma2 = (mousex - m.x) / (mousey - m.y);
        var pythag = Math.sqrt((mousey - m.y) ** 2 + (mousex - m.x) ** 2);
        //console.log(pythag);
        if(pythag < 10){
            ma = 1;
            m.speed = 0;
            m.body.remove();
            if(live_missiles.includes(m) == true){
                for(let i = 0; i < live_missiles.length; i++){
                    if(live_missiles[i] == m){
                        live_missiles.pop(i);
                        console.log('Destroyed Missile', live_missiles);
                    }
                }
            }
            delete m;
        }
        //console.log(ma == NaN);
        if(ma != NaN && ma != Infinity && ma != -Infinity && ma != null){
            var tan = Math.tanh(ma);
            var tan2 = Math.tanh(ma2);
            var x_move = 1;
            if(mousex < m.x){tan = tan * -1;
                x_move = -1;
            }
            if(mousey < m.y){
                tan2 = tan2 * -1;
            }

            //console.log(tan);
            
            var x = (m.x + (m.speed * tan2));
            var y = (m.y + (m.speed  * tan));
    
            m.x = x;
            m.y = y;
    
            m.body.style.left = `${x}px`;
            m.body.style.top = `${y}px`;
            
        }
    })

}

setInterval(() => {
    update_loop();
},
 step)