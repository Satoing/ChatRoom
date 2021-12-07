// 1.连接socketio服务
var socket = io('http://localhost:3000')
var username, avatar
var toName = '群聊'

// 2.登录功能
$('#login_avatar li').on('click', function() {
    $(this).addClass('now').siblings().removeClass('now')
})

// 3.点击按钮，登录
$('#loginBtn').on('click', function() {
    // 获取用户名
    var username = $('#username').val().trim()
    var password = $('#password').val().trim()
    if (!username) {
        alert('请输入用户名')
        return
    }
    if (username === '群聊') {
        window.alert('用户名已存在')
        return
    }
    if (password !== 'qwerty') {
        window.alert('密码错误')
        return;
    }
    // 获取选择的头像
    var avatar = 'images/avatar01.JPG'
    console.log(username, avatar)
        // 需要告诉socket io服务，登录
    socket.emit('login', {
        username,
        avatar
    })
})

// 4.监听登录失败的请求
socket.on('loginError', data => {
    window.alert('用户名已存在')
})

// 5.监听登录成功的请求
socket.on('loginSuccess', data => {
    console.log('登录成功')
        // 登录成功
        // 隐藏登录窗口
        // $('.login_box').fadeOut()
    $('.login_box').hide()
        // 显示聊天窗口
    $('.container').fadeIn()
        // 设置个人信息
    $('.user-list .header img').attr('src', data.avatar)
    $('.user-list .header .username').text(data.username)

    username = data.username
    avatar = data.avatar
})

// 6.监听添加用户的消息
socket.on('addUser', data => {
    // 添加一条系统消息
    $('.box-bd').append(`
    <div class="system">
      <p class="message_system">
        <span class="content">${data.username} 上线了</span>
      </p>
    </div>
  `)
    scrollIntoView()
})

// 7.监听用户离开的消息
socket.on('delUser', data => {
    // 添加一条系统消息
    $('.box-bd').append(`
    <div class="system leave">
      <p class="message_system">
        <span class="content">${data.username} 下线了</span>
      </p>
    </div>
  `)
    scrollIntoView()
})

// 8.监听用户列表的消息
socket.on('userList', data => {
    // 把userlist
    $('.user-list ul').html('')
    $('.user-list ul').append(`
    <li class="user">
      <div class="avatar"></div>
      <div class="name"></div>
    </li>
  `)
    data.forEach(item => {
        $('.user-list ul').append(`
      <li class="user">
        <div class="avatar"><img src="${item.avatar}" alt=""></div>
        <div class="name">${item.username}</div>
      </li>
    `)
    })
    $('#userCount').text(data.length)
    clickUser()
})

// 9.监听接收聊天消息
socket.on('receiveMessage', data => {
    console.log('收掉消息', data)
    if (data.toName === '群聊') {
        if (username === data.username) {
            // 自己的消息
            $('.box-bd').append(`
        <div class="message-box">
          <div class="my message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
              </div>
            </div>
          </div>
        </div>
      `)
        } else {
            // 别人的消息
            $('.box-bd').append(`
        <div class="message-box">
          <div class="other message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="nickname">${data.username}</div>
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
              </div>
            </div>
          </div>
        </div>
      `)
        }
    } else {
        if (username === data.username) {
            // 自己的消息
            $('.box-bd').append(`
        <div class="message-box">
          <div class="my message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
                <div class="bubble_toName">私聊</div>
              </div>
            </div>
          </div>
        </div>
      `)
        } else {
            // 别人的消息
            $('.box-bd').append(`
        <div class="message-box">
          <div class="other message">
            <img src="${data.avatar}" alt="" class="avatar">
            <div class="nickname">${data.username}</div>
            <div class="content">
              <div class="bubble">
                <div class="bubble_cont">${data.msg}</div>
                <div class="bubble_toName">私聊</div>
              </div>
            </div>
          </div>
        </div>
      `)
        }
    }
    scrollIntoView()
})

// 10.当有消息时，将滑动到底部
function scrollIntoView() {
    // 当前元素的底部滚动到可视区
    $('.box-bd').children(':last').get(0).scrollIntoView(false)
}

// 11.群聊功能
$('#btn-send').on('click', () => {
    var content = $('#content').html().trim()
    $('#content').html('')
    if (!content) {
        return window.alert('请输入内容')
    }
    if (toName === '群聊') {
        // 发送消息给服务器
        socket.emit('sendMessage', {
            msg: content,
            username,
            avatar,
            toName
        })
    }
    // else {
    //     // 发送私聊消息给服务器
    //     socket.emit('sendMessageToOne', {
    //         msg: content,
    //         username,
    //         avatar,
    //         toName: toName
    //     })
    // }
})