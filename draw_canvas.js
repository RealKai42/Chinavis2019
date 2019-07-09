
window.onload = function () {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas2 = document.getElementById('canvas2');
    ctx2 = canvas2.getContext('2d');

    //快捷键
    // document.onkeydown = function (e) {
    //     if (e.keyCode === 68) {
    //         $('#stop_button').click(); // d
    //     }
    // };

    $(document).keydown(function(e){
        if(e.which === 68  && !e.ctrlKey) {
            $('#stop_button').click(); // d
        }

        if(e.which === 65 && !e.ctrlKey)
        {
            $('#all_button').click(); // a
        }

        if(e.which === 78 && !e.ctrlKey)
        {
            $('#show_number').click(); // n
        }

        if(e.which === 72 && !e.ctrlKey)
        {
            $('#show_heatmap').click(); // h
        }

        if(e.which === 80 && !e.ctrlKey)
        {
            $('#person_button').click(); // p
        }

        if(e.which === 67 && !e.ctrlKey)
        {
            // $('#clear_button').click(); // c
        }

        if(e.which === 79 && !e.ctrlKey)
        {
            $('#show_only').click(); // o
        }

        if(e.which === 87 && !e.ctrlKey)
        {
            $('#show_weak').click(); // w
        }

        if(e.which === 84 && !e.ctrlKey)
        {
            $('#do_tag').click(); // t
        }

        if(e.altKey && (e.which >= 48 && e.which<= 54)) {
            $('#tag_select').val(e.which-48);
        }

    });


    // 给select 加响应函数
    $('#day_select').change(function()
    {
        day_draw = parseInt($(this).children('option:selected').val()) - 1;
        person_bool = false;
        draw();
    });
    click_init();
    init_tag_div();
    init();

};


