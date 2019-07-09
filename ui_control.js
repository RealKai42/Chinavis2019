function stop_button() {
    if (timer.isActive) {
        timer.pause();
        $('#stop_button').val("Start");
    } else {
        timer.play();
        $('#stop_button').val("Stop");
    }

}
function change_mode(bool) {
    // if(!person_bool)
    // {
    //     //切换到person
    //     $('#person_button').val("All");
    //     person_bool = true;
    //     timer.pause();
    //
    //     if(p_timer) {
    //         p_timer.pause();
    //     }
    //     let id = parseInt($('#id_num').val());
    //     draw_person(id);
    //
    // }else
    // {
    //     // 切换到所有人模式
    //     $('#person_button').val("Person");
    //     person_bool = false;
    //
    //     p_timer.pause();
    //
    //     time = p_time;
    //     timer.play();
    // }

    person_bool = bool;

}


function change_time() {

    time = parseInt($('#time_range').val());
    $('#show_time').html(formatTime(time));
    $('#show_second').html(time);
    draw();
}
function adjust_speed()
{

    timer.pause();
    let speed = parseInt($('#speed_num').val());
    timer.set({ time : 1000/speed, autostart : false });
    timer.play();

}
function change_id()
{

    let id = parseInt($('#id_num').val());
    draw_person(id);
    draw();
}

// colormap函数
function enforceBounds(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1){
        return 1;
    } else {
        return x;
    }
}
function interpolateLinearly(x, values) {

    // Split values into four lists
    var x_values = [];
    var r_values = [];
    var g_values = [];
    var b_values = [];
    for (i in values) {
        x_values.push(values[i][0]);
        r_values.push(values[i][1][0]);
        g_values.push(values[i][1][1]);
        b_values.push(values[i][1][2]);
    }

    var i = 1;
    while (x_values[i] < x) {
        i = i+1;
    }
    i = i-1;

    var width = Math.abs(x_values[i] - x_values[i+1]);
    var scaling_factor = (x - x_values[i]) / width;

    // Get the new color values though interpolation
    var r = r_values[i] + scaling_factor * (r_values[i+1] - r_values[i])
    var g = g_values[i] + scaling_factor * (g_values[i+1] - g_values[i])
    var b = b_values[i] + scaling_factor * (b_values[i+1] - b_values[i])

    return [enforceBounds(r), enforceBounds(g), enforceBounds(b)];

}

function show_number()
{
    if(show_number_bool)
    {
        show_number_bool = false;
        $('#show_number').val("Number: off");
        draw();
    }else
    {
        show_number_bool = true;
        $('#show_number').val("Number: on");
        draw();
    }
}

function show_heatmap()
{
    if(show_heatmap_bool)
    {
        show_heatmap_bool = false;
        $('#show_heatmap').val("Heatmap: off");
        draw();
    }else
    {
        show_heatmap_bool = true;
        $('#show_heatmap').val("Heatmap: on");
        draw();
    }
}

function show_all()
{
    if(all_bool)
    {
        all_bool = false;
        $('#all_button').val("All: off");
        draw();
    }else
    {
        all_bool = true;
        $('#all_button').val("All: on");
        draw();
    }
}

function show_person()
{
    if(person_bool)
    {
        person_bool = false;
        $('#person_button').val("Person: off");
        draw();
    }else
    {
        person_bool = true;
        $('#person_button').val("Person: on");
        draw();
    }
}

function show_only()
{
    if(show_only_bool)
    {
        show_only_bool = false;
        $('#show_only').val("show_only: off");
        draw();
    }else
    {
        show_only_bool = true;
        $('#show_only').val("show_only: on");
        draw();
    }
}
function show_weak()
{
    if(show_weak_bool)
    {
        show_weak_bool = false;
        $('#show_weak').val("show_weak: off");
        draw();
    }else
    {
        show_weak_bool = true;
        $('#show_weak').val("show_weak: on");
        draw();
    }
}

function click_init()
{
    let c = canvas;
    c.onmousedown = onClick1;
    c.onmousemove = onMove1;
    c.onmouseup = onUp1;

    c = canvas2;
    c.onmousedown = onClick2;
    c.onmousemove = onMove2;
    c.onmouseup = onUp2;

}

function onClick1(e) {

    do_click(canvas, ctx, e);
}
function onMove1(e)
{
    do_move(canvas, ctx, e);
}

function onUp1(e)
{
    do_up(canvas, ctx, e, 1);
}

function onClick2(e) {
    do_click(canvas2, ctx2, e);

}
function onMove2(e)
{
    do_move(canvas2, ctx2, e);
}

