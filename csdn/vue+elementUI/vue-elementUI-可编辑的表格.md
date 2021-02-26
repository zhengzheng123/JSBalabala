# vue-elementUI-可编辑的表格


表格上绑定的事件参考elementUI官方文档：https://element.eleme.io/#/zh-CN/component/table
## 场景一：整行编辑

鼠标移入单元格的时候，单元格所在行中所有可编辑的单元格全部进入编辑状态。

vue组件

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 100%"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isEdit" class="item" v-model="scope.row.date" placeholder="请输入内容"></el-input>
          <div v-else class="txt">{{scope.row.date}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <el-input v-if="scope.row.isEdit" class="item" v-model="scope.row.name" placeholder="请输入内容"></el-input>
          <div v-else class="txt">{{scope.row.name}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Batch',
  data () {
    return {
      // 表格数据
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        isEdit: false
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
        isEdit: false
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        isEdit: false
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
        isEdit: false
      }]
    }
  },
  methods: {
    /** 鼠标移入cell */
    handleCellEnter (row, column, cell, event) {
      row.isEdit = true
    },
    /** 鼠标移出cell */
    handleCellLeave (row, column, cell, event) {
      row.isEdit = false
    }
  }
}
</script>

<style lang='scss'>
  .item{
    width: 100px;
    /* 调整elementUI中样式 如果不需要调整请忽略 */
    .el-input__inner{
      height: 24px!important;
    }
  }
  .txt{
    line-height: 24px;
    padding: 0 9px;
    box-sizing: border-box;
  }
</style>

```

演示截图

![SDGIF_Rusult_1](C:\Users\liz-q\Desktop\闪电GIF制作软件\SDGIF_Rusult_1.gif)



## 场景二：当前单元格可编辑

鼠标移入单元格的时候，当前单元格进入编辑状态，本行的其他单元格不受影响。

vue组件

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 600px"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180">
        <div class="item" slot-scope="scope">
          <el-input class="item__input" v-model="scope.row.date" placeholder="请输入内容"></el-input>
          <div class="item__txt">{{scope.row.date}}</div>
        </div>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
        <div class="item" slot-scope="scope">
          <el-input class="item__input" v-model="scope.row.name" placeholder="请输入内容"></el-input>
          <div class="item__txt">{{scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column
        prop="food"
        label="食物">
        <div class="item" slot-scope="scope">
          <el-select class="item__input" v-model="scope.row.food" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="item__txt">{{foodLabel(scope.row.food)}}</div>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Batch',
  data () {
    return {
      // 下拉选项
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      // 表格数据
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        food: '选项5'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        food: '选项5'
      }],
      // 需要编辑的属性
      editProp: ['date', 'name', 'food']
    }
  },
  computed: {
    foodLabel () {
      return (val) => {
        return this.options.find(o => o.value === val).label
      }
    }
  },
  methods: {
    /** 鼠标移入cell */
    handleCellEnter (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        cell.querySelector('.item__input').style.display = 'block'
        cell.querySelector('.item__txt').style.display = 'none'
      }
    },
    /** 鼠标移出cell */
    handleCellLeave (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        cell.querySelector('.item__input').style.display = 'none'
        cell.querySelector('.item__txt').style.display = 'block'
      }
    }
  }
}
</script>

<style lang='scss'>
  .item{
    .item__input{
      display: none;
      width: 100px;
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__inner{
        height: 24px!important;
      }
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__suffix{
        i{
          font-size: 12px !important;
          line-height: 26px !important;
        }
      }
    }
    .item__txt{
      box-sizing: border-box;
      line-height: 24px;
      padding: 0 9px;
    }
  }
</style>

```

演示截图

![SDGIF_Rusult_2](C:\Users\liz-q\Desktop\闪电GIF制作软件\SDGIF_Rusult_2.gif)



## 场景三：点击进入编辑

鼠标移入当前单元格，显示可以编辑的样式，单击进入编辑状态，编辑完成点击保存，本行编辑状态消失。适用于单行数据保存。

vue组件

