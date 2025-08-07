<template>
  <wg-input-table ref="wgInputTable" v-bind="$attrs" :config="config" :eval="initVal" @inputSearch="inputSearch"></wg-input-table>
</template>
<script>
import { bedAndRecordList } from '@/utils/index';
export default {
  name: 'wgBedTable',
  data() {
    return {
      initVal: '',
      config: {
        callBackName: 'bedName',
        popWidth: 400,
        isSelect: false,
        isIndex: false,
        immateShow: true,
        tableColum: [
          {
            property: 'bedCode',
            label: '床位编码',
          },
          {
            property: 'bedName',
            label: '床位名称',
          },
          {
            property: 'sexFlagName',
            label: '性别限制',
          },
          {
            property: 'bedStatusStr',
            label: '床位状态',
          },
        ],
        tableData: [],
        pageConfig: {
          total: 10,
          pageSize: 10,
          currentPage: 1,
        },
      },
      query: {}, // 请求参数
    };
  },
  props: {
    queryParams: Object,
    defaultVal: String,
  },
  watch: {
    queryParams: {
      handler(v) {
        this.query = { ...v };
      },
      immediate: true,
    },
    defaultVal: {
      handler(v) {
        this.initVal = v;
      },
      immediate: true,
    },
  },
  async created() {
    if (this.defaultVal) {
      await this.init();
    }
  },
  methods: {
    focus() {
      this.$refs.wgInputTable.$refs.inputRef.focus();
    },
    async inputSearch({ value, currentPage, pageSize, type }) {
      if (type === 'entry') {
        this.config.pageConfig.currentPage = currentPage;
        this.config.pageConfig.pageSize = pageSize;
        this.initVal = value;
        await this.init();
      } else if (type === 'checked') {
        this.$emit('selectItem', value);
      } else if (type === 'clear') {
        this.$emit('selectItem', '');
      }
    },
    async init() {
      const {
        data: { total = 0, records = [], current = 1, size = 10 },
      } = await bedAndRecordList({
        ...this.query,
        bedName: this.initVal,
        currentPage: this.config.pageConfig.currentPage,
        pageSize: this.config.pageConfig.pageSize,
      });
      this.config.tableData = [...records];
      this.config.pageConfig.total = total;
      this.config.pageConfig.currentPage = current;
      this.config.pageConfig.pageSize = size;
    },
  },
};
</script>
<style lang="less" scoped></style>
