<template>
  <div class="pagination-container">
    <el-pagination
      :class="[{ 'is-simple': simple }]"
      background
      :current-page.sync="currentPage"
      :page-size.sync="currentPageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :simple="simple"
      v-bind="$attrs"
      v-on="$listeners"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <slot>
        <span class="smallPagination"
          >{{ currentPage }}/{{
            $attrs.total % currentPageSize > 0 ? parseInt($attrs.total / currentPageSize) + 1 : parseInt($attrs.total / currentPageSize)
          }}</span
        >
      </slot>
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'wgPagination',
  inheritAttrs: false,
  props: {
    page: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      },
    },
    simple: {
      type: Boolean,
      default: false,
    },
    noLayoutProps: {
      type: Array,
      default: () => [],
    },
    // 兼容原ElementUI的pageSize属性
    pageSize: Number,
  },
  data() {
    return {
      defaultLayout: 'total,prev,pager,next,sizes,jumper',
    };
  },
  watch: {
    simple: {
      handler(val) {
        if (!val) return;
        this.defaultLayout = 'total,prev,slot,next,sizes,jumper';
      },
      immediate: true,
    },
    noLayoutProps: {
      handler(val) {
        if (val.length === 0) return;
        this.getLayout(val);
      },
      immediate: true,
    },
  },
  computed: {
    layout() {
      return this.defaultLayout;
    },
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit('update:page', val);
      },
    },
    currentPageSize: {
      get() {
        return this.pageSize || this.limit;
      },
      set(val) {
        this.$emit('update:limit', val);
        this.$emit('update:pageSize', val);
      },
    },
  },
  methods: {
    getLayout(targetVal) {
      // 得到指定的layout布局
      const dataArr = this.defaultLayout.split(',');
      const newArr = dataArr.filter((data) => !targetVal.some((item) => data === item));
      this.defaultLayout = newArr.toString();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.$nextTick(() => {
        this.$emit('pagination', { page: this.currentPage, limit: val, pageSize: val, });
      });
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.currentPageSize, pageSize: this.currentPageSize, });
    },
  },
};
</script>
<style lang="less" scoped>
.pagination-container {
  .smallPagination {
    text-align: center;
    color: #505356;
    font-size: 14px;
    font-weight: 400;
  }
  /deep/ .el-pagination .el-select .el-input .el-input__inner,
  /deep/ .el-input__inner {
    border-radius: 2px;
  }
  /deep/ .el-pagination .el-pager li,
  /deep/ .el-pagination__total {
    font-weight: 400;
    color: #505356;
  }
  /deep/ .el-pagination .el-pager li,
  /deep/ .btn-prev,
  /deep/ .btn-next {
    border: 1px solid #bfc3c5;
  }
  /deep/ .el-pager li + li,
  /deep/ .el-pagination__jump {
    margin-left: 6px;
  }
  /deep/ .el-pagination.is-background .btn-next,
  /deep/ .el-pagination.is-background .btn-prev,
  /deep/ .el-pagination.is-background .el-pager li {
    background-color: #ffffff;
  }
  /deep/ .el-pagination--small .el-input--mini .el-input__inner {
    height: 23px;
    line-height: 23px;
  }
  /deep/ .el-pagination.is-background.el-pagination--small .btn-prev {
    margin: 0;
  }
  // 简洁分页相关样式
  /deep/ .is-simple {
    .el-pagination__total {
      margin-right: 5px;
    }
    .btn-next,
    .btn-prev {
      margin: 0px;
      min-width: 15px;
    }
    .el-pagination__sizes {
      margin-right: 0px;
    }
    .el-pagination__editor.el-input .el-input__inner {
      height: 23px;
    }
    .el-input--mini .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
    .btn-prev,
    .el-select--mini .el-input__inner,
    .btn-next {
      border-width: 0;
    }
    .el-select--mini .el-input__inner {
      padding: 0;
      text-align: left;
    }
    .el-select .el-input {
      width: 80px;
    }
    .el-select .el-input .el-input__inner {
      padding-right: 20px !important;
    }
    .el-input__suffix {
      right: -3px;
    }
    /deep/ .el-input--suffix .el-input__inner {
      padding-right: 0;
    }
    .el-input__inner {
      padding-right: 0;
    }
    .el-pagination__jump {
      margin-left: 0;
    }
  }

  // 小型分页样式
  /deep/ .el-pagination--small {
    .el-pagination__sizes {
      .el-input__inner {
        height: 20px;
        line-height: 20px;
      }
      .el-input__icon {
        height: 22px;
        line-height: 22px;
      }
    }
    .el-pagination__jump {
      .el-pagination__editor.el-input .el-input__inner {
        height: 20px;
        line-height: 20px;
      }
    }
  }
  // 表单校验中去掉分页中的√或×
  /deep/ .el-input__validateIcon {
    display: none;
  }
}
</style>
