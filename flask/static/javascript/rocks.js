rock_id_counter = 0;
live_rocks = [];

class rock{
    counter = 0;
    constructor(){
        //super();
        this.damage = 10;
        this.x = 500;
        this.y = 0;
        this.size = 50;
        this.speed = 1;
        this.id = rock_id_counter;
        this.alive = true;

        rock_id_counter += 1;

        this.body = document.createElement('button');
        this.body.classList.add('rock');
        this.body.id = this.id.toString();
        document.body.append(this.body);
        live_rocks.push(this);
        //console.log("created new missile iwth id: ",missile_id_counter, live_missiles);
    }
}



function update_loop(){
    for(let i = 0; i < live_missiles.length; i++) {
        var m = live_missiles[i];
        if(m.alive == false){
            continue;
        }
        m.lived += step / 1000;
        if(m.lived >= m.lifetime){
            m.alive = false;
            continue;
        }

        var ma = (mousey - m.y) / (mousex - m.x);
        var ma2 = (mousex - m.x) / (mousey - m.y);
        var pythag = Math.sqrt((mousey - m.y) ** 2 + (mousex - m.x) ** 2);
        //console.log(pythag);
        if(pythag < 10){
            m.alive = false;
            continue;
        }

        m.body.innerText = parseInt(m.lifetime - m.lived).toString();

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
    }

}

setInterval(() => {
    var new_rock_list = [];
    for(let i = 0; i < live_rocks.length; i++){
        if(live_rocks[i].alive == true){
            new_rock_list.push(live_rock[i]);
        }else{
            destroy_missile(live_rock[i]);
        }
    }
    live_rocks = new_rock_list;
    update_loop();
},
 10)