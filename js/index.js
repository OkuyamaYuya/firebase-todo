// データベースの参照を準備
var todoRef = firebase.database().ref('tests/')

// URLリンク先タイトルの取得および書き換え
function rewrite (q, key, todo_) {
  const domain = "13.113.236.74"
  // const domain = "localhost:8080"
  const url = "http://"+domain+"/api/title?url="+q.href
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.onreadystatechange = function () {
    if (request.readyState != 4) {
      console.log('リクエスト中')
    } else if (request.status != 200) {
      // 失敗
      console.log('タイトル取得に失敗')
    } else {
      // 取得成功
      var title = request.responseText;
      console.log('成功')
      console.log(q, title)
      q.msg = title
      firebase.database().ref('tests/'+key).set(q)
      todo_.msg = title
    }
  }
  request.send(null)
}


angular.module('myApp', ['ngTouch'])
.controller('TodoCtrl', ['$scope',
                         '$timeout',
                         'filterFilter',
function($scope, $timeout, filterFilter){
  // 初期化
  $scope.todos = []

  // 既存TODOを取得
  // TODOが追加されるとリッスン
  todoRef.on('child_added', function(data) {
    console.log('add!!', data.val())
    $scope.todos.push( { key: data.key, msg: data.val().msg, completed: false, href: data.val().href } )
    $scope.update()
  })

  // timeoutを用いて更新
  $scope.update = function(){
    $timeout(function() {
      $scope.todos = $scope.todos
    }, 1000)
  }
  $scope.update()

  // 削除
  $scope.removeTodo = function(index, todo){
      console.log('delete!!', todo)
      firebase.database().ref('tests/'+todo.key).remove()
      $scope.todos.splice(index, 1)
  }

  // 追加
  $scope.addTodo = function(){
    // 新規TODOを投稿
    // Firebaseへpush
    // Firebaseが更新されると、リッスン
    var flag = false
    if ($scope.newtodo.match('http')) {
      q = { msg: $scope.newtodo, href: $scope.newtodo }
      flag = true
    } else {
      q = { msg: $scope.newtodo, href: null }
    }
    var key = todoRef.push(q).key
    $scope.newtodo = ""
    if (flag) {
      console.log('-->', key)
      var todos = $scope.todos
      rewrite(q, key, todos[todos.length-1])
    }
  }


  // 編集
  $scope.editTodo = function(todo){
    console.log('edit!!', todo)
    // Firebaseを更新
    // 画面上のtodo.msgはAngularが更新してくれてる
    if (todo.href != null) {
      q = { msg: todo.msg, href: todo.href }
    } else {
      q = { msg: todo.msg, href: null}
    }
    firebase.database().ref('tests/'+todo.key).set(q)
    todo.editing = false;
  }

}])
