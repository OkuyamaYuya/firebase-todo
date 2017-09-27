// データベースの参照を準備
var todoRef = firebase.database().ref('tests/')
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
    if ($scope.newtodo.match('http')) {
      q = { msg: $scope.newtodo, href: $scope.newtodo }
    } else {
      q = { msg: $scope.newtodo, href: null }
    }
    todoRef.push(q)
    $scope.newtodo = ""
  }

  // 編集
  $scope.editTodo = function(todo){
      console.log('edit!!', todo)
      // Firebaseを更新
      // 画面上のtodo.msgはAngularが更新してくれてる
      firebase.database().ref('tests/'+todo.key).set({
        msg: todo.msg
      })
      todo.editing = false;
  }
}])
