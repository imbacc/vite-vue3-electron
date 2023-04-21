<template>
  <div>
    <a href="javascript:history.back(-1)">返回上一页</a>
    <div>action</div>
    <button @click="test_api_get_test">
      请求 test_api/get_test
    </button>
    <button @click="test_api_get_test222">
      请求 test_api/get_test222
    </button>
    <button @click="test_api_get_test333">
      请求 test_api/get_test333
    </button>
    <!-- <button @click="app_111">
    请求 app_111
  </button>
  <button @click="app_222">
    请求 app_222
  </button>
  <button @click="app_333">
    请求 app_333
  </button>
  <button @click="app_444">
    请求 app_444
  </button>
  <button @click="app_555">
    请求 app_555
  </button>
  <button @click="app_666">
    请求 app_666
  </button>
  <button @click="user_get_user">
    请求 user/get_user
  </button>
  <button @click="error_msg">
    发个错误请求显示
  </button> -->
    <hr>
    <button @click="all_request">
      给我一起请求
    </button>
  </div>
</template>

<script setup lang="ts">
const api = (...args: any) => {
  console.log('%c [ args ]-45', 'font-size:14px; background:#41b883; color:#ffffff;', args)
}
// api('https://www.baidu.com', { _onec: true, wd: 'vite2vue3' }, {}, 'GET') // 外链请求
const test_api_get_test = () => getTest() // 请求test_api. 里的 get_test
const test_api_get_test222 = () => getTest222(222) // 请求test_api 里的 get_test222
const test_api_get_test333 = () => getTest333({ is: 'param1111' }, { body: '我是body1111' }) // 请求test_api 里的 get_test222
// const app_111 = () => api('app_111')
// const app_222 = () => api('app_222', { _id: 222 })
// const app_333 = () => api('app_333', { _id: 333 })
// const app_444 = () => api('app_444')
// const app_555 = () => api('app_555')
// const app_666 = () => api('app_666', { _id: 666 }, { body: '这是POST请求,我是body' })
// const user_get_user = () => getUser()
// const error_msg = () => api('error')

const test1 = async () => {
  const res = await getTest333({ is: 'param2222' }, { body: '我是body2222' })
  console.log('%c [ res.test ]-60', 'font-size:14px; background:#41b883; color:#ffffff;', res)
}

test1()

const all_request = () => {
  const all: Array<Function> = [
    test_api_get_test,
    test_api_get_test222,
    test_api_get_test333,
    // app_111,
    // app_222,
    // app_333,
    // app_444,
    // app_555,
    // app_666,
    // user_get_user,
  ]
  const pro: Array<Promise<any>> = []
  all.forEach((request) => pro.push(request()))
  Promise.allSettled(pro).then((res) => setTimeout(() => console.log('Promise.allSettled=', res), 10))
}
</script>