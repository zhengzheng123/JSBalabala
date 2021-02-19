# vue-elementUI-表格列循环的优缺点

## 基础写法

```js
<template>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </template>
<script>
    export default {
      data() {
        return {
          tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
        }
      }
    }
  </script>
```

这种写法就是有多少列，就要写多少个el-table-column标签，代码量和重复率比较高

## 循环写法

```js
<template>
    <el-table
        :data="tableData"
        style="width: 100%"
    >
      <el-table-column
          v-for="(item,index) in columns"
          :key="index"
          v-bind="{...item}"
      >
      </el-table-column>
    </el-table>
</template>
<script>
export default {
  data () {
    return {
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },
  computed: {
    columns () {
      return [
        { prop: 'date', label: '日期', width: '180' },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址', width: '180' }
      ]
    }
  }
}
</script>
```

columns放在计算属性中可以缓存下来，相当于静态变量

## 进阶

```js
<template>
    <el-table
        :data="tableData"
        style="width: 100%"
    >
      <el-table-column
          v-for="(item,index) in columns"
          :key="index"
          v-bind="{...item}"
      >
              <!-- 自定义表头 -->
              <template slot="header"  slot-scope="scope">
                  <span v-if="['date','name'].includes(item.prop)">*</span>
				  {{item.label}}
              </template>
              <!-- 自定义内容 -->
              <template  slot-scope="scope">
                  <span v-if="item.prop==='name'">我是</span>
				  {{scope.row[item.prop]}}
              </template>
      </el-table-column>
    </el-table>
</template>
<script>
export default {
  data () {
    return {
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },
  computed: {
    columns () {
      return [
        { prop: 'date', label: '日期', width: '180' },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址', width: '180' }
      ]
    }
  }
}
</script>
```

可以看到，如果有很多自定义需求，循环列这种写法就会有很多判断，维护起来不那么直观，此时就不如基础写法，在每一列中自定义当前列，那样看起来就很直观。
