let person = [];
let sensor = [];
let person_data =[]; // [是否已分配位置, 楼层, 分配的格子, 位置x, 位置y, active_time]

let canvas;
let ctx;
let canvas2;
let ctx2;

let cell_pixel = 60;
let cwidth = 1800;
let cheight = 960;

let time = 25000;
let timer;

let stay_time = 200; // 一个人经过多少秒会变成静止色
let init_spped = 250;

// 标记绘制的哪一天
let day_draw = 0;

let draw_pos = -1;  //记录正在绘制的person

// let oldPosition = []; // [是否已分配位置, 楼层, 位置x, 位置y] 用在个人绘制上

let person_bool = false; // 是否在绘制个人
let all_bool = true; //是否绘制全体
let show_number_bool = false;
let show_heatmap_bool = false;
let show_only_bool = false;
let show_weak_bool = false;
let heat_map_max = 100;

let tag_list = [];

let startX = 0, startY = 0; // 矩形选择开始坐标
// let endX = 0, endY = 0;
let draw_rect_flag = false;

let tag_color = ['#f08633', '#fffd54', '#71fa4c', '#00aee6', '#6a30af','#00d1b2', '#ed008c'];


// for(let i in tag_list)
// {
//     if(tag_list[i] === 1)
//     {
//         let out = false;
//         for(let j=0; j<person[0].length; j++)
//         {
//             if(i == person[0][j][0])
//             {
//                 out = true;
//             }
//         }
//         if(out)
//         {
//             console.log(i)
//         }
//     }
// }
//
//
//
// for(let j=0; j<person[0].length; j++)
// {
//     console.log(person[0][j][0]);
// }
//







