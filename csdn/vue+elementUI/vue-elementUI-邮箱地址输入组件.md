# vue-elementUI-邮箱地址输入组件

Email.vue

```vue
<template>
  <div class="email-box" ref="email-box">
    <el-tag
        :key="tag"
        size="mini"
        style="margin-right: 2px;margin-bottom: 1px;"
        type="info"
        v-for="tag in activeList"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input
        style="width: 180px;"
        size="mini"
        v-model="email"
        ref="saveTagInput"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
        placeholder="请输入邮箱"
    >
    </el-input>
  </div>
</template>

<script>
import { isEmail } from './utils'
export default {
  name: 'Email2',
  props: {
    activeList: Array
  },
  model: {
    prop: 'activeList',
    event: 'valueEvent'
  },
  created () {
  },
  data () {
    return {
      emailList: [],
      inputVisible: false,
      email: ''
    }
  },
  computed: {},
  mounted () {
    this.$refs['email-box'].onclick = function () {
      this.classList.add('email-box--active')
      const input = this.querySelector('input')
      input.focus()

      input.onblur = () => {
        this.classList.remove('email-box--active')
      }
    }
  },
  methods: {
    handleClose (tag) {
      this.activeList.splice(this.activeList.indexOf(tag), 1)
    },

    handleInputConfirm () {
      if (this.email === '') {
        return false
      }
      // 在main.js文件中全局引入了lodash，Vue.prototype._ = _ 所以在这可以直接用
      const email = this._.trim(this.email).replace(/(;$)|(；$)/g, '')

      const is = (n) => {
        return this._.some(this.activeList, v => v === n)
      }

      if (isEmail(email)) {
        if (!is(email)) {
          this.activeList.push(email)
          this.email = ''
        } else {
          this.$message.warning('邮箱已存在')
        }
      } else {
        this.$message.warning('邮箱格式非法')
      }
    }
  },
  watch: {
    activeList (val) {
      // 触发父组件中valueEvent事件，把emailList上传
      this.$emit('valueEvent', val)
    }
  }
}
</script>

<style lang="scss">
  .email-box{
    display: flex;
    margin-top: 4px;
    padding: 1px;
    flex-wrap: wrap;
    border-radius: 5px;
    box-sizing: border-box;
    align-items: center;
    border: 1px solid #d9d9d9;
    min-height: 32px;
    cursor: text;
    &:hover{
      border-color: #bfbfbf;
    }
    div.el-input.el-input--mini {
      height: 28px;
    }
    .el-input__inner{
      border: none!important;
    }
  }
  .email-box--active{
    border-color: #268DFF!important;
  }
</style>

```

utils.js文件中有isEmail方法

```js
export const isEmail = (val) => {
  let regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/
  return regEmail.test(val)
}

```