function onUp2(e)
{
    do_up(canvas2, ctx2, e, 2);
}

function do_click(canvas, ctx, e)
{
    const rect = canvas.getBoundingClientRect();
    const x = parseInt((e.clientX - rect.left) * 2);
    const y = parseInt((e.clientY - rect.top) * 2);
    startX = x;
    startY = y;
    draw_rect_flag = true;
}

function do_move(canvas, ctx, e)
{
    const rect = canvas.getBoundingClientRect();
    const x = parseInt((e.clientX - rect.left) * 2);
    const y = parseInt((e.clientY - rect.top) * 2);
    if(draw_rect_flag)
    {
        let width = Math.abs(startX - x);
        let height = Math.abs(startY - y);
        draw(false);
        draw_rect(ctx, "#ff0000", 2, startX, startY, width, height);
    }

}

function do_up(canvas, ctx, e, floor)
{
    const rect = canvas.getBoundingClientRect();
    const x = parseInt((e.clientX - rect.left) * 2);
    const y = parseInt((e.clientY - rect.top) * 2);
    let start_x = parseInt(startX / cell_pixel);
    let start_y = parseInt(startY / cell_pixel);
    let end_x = parseInt(x / cell_pixel);
    let end_y = parseInt(y / cell_pixel);

    let choose_box = [];
    draw(false);
    for(let x=start_x; x<=end_x; x++)
    {
        for(let y=start_y; y<=end_y; y++)
        {
            let box = floor.toString() + pad(y) + pad(x);
            box = parseInt(box);
            choose_box.push(box);
            draw_fill_rect(ctx, "rgba(157, 206, 233,0.4)", x*cell_pixel, y*cell_pixel, cell_pixel, cell_pixel);
        }
    }

    get_list_boxs(choose_box);
    draw_rect_flag = false;
    draw(false);
}


function draw_rect(ctx, color, line_width, x, y, width, height)
{
    // 画空矩形的通用方法
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = line_width;
    ctx.rect(x, y, width, height);
    ctx.stroke();
}
function draw_fill_rect(ctx, color, x, y, width, height)
{
    // 画填充矩形的通用方法
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, width, height);
    ctx.closePath();
    ctx.fill();
}

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function get_list_boxs(box_list)
{
    let p_list = [];
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
                let id = person[day_draw][i][0];
                if( box_list.indexOf(sid) !== -1)
                {
                    p_list.push(id);
                }
                break;
            }
        }
    }
    add_tag_to_list(p_list,parseInt($('#tag_select').children('option:selected').val()));
    return p_list;
}

function add_tag_to_list(p_list, tag)
{
    // let html = "";
    // for(let i=0; i<p_list.length;i++)
    // {
    //     html += p_list[i];
    //     html += ",";
    // }
    // $('#tag'+tag+' .add').html(html);

    for(let i=0; i<p_list.length; i++)
    {
        tag_list[p_list[i]] = tag;
    }
    refresh_tag_list();
}

function refresh_tag_list()
{
    let html=[];
    for(let i=0; i<7; i++)
    {
        html[i] = "";
    }

    for(let i in tag_list)
    {

        html[tag_list[i]] += i;
        html[tag_list[i]] += ",";

    }

    for(let i=0; i<7;i++)
    {
        $('#tag'+i+' .add').html(html[i]);
    }
}

function init_tag_div()
{
    $('#tag_div').html('');
    for(let i=0; i<tag_color.length; i++)
    {
        $('#tag_div').append("<div id=\"tag"+i+"\">\n" +
            "    <label>tag"+i+":</label>\n" +
            "    <div class=\"color-lump\" style='background-color:"+tag_color[i]+"'></div>\n" +
            "    <a class=\"add\" style=' word-wrap:break-word; '></a>\n" +
            "</div>")
    }
}

var hexToRgb = function(hex) {
    var rgb = [];

    hex = hex.substr(1);//去除前缀 # 号

    if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
        hex = hex.replace(/(.)/g, '$1$1');
    }

    hex.replace(/../g, function(color){
        rgb.push(parseInt(color, 0x10));//按16进制将字符串转换为数字
    });

    // 返回的是rgb数组
    return rgb;
};
function clear_all_tag()
{
    tag_list = [];
    init_tag_div();
    draw();
}

function do_tag()
{
    let text = $('#ids').val();
    let tag = parseInt($('#tag_select2').children('option:selected').val());
    let list = text.split(',');
    for(let i=0; i<list.length; i++)
    {
        if(list[i])
        {
            tag_list[parseInt(list[i])] = tag;
        }

    }
    refresh_tag_list();
    draw();
}


