function init() {
    // 初始化timer, 每次调用draw
    timer = $.timer(draw);
    timer.set({time: 1000/init_spped, autostart: false});

    for(let i = 10000; i<20000; i++)
    {
        person_data[i] = [false];
    }
    console.log("开始读取数据");
    // 读取各个数据
    Papa.parse("data/day1_id.csv", {
        download: true,
        dynamicTyping: true,
        complete: function (results) {
            // 读取day1
            person[0] = [];
            for (let i = 0; i < results.data.length; i++) {
                person[0].push(results.data[i]);
            }
            console.log("Day1 读取完毕");

            // 读取day2
            Papa.parse("data/day2_id.csv", {
                download: true,
                dynamicTyping: true,
                complete: function (results) {

                    person[1] = [];
                    for (let i = 0; i < results.data.length; i++) {
                        person[1].push(results.data[i]);
                    }
                    console.log("Day2 读取完毕");

                    // 读取day3
                    Papa.parse("data/day3_id.csv", {
                        download: true,
                        dynamicTyping: true,
                        complete: function (results) {

                            person[2] = [];
                            for (let i = 0; i < results.data.length; i++) {
                                person[2].push(results.data[i]);
                            }
                            console.log("Day3 读取完毕");

                            // 读取位置信息
                            Papa.parse("data/location.csv", {
                                download: true,
                                dynamicTyping: true,
                                complete: function (results) {
                                    for (let i = 0; i < results.data.length; i++) {
                                        sensor[results.data[i][0]] = [results.data[i][3], results.data[i][2], results.data[i][1]];
                                    }
                                    console.log("传感器信息读取完毕");
                                    timer.play();
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function drawPoint(id, sid, static_bool) {

    let circle_size = 6;
    let rgb_c = hexToRgb('#ec3323');
    let active_color = "rgba("+rgb_c[0]+","+rgb_c[1]+","+rgb_c[2]+","+1+")";
    let static_color = "rgba("+rgb_c[0]/2 +","+rgb_c[1]/2 +","+rgb_c[2]/2 +","+1+")";

    if((!person_data[id][0] || person_data[id][2] !==sid))
    {
        // 未分配位置
        let rect = sensor[sid];
        let x0 = rect[0] * cell_pixel + parseInt(Math.random() * (cell_pixel + 1), 10);
        let y0 = rect[1] * cell_pixel + parseInt(Math.random() * (cell_pixel + 1), 10);

        person_data[id][0] = true;
        person_data[id][2] = sid;
        person_data[id][3] = x0;
        person_data[id][4] = y0;

        if(tag_list[id] !== undefined && tag_list[id] !== -1)
        {
            let rgb = hexToRgb(tag_color[tag_list[id]]);
            active_color = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+1+")";
            if(show_only_bool && parseInt($('#show_select').children('option:selected').val()) !== -1)
            {
                if(tag_list[id] !== parseInt($('#show_select').children('option:selected').val()))
                {
                    return;
                }
            }
        }else if(show_only_bool)
        {
            return;
        }

        if(show_weak_bool && (tag_list[id] === undefined || tag_list[id] === -1))
        {
            active_color = "rgba("+rgb_c[0]+","+rgb_c[1]+","+rgb_c[2]+","+0.2+")";
        }

        if (rect[2] === 1) {
            person_data[id][1] = 1;
            ctx.beginPath();
            ctx.arc(x0, y0, circle_size, 0, 360, false);
            ctx.fillStyle = active_color;
            ctx.fill();
            ctx.closePath();
        } else {
            person_data[id][1] = 2;
            ctx2.beginPath();
            ctx2.arc(x0, y0, circle_size, 0, 360, false);
            ctx2.fillStyle = active_color;
            ctx2.fill();
            ctx2.closePath();
        }
    }else
    {
        if(tag_list[id] !== undefined && tag_list[id] !== -1)
        {
            let rgb = hexToRgb(tag_color[tag_list[id]]);
            active_color = "rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+1+")";
            // static_color = "rgba("+rgb[0]/2 +","+rgb[1]/2 +","+rgb[2]/2 +","+1+")";

            if(show_only_bool && parseInt($('#show_select').children('option:selected').val()) !== -1)
            {
                if(tag_list[id] !== parseInt($('#show_select').children('option:selected').val()))
                {
                    return;
                }
            }
        }else if(show_only_bool)
        {
            return;
        }

        if(show_weak_bool && (tag_list[id] === undefined || tag_list[id] === -1))
        {
            active_color = "rgba("+rgb_c[0]+","+rgb_c[1]+","+rgb_c[2]+","+0.2+")";
            // let static_color = "rgba("+rgb_c[0]/2 +","+rgb_c[1]/2 +","+rgb_c[2]/2 +","+0.2+")";
        }

        let ctx_c;
        // 已分配位置，直接画
        if(person_data[id][1] === 1)
        {
            ctx_c = ctx;

        }else
        {
            ctx_c = ctx2;
        }

        // 已分配位置，直接画

        if(!static_bool)
        {
            // 运动中的人
            ctx_c.beginPath();
            ctx_c.fillStyle = active_color;
            circle_size = 6;
            ctx_c.arc(person_data[id][3], person_data[id][4], circle_size, 0, 360, false);
            ctx_c.fill();
            ctx_c.closePath();
        }else
        {
            // 静态的人
            ctx_c.beginPath();
            ctx_c.fillStyle = active_color;
            circle_size = 4;
            ctx_c.lineWidth = 1;
            ctx_c.strokeStyle = "rgba(0,0,0,0.5)";

            ctx_c.arc(person_data[id][3], person_data[id][4], circle_size, 0, 360, false);
            ctx_c.fill();
            ctx_c.stroke();
            ctx_c.closePath();
        }

    }
}
function draw_time(time) {
    // 画time秒的图
    ctx.clearRect(0, 0, cwidth, cheight);
    ctx2.clearRect(0, 0, cwidth, cheight);
    drawmap1();
    drawmap2();

    if(show_number_bool || show_heatmap_bool)
    {
        var number_array = [];
        for(let i in sensor)
        {
            number_array[i] = 0;
        }
    }


    // 遍历需要画的那一天的所有人
    for (let i = 0; i < person[day_draw].length; i++) {
        // 对于每一个人，遍历所有时间
        for (let j = 2; j < person[day_draw][i].length; j += 2) {
            if (person[day_draw][i][j] > time) {
                // id, sid
                if(j === 2)
                {
                    break;
                }
                // id sid
                let sid = person[day_draw][i][j - 3];
                if(all_bool)
                {
                    let time_now = person[day_draw][i][j - 2];
                    let static_bool = false;
                    if(time - time_now > stay_time)
                    {
                        static_bool = true;
                    }
                    drawPoint(person[day_draw][i][0], sid, static_bool);
                }
                if(show_number_bool || show_heatmap_bool)
                {
                    number_array[sid] += 1;
                }
                break;
            }
        }
    }

    if(show_number_bool)
    {
        draw_number(number_array);
    }

    if(show_heatmap_bool)
    {
        draw_heatmap(number_array);
    }

}

function draw(time_plus = true) {
    if (time > 73000) {
        timer.pause();
    }
    //格式化时间，并且更新到标签
    $('#show_time').html(formatTime(time));
    //更新到时间轴
    $('#time_range').val(time);
    $('#show_second').html(time);

    ctx.clearRect(0, 0, cwidth, cheight);
    ctx2.clearRect(0, 0, cwidth, cheight);
    drawmap1();
    drawmap2();

    if(all_bool || show_heatmap_bool || show_number_bool)
        draw_time(time);
    if(person_bool && draw_pos !== -1)
        draw_p_time(time);

    if(time_plus)
    {
        time += 1;
    }
}

function draw_person(id)
{
    // 查找需要画的id的pos
    let length = person[day_draw].length;
    for(let i=0; i<length; i++) {
        if (id === person[day_draw][i][0])
        {
            draw_pos = i;
            break;
        }
        if(i === length-1)
        {
            draw_pos = -1;
        }
    }

    if(!person_bool)
    {
        person_bool = true;
    }

    if(draw_pos === -1 )
    {
        alert("不存在该人");
        person_bool = false;
    }
}
function draw_p_time(time)
{

    let pos = draw_pos;
    let rect1, rect2;
    let first = person[day_draw][pos][2]; // 记录一个人第一次出现的时间

    let shift = 0.5 * cell_pixel;

    for(let i=2; i<person[day_draw][pos].length; i+=2)
    {

        // 绘制所有小于或等于当前时间的时间节点
        if (person[day_draw][pos][i] <= time) {

            // 未分配位置
            if(i === 2)
            {
                // 绘制起点
                rect1 = sensor[person[day_draw][pos][i-1]];
                let x0 = rect1[0] * cell_pixel + 0.5 * cell_pixel;
                let y0 = rect1[1] * cell_pixel + 0.5 * cell_pixel;

                // 起点只可能在一楼
                ctx.beginPath();
                ctx.arc(x0, y0, 10, 0, 360, false);
                ctx.fillStyle = "rgba(256,0,0,1)";
                ctx.fill();
                ctx.closePath();
            }else
            {
                // 绘制其他情况的箭头
                let x0, y0, x1, y1;
                let cor1 = person[day_draw][pos][i-3];
                let cor2 = person[day_draw][pos][i-1];
                rect1 = sensor[cor1]; //上一个位置
                rect2 = sensor[cor2]; //目前的位置

                x0 = rect1[0] * cell_pixel + shift;
                y0 = rect1[1] * cell_pixel + shift;

                x1 = rect2[0] * cell_pixel + shift;
                y1 = rect2[1] * cell_pixel + shift;

                if(rect1[2] === rect2[2])
                {
                    // 如果位于同一楼层
                    let ratio = ((person[day_draw][pos][i] - first) / (time - first) ) * 0.8 + 0.2;
                    let color = interpolateLinearly(ratio, YlOrRd);
                    let arrow_headlen = 0;
                    if(time - person[day_draw][pos][i] <200 || (person[day_draw][pos][i+2] && person[day_draw][pos][i+2] > time))
                    {
                        arrow_headlen = 15;
                    }

                    let arrow_color = 'rgb('+Math.round(color[0]*255)+','+Math.round(color[1]*255)+','+Math.round(color[2]*255)+')';
                    if(rect1[2] === 1)
                    {
                        drawArrow(ctx, x0, y0, x1, y1, 30, arrow_headlen, 3 , arrow_color);
                    }else
                    {
                        drawArrow(ctx2, x0, y0, x1, y1, 30, arrow_headlen, 3 , arrow_color);
                    }
                }

            }
        }
    }

}



function draw_number(array)
{
    for(let i in array)
    {
        let floor = parseInt(i/10000);
        let x = (i % 10000) % 100;
        let y = parseInt((i % 10000) / 100);

        if(floor === 1)
        {
            ctx.fillStyle = "#0000ff";
            ctx.font="20px Georgia";
            ctx.fillText(array[i], (x + 0.4) * cell_pixel, (y + 0.9) * cell_pixel);
        }else
        {
            ctx2.fillStyle = "#0000ff";
            ctx2.font="20px Georgia";
            ctx2.fillText(array[i], (x +0.4) * cell_pixel, (y + 0.9) * cell_pixel);
        }
    }

}

function draw_heatmap(array) {
    for(let i in array)
    {
        let floor = parseInt(i/10000);
        let x = (i % 10000) % 100;
        let y = parseInt((i % 10000) / 100);
        let draw_warn = false;
        let color_value;
        if(array[i] > heat_map_max)
        {
            color_value = 1;
            draw_warn = true;

        }else
        {
            color_value = array[i] / heat_map_max;
        }

        let rectangle_color;
        let color=interpolateLinearly(color_value,Reds);

        if (color_value===0){
            rectangle_color='rgba('+255+','+255+','+255+','+0+')';
        }
        else{rectangle_color = 'rgba('+Math.round(color[0]*255)+','+Math.round(color[1]*255)+','+Math.round(color[2]*255)+','+0.5+')';}

        if(floor === 1)
        {
            ctx.fillStyle = rectangle_color;  //填充颜色
            ctx.fillRect(x * cell_pixel, y * cell_pixel, cell_pixel, cell_pixel);
            if(draw_warn)
            {
                ctx.fillStyle = "rgba(0,0,0,0.8)";
                ctx.font = "50px Georgia";
                ctx.fillText('!', (x+0.4) * cell_pixel, (y+1) * cell_pixel);
            }


        }else
        {
            ctx2.fillStyle = rectangle_color;  //填充颜色
            ctx2.fillRect(x * cell_pixel, y * cell_pixel, cell_pixel, cell_pixel);
            if(draw_warn)
            {
                ctx2.fillStyle = "rgba(0,0,0,0.8)";
                ctx2.font = "50px Georgia";
                ctx2.fillText('!', (x+0.4) * cell_pixel, (y+1) * cell_pixel);
            }
        }
    }
}

function formatTime(time)
{
    let hour = Math.floor(time / 3600);
    let min = Math.floor((time % 3600) / 60);
    let second = Math.floor((time % 3600) % 60);
    if(hour <= 9)
    {
        hour = '0' + hour
    }
    if(min <= 9)
    {
        min = '0' + min
    }
    if(second <= 9)
    {
        second = '0' + second
    }

    return hour + ' : ' + min + ' : ' + second;
}
function drawmap1() {
    let pre_alpha = ctx.globalAlpha;
    // ctx.globalAlpha = 0.3;

    let grid_cols=30;
    let grid_rows=16;
    let cell_height=canvas.height/grid_rows;
    let cell_width=canvas.width/grid_cols;
    let cell_pix=cell_height;

    // ctx.fillStyle = '#F5F5F5';
    // ctx.fillRect(0, 0, cwidth, cheight);

    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";
    ctx.font = "36pt Arial";
    //结束边框描绘
    ctx.beginPath();
    //准备画横线
    for(let col=0;col<=grid_cols;col++)
    {
        let x=col*cell_width;
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
    }
    //准备画竖线
    for(let row=0;row<=grid_rows;row++)
    {
        let y=row*cell_height;
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width,y);
    }



    ctx.fillStyle = "#d1cfd2";  //填充颜色
    ctx.fillRect(0*cell_pix,0*cell_pix,30*cell_pix,1*cell_pix);
    ctx.fillRect(0*cell_pix,2*cell_pix,1*cell_pix,10*cell_pix);
    ctx.fillRect(29*cell_pix,1*cell_pix,1*cell_pix,15*cell_pix);
    ctx.fillRect(0*cell_pix*cell_pix,15*cell_pix,2*cell_pix,1*cell_pix);
    ctx.fillRect(3*cell_pix,15*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(6*cell_pix,15*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(8*cell_pix,15*cell_pix,7*cell_pix,1*cell_pix);
    ctx.fillRect(16*cell_pix,15*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(18*cell_pix,15*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(0*cell_pix,12*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(0*cell_pix,14*cell_pix,1*cell_pix,1*cell_pix);
    ctx.fillRect(12*cell_pix,2*cell_pix,3*cell_pix,10*cell_pix);
    ctx.fillRect(1*cell_pix,10*cell_pix,5*cell_pix,2*cell_pix);


    //上墙
    ctx.fillRect(0*cell_pix,1*cell_pix,10*cell_pix,1*cell_pix);

    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(19*cell_pix,0*cell_pix,1*cell_pix,1*cell_pix);








//海报区
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(158,183,214)";

    ctx.fillRect(7*cell_pix,3*cell_pix,2*cell_pix,7*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(7*cell_pix,3*cell_pix,2*cell_pix,7*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("海报区",7*cell_pix,7*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";







    //分会场A
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.fillRect(1*cell_pix,2*cell_pix,5*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,2*cell_pix,5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("分会场A",2*cell_pix,3.5*cell_pix,5*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";


    //分会场B
    ctx.globalAlpha = 0.3;
    ctx.fillRect(1*cell_pix,4*cell_pix,5*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,4*cell_pix,5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("分会场B",2*cell_pix,5.5*cell_pix,5*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //分会场C
    ctx.globalAlpha = 0.3;
    ctx.fillRect(1*cell_pix,6*cell_pix,5*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,6*cell_pix,5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("分会场C",2*cell_pix,7.5*cell_pix,5*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //分会场D
    ctx.globalAlpha = 0.3;
    ctx.fillRect(1*cell_pix,8*cell_pix,5*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,8*cell_pix,5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("分会场D",2*cell_pix,9.5*cell_pix,5*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //签到处
    ctx.globalAlpha = 0.3;
    ctx.fillRect(2*cell_pix,12*cell_pix,4*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(2*cell_pix,12*cell_pix,4*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("签到处",2.8*cell_pix,13.3*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //厕所1
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,4*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,4*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("厕所1",10*cell_pix,5.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //room1
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,6*cell_pix,2*cell_pix,4*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,6*cell_pix,2*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room1",10*cell_pix,8.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //room2
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,10*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,10*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room2",10*cell_pix,11.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //展厅
    ctx.globalAlpha = 0.3;
    ctx.fillRect(15*cell_pix,2*cell_pix,4*cell_pix,10*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(15*cell_pix,2*cell_pix,4*cell_pix,10*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("展厅",16*cell_pix,7.5*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //主会场
    ctx.globalAlpha = 0.3;
    ctx.fillRect(19*cell_pix,2*cell_pix,10*cell_pix,10*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(19*cell_pix,2*cell_pix,10*cell_pix,10*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("主会场",22.5*cell_pix,7.5*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //服务台
    ctx.globalAlpha = 0.3;
    ctx.fillRect(19*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(19*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("服务台",19*cell_pix,15.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //room3
    ctx.globalAlpha = 0.3;
    ctx.fillRect(21*cell_pix,14*cell_pix,4*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(21*cell_pix,14*cell_pix,4*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room3",22*cell_pix,15.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //room4
    ctx.globalAlpha = 0.3;
    ctx.fillRect(25*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(25*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room4",25*cell_pix,15.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //厕所2
    ctx.globalAlpha = 0.3;
    ctx.fillRect(27*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(27*cell_pix,14*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("厕所2",27*cell_pix,15.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //扶梯
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.fillRect(10*cell_pix,1*cell_pix,2*cell_pix,1*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,1*cell_pix,2*cell_pix,1*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("扶梯",10.2*cell_pix,1.8*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //扶梯
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,14*cell_pix,2*cell_pix,1*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,14*cell_pix,2*cell_pix,1*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("扶梯",10.2*cell_pix,14.8*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";



    ctx.stroke();
    //上箭头
    ctx.globalAlpha = 0.3;
    drawArrow(ctx, 2.5*cell_pix, 16*cell_pix, 2.5*cell_pix,15*cell_pix,20,0.3*cell_pix,10,'#FEB743');
    drawArrow(ctx, 4.5*cell_pix, 16*cell_pix, 4.5*cell_pix,15*cell_pix,20,0.3*cell_pix,10,'#FEB743');
    drawArrow(ctx, 7.5*cell_pix, 16*cell_pix, 7.5*cell_pix,15*cell_pix,20,0.3*cell_pix,10,'#FEB743');

    drawArrow(ctx, 19.5*cell_pix, 1.3*cell_pix, 19.5*cell_pix,0.3*cell_pix,20,0.3*cell_pix,10,'#FEB743');

    //下箭头
    drawArrow(ctx, 5.5*cell_pix, 14.7*cell_pix, 5.5*cell_pix,15.7*cell_pix,20,0.3*cell_pix,10,'#FEB743');
    drawArrow(ctx, 15.5*cell_pix, 14.7*cell_pix, 15.5*cell_pix,15.7*cell_pix,20,0.3*cell_pix,10,'#FEB743');
    drawArrow(ctx, 17.5*cell_pix, 14.7*cell_pix, 17.5*cell_pix,15.7*cell_pix,20,0.3*cell_pix,10,'#FEB743');


    //右箭头
    drawArrow(ctx, 0*cell_pix, 13.5*cell_pix, 1*cell_pix,13.5*cell_pix,20,0.3*cell_pix,10,'#FEB743');

    ctx.globalAlpha = pre_alpha;
}
function drawmap2() {
    let ctx = ctx2;

    let pre_alpha = ctx.globalAlpha;


    let grid_cols=30;
    let grid_rows=16;
    let cell_height=canvas.height/grid_rows;
    let cell_width=canvas.width/grid_cols;
    let cell_pix=cell_height;
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";
    ctx.font = "36pt Arial";
    //结束边框描绘
    ctx.beginPath();
    //准备画横线
    for(let col=0;col<=grid_cols;col++)
    {
        let x=col*cell_width;
        ctx.moveTo(x,0);
        ctx.lineTo(x,canvas.height);
    }
    //准备画竖线
    for(let row=0;row<=grid_rows;row++)
    {
        let y=row*cell_height;
        ctx.moveTo(0,y);
        ctx.lineTo(canvas.width,y);
    }



    ctx.fillStyle = "#d1cfd2";  //填充颜色
    ctx.fillRect(0*cell_pix,0*cell_pix,30*cell_pix,16*cell_pix);



    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(1*cell_pix,2*cell_pix,11*cell_pix,6*cell_pix);
    ctx.fillRect(1*cell_pix,8*cell_pix,9*cell_pix,4*cell_pix);
    ctx.fillRect(6*cell_pix,12*cell_pix,4*cell_pix,3*cell_pix);
    ctx.fillRect(10*cell_pix,12*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillRect(0*cell_pix,13*cell_pix,6*cell_pix,3*cell_pix);







//餐厅
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(158,183,214)";

    ctx.fillRect(1*cell_pix,2*cell_pix,5*cell_pix,8*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,2*cell_pix,5*cell_pix,8*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("餐厅",2.8*cell_pix,6.5*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";







    //room5
    ctx.globalAlpha = 0.3;
    ctx.fillRect(1*cell_pix,10*cell_pix,5*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(1*cell_pix,10*cell_pix,5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room5",2.5*cell_pix,11.2*cell_pix,4*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";


    //休闲区
    ctx.globalAlpha = 0.3;
    ctx.fillRect(0*cell_pix,13*cell_pix,6*cell_pix,3*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(0*cell_pix,13*cell_pix,6*cell_pix,3*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("休闲区",1.8*cell_pix,15*cell_pix,5*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //厕所3
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,4*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,4*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("厕所3",10*cell_pix,5.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //room6
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,6*cell_pix,2*cell_pix,2*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,6*cell_pix,2*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("room6",10*cell_pix,7.5*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(158,183,214)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";




    //扶梯
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.fillRect(10*cell_pix,1*cell_pix,2*cell_pix,1*cell_pix);
    ctx.globalAlpha = pre_alpha;

    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,1*cell_pix,2*cell_pix,1*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("扶梯",10.2*cell_pix,1.8*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    //扶梯
    ctx.globalAlpha = 0.3;
    ctx.fillRect(10*cell_pix,14*cell_pix,2*cell_pix,1*cell_pix);
    ctx.globalAlpha = pre_alpha;


    ctx.lineWidth=2;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.strokeRect(10*cell_pix,14*cell_pix,2*cell_pix,1*cell_pix);
    ctx.fillStyle = "rgb(1,1,1)";
    ctx.fillText("扶梯",10.2*cell_pix,14.8*cell_pix,2*cell_pix);
    ctx.fillStyle = "rgb(254,183,67)";
    ctx.lineWidth=1;
    ctx.strokeStyle="#a0a0a0";

    ctx.stroke();

    ctx.globalAlpha = pre_alpha;

}
function drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, width, color) {


    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';

    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);

    ctx.save();
    ctx.beginPath();

    let arrowX = fromX - topX,
        arrowY = fromY - topY;

    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}





