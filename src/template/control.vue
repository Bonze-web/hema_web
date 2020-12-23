使用控件为element所有控件都为element




tab栏使用Tabs 标签页基础用法

所有按钮都使用最小size 主按钮使用type=primary，次按钮为默认样式
        <el-button type="primary" size="mini" @click="onSubmit">立即搜索</el-button>
        <el-button size="mini"  @click="clearInput">重置</el-button>


时间、日期控件 使用element默认用法
        <div class="block">
            <span class="demonstration">默认</span>
            <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
            </el-date-picker>
        </div>


二次确认弹窗使用element的messageBox控件
    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        }



下拉菜单使用dropdown
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>



下拉框使用select   多选使用默认多选
    <el-select v-model="value" placeholder="请选择">
        <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
    </el-select>

列表使用table



需要弹窗进行编辑，删除，增加的使用dialog控件自定义用法
确认取消按钮在右下角，右上角需要 有关闭按钮






