import ajax from "@/api/http";
export default {
  name: "wgOrgTableInput",
  components: {},
  props: {},

  data() {
    return {
      tableConfig: {
        callBackName: "orgName",
        immateShow: true,
        isSelect: true,
        isIndex: true,
        tableData: [],
        border: false,
        popWidth: "200px",
        tableColum: [
          {
            label: "编码",
            property: "orgCode",
            width: "80px",
          },
          {
            label: "名称",
            property: "orgName",
            width: "80px",
          },
          {
            label: "分类",
            property: "orgCode",
            width: "80px",
          },
          {
            label: "院区",
            property: "areaName",
            width: "80px",
          },
        ],
        pageConfig: {
          pageSizeArr: [10, 20, 30, 40, 50, 100],
        },
      },
      searchForm: {
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getOrgList();
  },

  methods: {
    getOrgList() {
      this.getOrgListData();
    },
    async getOrgListData() {
      let response = await ajax.get(
        "/bcs/api/organization/getPageOrg",
        this.searchForm
      );

      if (response.code == "0") {
        this.tableConfig.tableData = response.data.records;
      }
    },
  },
};
