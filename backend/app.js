const express = require('express');
const app = express();
const port = 10040;
const flag = "flag{I_saw_a_ufo_yesterday}";
let global_token = 100;
const map = new Map();
const user = new Map();

function rand100(){
	//	return 50;
	return Math.floor(Math.random()*100);
}

function getToken(){
	return global_token++;	
}

function getNode(num_to_guess, cur_num, prev){
	node = {
		num_to_guess: num_to_guess,
		cur_num		: cur_num,
		prev		: prev
	};
	
	return node;
}

// 生成复盘
function generateReview(node){
	let stack = [];
	while (!(typeof node === "string")) { 
		stack.push(node);
		node = node.prev;
	}
	const t = user.get(node)+1;
	console.log(node, t);
	user.set(node, t);
	let ans = ["游戏开始，你的用户名为"+node+"，已经通关了"+t+"次游戏"];
	if (t != 10){
		ans.push("如果通关10次游戏，即可获得flag");
	} else {
		ans.push(flag);
	}
	let i = 1;
	while (stack.length){
		node = stack.pop();
		ans.push("第 "+i+" 回合")
		ans.push("被猜数字为 "+node.num_to_guess);
		ans.push("你猜的是 "+node.cur_num);
		if (node.cur_num < node.num_to_guess){
			ans.push("你猜小了");
		} else if (node.cur_num > node.num_to_guess){
			ans.push("你猜大了");
		} else {
			ans.push("你猜中了");
		}
		i++;
	}
	return ans.join('<br>');
}

function checkInput(str){
	const num = parseInt(str, 10);
	if (isNaN(num)){
		return -1;
	}
	if (num >=0 && num < 100){
		return num;
	} else {
		return -1;
	}
}


function processGame(token, input){
	token = Number(token);
	let message = "";
	do{
		if (token == 0){
			// new game
			token = getToken();
			let node = getNode(rand100(), -1, input);
			map.set(token, node);
			
			// set user
			if (user.get(input) == undefined){
				user.set(input, 0);
			}
	
			return [token, "猜数游戏开始，请输入0-99之间的数字。\n该游戏每一回合都有10%的几率替换被猜数字。\n同一个用户名通关10次即可获得flag。\n您的用户名为"+input];
		}
		input = checkInput(input);
		if (input == -1){
			message = "输入不合法，请重新输入";
			break;
		}

		let num_to_guess = node.num_to_guess;
		node.cur_num = input;
		if (input != num_to_guess){
			if (input < num_to_guess){
				message = "你猜小了";
			} else if (input > num_to_guess) {
				message = "你猜大了";
			}
			if (rand100() < 10){
				num_to_guess = rand100();
			}
			let new_node = getNode(num_to_guess, -1, node);
			map.set(token, new_node);
		} else {
			message = "你猜中了，以下是复盘内容<br>" + generateReview(node);
			map.delete(token);
			token = 0;
		}
	}while(0);
	return [token, message];
}

app.post('/guess_number', (req, res) => {
	const token = req.query.message_id;
	const input = req.query.input;
	console.log(token, input);
	recv = processGame(token, input);
	const s = 	JSON.stringify({
		message_id: recv[0],
		message: recv[1] 
	});
	console.log(s);
	res.send(s);
});

app.listen(port, ()=> {
	console.log('Server is running on http://localhost:${port}');	
})






