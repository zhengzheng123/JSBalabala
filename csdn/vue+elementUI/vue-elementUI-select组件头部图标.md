# vue-elementUI-select组件头部图标

```js
<template>
    <div>
    	<el-select class="process-instance" v-model="val" placeholder="请选择">
            <div slot="prefix">
              <span>
                <i :class="`iconfont ${options[val].unicode}`"
                   :style="{color: options[val].color, 'font-weight': 'bold'}"
                ></i>
              </span>
            </div>
            <el-option
                v-for="(item, key) in options"
                :key="key"
                :label="item.type"
                :value="key">
            <span>
              <i :class="`iconfont ${item.unicode}`"
                 :style="{color: item.color, 'font-weight': 'bold'}"
              ></i>
              {{ item.type }}
            </span>
            </el-option>
          </el-select>
    </div>
</template>
<script>
export default {
	data () {
        return {
            // 注意val是字符串格式
            val: '0',
            options: {
            	0: {
                    unicode: 'iconchangjiantou-shang',
                    color: '#ff0000',
                    type: 'HIGHEST'
                },
                1: {
                    unicode: 'iconchangjiantou-shang',
                    color: '#ff0000',
                    type: 'HIGH'
                },
                2: {
                    unicode: 'iconchangjiantou-shang',
                    color: '#EA7D24',
                    type: 'MEDIUM'
                },
                3: {
                    unicode: 'iconchangjiantou-xia',
                    color: '#2A8734',
                    type: 'LOW'
                },
                4: {
                    unicode: 'iconchangjiantou-xia',
                    color: '#2A8734',
                    type: 'LOWEST'
                }
            }
        }  
    }
}
</script>
```

主要用到了select组件的slot=“prefix”
