<template>
  <div>
    <el-popover placement="bottom" width="730" trigger="manual" v-model="visible">
      <el-table height="398" :data="tableData" border v-loading="loading" @row-click="setItem" highlight-current-row>
        <el-table-column width="150" prop="clinicId" label="诊疗项目ID"></el-table-column>
        <el-table-column prop="itemName" label="诊疗项目名称"></el-table-column>
        <el-table-column width="150" prop="itemClassStr" label="诊疗项目分类"></el-table-column>
      </el-table>
      <div class="flex jsb">
        <wg-pagination
          class="pagination mt10"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="pageSize"
          @pagination="searchClinicList"
          simple
          small
        >
        </wg-pagination>
        <div class="operateBtns">
          <wg-button @click="closePopover">取消</wg-button>
          <wg-button primary @click="confirm">确认</wg-button>
        </div>
      </div>
      <wg-el-input
        slot="reference"
        placeholder="请输入编码和名称检索"
        v-model="searchName"
        @input="searchClinicList"
      ></wg-el-input>
    </el-popover>
  </div>
</template>

<script>
// import ajax from '../../../../src/api/http';
import { getClinicItemPageList } from '@/utils/index';
export default {
  name: 'ClinicPopover',
  data() {
    return {
      tableData: [],
      visible: false,
      loading: false,

      currentPage: 1,
      pageSize: 10,
      total: 0,

      searchName: '',
      selectedItem: null,
    };
  },
  mounted() {
    document.addEventListener('click', this.bodyCloseTable);
  },
  methods: {
    bodyCloseTable(e) {
      this.visible = false;
    },
    setItem(row) {
      this.selectedItem = row;
    },
    confirm() {
      let { selectedItem } = this;
      if (selectedItem != null) {
        this.$emit('selectItem', this.selectedItem);
        this.searchName = selectedItem.itemName;
        this.visible = false;
      } else {
        this.$message({
          type: 'warning',
          message: '请单击选中一条数据！',
        });
      }
    },
    async searchClinicList() {
      this.loading = true;
      let { searchName, currentPage, pageSize } = this;
      let params = {
        searchName: searchName,
        currentPage: currentPage,
        pageSize: pageSize,
        isEnable: 1,
      };
      let res = await getClinicItemPageList(params);
      // let res = await ajax.get('/bcs/clinicItem/pageList', params);
      if (res && res.code === '0' && res.data) {
        this.loading = false;
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.visible = true;
      }
    },
    closePopover() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.operateBtns {
  display: flex;
  justify-content: flex-end;
  margin: 10px 0;
}
</style>