```vue
<template>
  <div>
    <el-table
      :data="tableData"
      size="mini"
      style="width: 600px"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
      @cell-click="handleCellClick"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="180">
        <div class="item" slot-scope="scope">
          <el-input class="item__input" v-model="scope.row.date" placeholder="请输入内容"></el-input>
          <div class="item__txt">{{scope.row.date}}</div>
        </div>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
        <div class="item" slot-scope="scope">
          <el-input class="item__input" v-model="scope.row.name" placeholder="请输入内容"></el-input>
          <div class="item__txt">{{scope.row.name}}</div>
        </div>
      </el-table-column>
      <el-table-column
        prop="food"
        label="食物">
        <div class="item" slot-scope="scope">
          <el-select class="item__input" v-model="scope.row.food" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="item__txt">{{foodLabel(scope.row.food)}}</div>
        </div>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="save(scope.row)" type="text" size="small">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Batch',
  data () {
    return {
      // 下拉选项
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      // 表格数据
      tableData: [{
        id: 0,
        date: '2016-05-02',
        name: '王小虎',
        food: '选项5'
      }, {
        id: 1,
        date: '2016-05-04',
        name: '王小虎',
        food: '选项5'
      }, {
        id: 2,
        date: '2016-05-01',
        name: '王小虎',
        food: '选项5'
      }, {
        id: 3,
        date: '2016-05-03',
        name: '王小虎',
        food: '选项5'
      }],
      // 需要编辑的属性
      editProp: ['date', 'name', 'food'],
      // 保存进入编辑的cell
      clickCellMap: {}
    }
  },
  computed: {
    foodLabel () {
      return (val) => {
        return this.options.find(o => o.value === val).label
      }
    }
  },
  methods: {
    /** 鼠标移入cell */
    handleCellEnter (row, column, cell, event) {
      const property = column.property
      if (property === 'date' || property === 'name' || property === 'food') {
        cell.querySelector('.item__txt').classList.add('item__txt--hover')
      }
    },
    /** 鼠标移出cell */
    handleCellLeave (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        cell.querySelector('.item__txt').classList.remove('item__txt--hover')
      }
    },
    /** 点击cell */
    handleCellClick (row, column, cell, event) {
      const property = column.property
      if (this.editProp.includes(property)) {
        // 保存cell
        this.saveCellClick(row, cell)
        cell.querySelector('.item__txt').style.display = 'none'
        cell.querySelector('.item__input').style.display = 'block'
        cell.querySelector('input').focus()
      }
    },
    /** 取消编辑状态 */
    cancelEditable (cell) {
      cell.querySelector('.item__txt').style.display = 'block'
      cell.querySelector('.item__input').style.display = 'none'
    },
    /** 保存进入编辑的cell */
    saveCellClick (row, cell) {
      const id = row.id
      if (this.clickCellMap[id] !== undefined) {
        if (!this.clickCellMap[id].includes(cell)) {
          this.clickCellMap[id].push(cell)
        }
      } else {
        this.clickCellMap[id] = [cell]
      }
    },
    /** 保存数据 */
    save (row) {
      const id = row.id
      // 取消本行所有cell的编辑状态
      this.clickCellMap[id].forEach(cell => {
        this.cancelEditable(cell)
      })
      this.clickCellMap[id] = []
    }
  }
}
</script>

<style lang='scss'>
  .item{
    .item__input{
      display: none;
      width: 100px;
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__inner{
        height: 24px!important;
      }
      /* 调整elementUI中样式 如果不需要调整请忽略 */
      .el-input__suffix{
        i{
          font-size: 12px !important;
          line-height: 26px !important;
        }
      }
    }
    .item__txt{
      box-sizing: border-box;
      border: 1px solid transparent;
      width: 100px;
      line-height: 24px;
      padding: 0 8px;
    }
    .item__txt--hover{
      border: 1px solid #dddddd;
      border-radius: 4px;
      cursor: text;
    }
  }
</style>

```

演示截图

![SDGIF_Rusult_3](C:\Users\liz-q\Desktop\闪电GIF制作软件\SDGIF_Rusult_3.gif)
