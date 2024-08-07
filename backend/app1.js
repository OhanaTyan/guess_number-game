const express = require('express');
const app = express();
const port = 10040;

const map = new Map();

function rand100(){
	return Math.floor(Math.random()*100);
}

function getRandomInt(){
	const min = 1;
	const max = 1000000000;
	return Math.floor(Math.random()*(max-min+1))+min;
}

// generate new game
function generateGameToken(){
	while (true) {
		const token = getRandomInt();
		if (map.get(token) == undefined){
			map.set(token, -1);
			return token;
		} else {
			continue;
		}	
	}
}


function generateGame(){
	const token = generateGameToken();
	map.set(token, rand100());
	return JSON.stringify({
		message_id: token,
		message: "猜数游戏开始，请输入0-99之间的数字。\n该游戏每一回合都有10%的几率替换被猜数字"
	});	
}

function checkInput(str) {
	// 将字符串转换为数字
	const num = parseInt(str, 10);
	// 检查是否为NaN（非数字）
	if (isNaN(num)) {
		return -1;
	}

	// 检查是否在0到100之间（不包括100）
	if (num >= 0 && num < 100) {
		return num;
	}else {
		return -1;
	}
}

function processGame(message_id, input){
	message_id = Number(message_id);
	if (message_id == 0){
		return generateGame();
	} 
	var message = "";
	var number_to_be_guess = map.get(message_id);
	// process message_id first
	if (number_to_be_guess == undefined){
		message = "游戏已被删除，可能是因为等待时间过长或内部错误";
	} else {
		map.delete(message_id);
		message_id = getRandomInt();
		// check input
		const num = checkInput(input);
		if (num == -1){
			message = "输入不合法，请重新输入";
		} else {
			// input is valid
			if (num == number_to_be_guess){
				message = "你猜中了，游戏结束";
				message_id = 0;
			} else{
				if (num > number_to_be_guess){
					message = "你猜大了";
				} else {
					message = "你猜小了";
				}
				if (rand100() < 10){
					number_to_be_guess = rand100();
				}
			} 
		}
	}
	if (message_id != 0){
		map.set(message_id, number_to_be_guess);
	}
	console.log("message_id:"+message_id+", number_to_be_guess:"+number_to_be_guess);
	return JSON.stringify({
		message_id: message_id,
		message: message
	});
}





app.post('/guess_number', (req, res) => {
/*	const input = req.query.input;
	if (input){
		res.send(input);
		console.log(input);
	} else {
		// res.status(400).send('Missing input parameter');
		res.send("Input needed");
	}*/
	const message_id = req.query.message_id;
	const input = req.query.input;
	const next_message_id = message_id;
	const reply = input;
/*	res.send(JSON.stringify({
		message_id: next_message_id,
		reply:	reply
	}));
	*/
	console.log('message_id:'+message_id+', input:'+input);
	json_string = processGame(message_id, input);
	console.log(json_string);
	res.send(json_string);
});


app.listen(port, () => {
		console.log('Server is running on http://localhost:${port}');
});

