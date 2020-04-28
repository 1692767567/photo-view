var db
var indexDB = {
  init: function (userId) {
    // 检测浏览器是否支持indexedDB,获取IDBFactory
    var factory = window.indexedDB ||
        window.webkitIndexedDB ||
        window.mozIndexedDB ||
        window.msIndexedDB

    if (!factory) {
      console.log('你的浏览器不支持IndexedDB')
    }

    /* localStorage中获取数据库的版本号 */
    var version = localStorage.getItem('indexedDB_version')
    if (version) {
      version = parseFloat(version) + 1
    } else {
      version = 1
    }

    localStorage.setItem('indexedDB_version', version)
    var request = factory.open('photo', version)

    // 成功打开数据库后执行该函数
    request.onsuccess = function (e) {
      db = e.target.result
      console.log('成功打开DB')
    }

    // 初始化数据库
    request.onupgradeneeded = function (e) {
      db = e.target.result
      var objectStore
      // 创建聊天列表
      if (!db.objectStoreNames.contains('session')) {
        objectStore = db.createObjectStore('session', {
          keyPath: 'id',
          autoIncrement: true
        })
        // 给userId创建索引，userId为用户id
        objectStore.createIndex('userId', 'userId', { unique: false })
      }

      if (!db.objectStoreNames.contains('content' + userId)) {
        objectStore = db.createObjectStore('content' + userId, {
          keyPath: 'id',
          autoIncrement: true
        })
        // 给sessionId创建索引，sessionId为会话id，sessionId来源于session表
        objectStore.createIndex('sessionId', 'sessionId', { unique: false })
        objectStore.createIndex('toId', 'toId', { unique: false })
        objectStore.createIndex('fromId', 'fromId', { unique: false })
      }
    }
  },
  // 获取当前用户的所有会话
  getUserAllSession: function (userId, sessionList) {
    // 如果数据库还未打开，就调用init进行打开数据库
    if (!db) {
      this.init()
    }
    // 创建事务
    var transaction = db.transaction(['session'], 'readonly')
    // 获取objectStore，相当于数据库表
    var session = transaction.objectStore('session')
    // 使用userId这个索引
    var index = session.index('userId')
    // 查询userId等于传入的userId的记录
    // var request = index.get(userId)
    sessionList.splice(0)
    var request = index.openCursor(userId)
    // 把所有查询到的记录放入sessionList
    request.onsuccess = function (e) {
      var cursor = e.target.result
      if (cursor) {
        sessionList.push(cursor.value)
        cursor.continue()
      }
    }
  },
  // 添加会话
  insertSession: function (session, sessionList, currendList, callback) {
    var transaction = db.transaction(['session'], 'readwrite')
    var objectStore = transaction.objectStore('session')
    // 把数据添加到objectStore
    var request = objectStore.add(session)
    // 监听添加成功事件，添加成功之后执行
    request.onsuccess = function (e) {
      // 查询出来刚才插入的数据，添加到sessionList中
      // 把所有查询到的记录放入sessionList
      var queryRequest = objectStore.get(e.target.result)
      queryRequest.onsuccess = function (e) {
        sessionList.push(e.target.result)
        currendList.splice(0)
        for (var value of sessionList) {
          currendList.push(value)
        }
        callback(e.target.result.id)
      }
    }
  },
  // 更新会话
  updateSession: function (session) {
    // 如果数据库还未打开，就调用init进行打开数据库
    if (!db) {
      this.init()
    }

    var transaction = db.transaction(['session'], 'readwrite')
    var objectStore = transaction.objectStore('session')
    objectStore.put(session)
  },

  // 获取一个会话的所有聊天内容
  getSessionContext: function (sessionId, userId, contentArr) {
    var transaction = db.transaction(['content' + userId], 'readonly')
    var objectStore = transaction.objectStore('content' + userId)
    var index = objectStore.index('sessionId')
    var request = index.openCursor(sessionId)
    request.onsuccess = function (e) {
      var cursor = e.target.result
      if (cursor) {
        contentArr.push(cursor.value)
        cursor.continue()
      }
    }
  },
  // 添加会话内容
  insertSessionContent: function (content, contentArr, session, isThisMessage) {
    // 添加聊天内容
    var transaction1 = db.transaction(['content' + content.userId], 'readwrite')
    var contentStore = transaction1.objectStore('content' + content.userId)
    var contentRequest = contentStore.add(content)
    contentRequest.onsuccess = function (e) {
      var queryRequest = contentStore.get(e.target.result)
      queryRequest.onsuccess = function (e) {
        if (isThisMessage) {
          contentArr.push(e.target.result)
        }
      }
    }

    // 修改会话
    var transaction2 = db.transaction(['session'], 'readwrite')
    var objectStore = transaction2.objectStore('session')
    objectStore.put(session)
  },
  // 接受好友发过来的信息
  receiveMessage: function (content, contentArr, sessionList, currentSession) {
    // 与此时发信息的好友的会话是否存在
    var session = sessionList.find(function (value) {
      if (value && content.fromId === value.friendId) {
        return true
      }
    })

    // 判断发信息的好友是否是当前聊天的好友
    var isThisMessage = currentSession && content.fromId === currentSession.friendId

    if (session) { // 存在
      content.sessionId = session.id
      if (content.isRead === 1) {
        session.unreadCount = session.unreadCount + 1
      }
      session.lastContent = content.message
      session.lastDate = content.createTime
      this.insertSessionContent(content, contentArr, session, isThisMessage)
    } else { // 还未存在
      // 创建会话记录
      var transaction2 = db.transaction(['session'], 'readwrite')
      var editSessionStore = transaction2.objectStore('session')
      session = {}
      session.unreadCount = content.isRead === 1 ? 1 : 0
      session.userId = content.toId
      session.friendId = content.fromId
      session.friendPhoto = content.fromPhoto
      session.lastContent = content.message
      session.frinedName = content.fromRemark
      session.lastDate = content.createTime
      var editSessionRequest = editSessionStore.add(session)

      editSessionRequest.onsuccess = function (e) {
        var sessionId = e.target.result

        transaction2 = db.transaction(['session'], 'readwrite')
        editSessionStore = transaction2.objectStore('session')
        var editSessionRequest2 = editSessionStore.get(sessionId)
        editSessionRequest2.onsuccess = function (e) {
          sessionList.push(e.target.result)
        }

        // 创建聊天内容记录
        var transaction1 = db.transaction(['content' + content.userId], 'readwrite')
        var editContentStore = transaction1.objectStore('content' + content.userId)
        content.sessionId = sessionId
        var editContentRequest = editContentStore.add(content)
        editContentRequest.onsuccess = function (e) {
          transaction1 = db.transaction(['content' + content.userId], 'readwrite')
          editContentStore = transaction1.objectStore('content' + content.userId)
          var queryContentRequest = editContentStore.get(e.target.result)
          queryContentRequest.onsuccess = function (e) {
            if (isThisMessage) {
              contentArr.push(e.target.result)
            }
          }
        }
      }
    }
  },
  // 进入页面把后端发送过来的未读消息加载进来
  receiveUnreadMessage: function (content, sessionList, user, isLast) {
    // 拿到指向当前对象的引用
    var _this = this

    // 开启一个读写事务，范围覆盖content +
    var transaction1 = db.transaction(['content' + content.userId], 'readwrite')
    var transaction2 = db.transaction(['session'], 'readwrite')
    var querySessionIndex = transaction2.objectStore('session').index('userId')
    var querySessionRequest = querySessionIndex.openCursor(content.userId)

    querySessionRequest.onsuccess = function (e) {
      var cursor = e.target.result
      if (cursor) {
        // 说明已经存在该好友的会话
        if (cursor.value.friendId === content.fromId) {
          transaction1 = db.transaction(['content' + content.userId], 'readwrite')
          var editContentStore = transaction1.objectStore('content' + content.userId)
          content.sessionId = cursor.value.id
          var editContentRequest = editContentStore.add(content)

          // 会话未读消息+1,更新会话表
          transaction2 = db.transaction(['session'], 'readwrite')
          var editSessionStore1 = transaction2.objectStore('session')
          cursor.value.unreadCount += 1
          editSessionStore1.put(cursor.value)

          // 如果是最后一条未读消息，就加载会话列表
          if (isLast) {
            editContentRequest.onsuccess = function (e) {
              _this.getUserAllSession(content.userId, sessionList)
            }
          }
        } else {
          // 开始遍历下一跳记录
          cursor.continue()
        }
      } else {
        // 能执行到这步，说明并没有该好友的会话
        // 先创建一个会话
        transaction2 = db.transaction(['session'], 'readwrite')
        var editSessionStore = transaction2.objectStore('session')
        var session = { unreadCount: 1 }
        session.userId = content.toId
        session.friendId = content.fromId
        session.friendPhoto = content.fromPhoto
        session.lastContent = content.message
        session.frinedName = content.fromRemark
        session.lastDate = content.createTime
        var editSessionRequest = editSessionStore.add(session)

        editSessionRequest.onsuccess = function (e) {
          var sessionId = e.target.result
          transaction1 = db.transaction(['content' + content.userId], 'readwrite')
          var editContentStore = transaction1.objectStore('content' + content.userId)
          content.sessionId = sessionId
          var editContentRequest = editContentStore.add(content)

          // 如果是最后一条未读消息，就加载会话列表
          if (isLast) {
            editContentRequest.onsuccess = function (e) {
              _this.getUserAllSession(content.userId, sessionList)
            }
          }
        }
      }
    }
  },
  // 更新好友头像
  updateFriendPhoto: function (session, contentArr) {
    // 更新会话
    this.updateSession(session)
    // 更新所有的有关换头像好友的聊天记录
    var objectStore = db.transaction(['content' + session.userId], 'readwrite').objectStore('content' + session.userId)
    var index = objectStore.index('fromId')
    index.openCursor(function (e) {
      var cursor = e.target.result
      if (cursor) {
        var value = cursor.value
        value.fromPhoto = session.friendPhoto
        // 更新聊天记录
        objectStore.put(value)
      }
    })
  },
  setContentRead: function (session, user) {
    session.unreadCount = 0
    // 更新会话表
    db.transaction(['session'], 'readwrite').objectStore('session').put(session)
    var index = db.transaction(['content' + user.userId], 'readwrite').objectStore('content' + user.userId).index('sessionId')
    var request = index.openCursor(session.id)

    request.onsuccess = function (e) {
      var cursor = e.target.result
      if (cursor) {
        var value = cursor.value
        value.isRead = 0
        db.transaction(['content' + user.userId], 'readwrite').objectStore('content' + user.userId).put(value)

        cursor.continue()
      }
    }
  }
}

export default indexDB
