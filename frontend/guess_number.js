


var message_id = 0;
var message;


function sendMessage() {
    const backendUrl = "http://47.95.31.91:10040/guess_number"

    // 从输入框获取用户输入
    var message_input = document.getElementById('message-input');
    var message = message_input.value.trim();

    if (message == "") {
        return;
    }
    message_input.value = "";

    const params = new URLSearchParams({
        message_id: message_id,
        input: message
    });

    // 发送信息到后端
    fetch(backendUrl+`?${params.toString()}`, {
        method: 'post',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,

        headers: {
                'Content-Type': 'form-data',
        }
    }).then(response => {
        if (!response.ok){
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        console.log(data);
        message_id = data.message_id;
        // TODO: 这儿谁爱弄谁弄吧
        // 显示服务器返回的消息

    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    })
}

document.getElementById('message-input').addEventListener('keypress', function (e){
    if (e.key == 'Enter') {
        sendMessage();
    }
})
