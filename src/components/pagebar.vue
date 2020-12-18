 <!--分页工具栏 -->
 <template>
  <el-row class="pagingbar">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.page" :page-sizes="pageSizes" :page-size="pageData.pageSize" :total="pageData.recordCount" :layout="layout">
    </el-pagination>
  </el-row>
</template>

<script type="text/javascript">
// 第一页的页码，默认为1
const FIRST_PAGE_NO = 1;
// 每页记录数，默认为10
const PAGE_SIZE = 10;

export default {
  name: "PageBar",

  props: {
    /**
     * 每页记录数可选值
     */
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 50, 100];
      }
    },

    layout: {
      type: String,
      default: "prev, pager, next"
    },

    /**
     * 从服务器取得的分页数据
     */
    pageData: {
      type: Object,
      default: function() {
        return {
          page: FIRST_PAGE_NO, // 当前页码
          pageSize: PAGE_SIZE, // 每页记录数
          pageCount: 0, // 总页数
          recordCount: 0, // 总记录数
          records: [] // 当前页记录数
        };
      }
    }
  },

  methods: {
    handleSizeChange(val) {
      // 如果pageSize发生变化，一律从第一页开始查起
      this.reload(FIRST_PAGE_NO, val);
    },

    handleCurrentChange(val) {
      console.log(this.pageData);
      this.reload(val, this.pageData.pageSize);
    },

    reload(page, pageSize) {
      this.$emit("onreload", page, pageSize);
    }
  }
};
</script>

<style scoped>
.pagingbar {
  margin: 10px 0;
  text-align: center;
}
</style>
