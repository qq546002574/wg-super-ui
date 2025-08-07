<template>
<div :id="graphId" class="graph-container"></div>
</template>
<script>
import mxgraph from '@/mxgraph/index';
import { createGraph, changePatientSex } from './graph/sectionGraph';

const {
  mxEvent,
  mxMorphing,
  mxConstants,
  mxEdgeHandler,
  mxHierarchicalLayout,
} = mxgraph;

export default {
  // 流程图组件
  name: 'wgSectionGraph',
  props: {
    graphId: {
      default: 'graphContainer',
      type: String,
    },
    nodeValue: {
      default: () => {},
      type: Object,
    },
    onlyRead: {
      default: false,
      type: Boolean,
    },
    translateX: {
      default: 40,
      type: Number,
    },
    translateY: {
      default: 40,
      type: Number,
    },
    patientSex: {
      default: 1,
      type: [String,Number],
    },
    available: {
      default: true,
      type: [Function, Boolean],
    }
  },
  data() {
    return {
      graph: {},
      cellW: 108,
      cellH: 60,
      selectionVertexCell: null,
      oldSelectStageId: '',
      oldSelectObjectCellId: '',
      container: null,

    };
  },
  computed: {},
  watch: {
    onlyRead() {
      if (this.graph) {
        this.graph.setConnectable(!this.onlyRead);
      }
    },
    patientSex() {
      changePatientSex(this.patientSex);
      this.graph.refresh();
    }
  },
  mounted() {
    this.init();
    this.listenGraphEvent();
  },
  methods: {
    init() {
      this.container = document.getElementById(this.graphId);
      this.graph = createGraph(this.container, this.patientSex);
      this.graph.setConnectable(this.onlyRead);
      this.graph.view.setTranslate(this.translateX, this.translateY);
			this.drawStage(this.nodeValue)
    },
    /**
     * 重置重绘
     */
    resetDrawStage(nodeValue){
      this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
      this.$nextTick(() => {
        this.drawStage(nodeValue);
      })
    },
    /**
     * 绘制cell
     */
    drawStage(nodeValue) {
      if (!nodeValue.cells || !nodeValue.cells.length) return;
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();
      try
      {
        const { cells, edges } = nodeValue;
        const ids = {...cells.map(item => item.stageId)};
        cells.forEach(item => {
          ids[item.stageId] = this.graph.insertVertex(parent, item.stageId, item, 20, 20, this.cellW, this.cellH, 'node');
        })
        edges.forEach((item) => {
          this.graph.insertEdge(parent, null, '', ids[item.parent], ids[item.child]);
        })
        this.autoLayout();
        this.$nextTick(() => {
          const firstCell = cells[0].stageId;
          const stageCell = this.getCellByStageId(firstCell);
          if (stageCell) {
            this.graph.setSelectionCell(stageCell);
            const selectCell = this.getSelectionCell();
            if (selectCell) {
              this.setSelectCellStyle(selectCell);
            }
          }
        })
      }
      finally
      {
        this.graph.getModel().endUpdate();
      }
    },
    /**
     * 自动布局
     */
    autoLayout() {
      mxHierarchicalLayout.prototype.intraCellSpacing = 24;
      mxHierarchicalLayout.prototype.interRankCellSpacing = 70;
      // mxHierarchicalLayout.prototype.edgeStyle = 10;
      const layout = new mxHierarchicalLayout(this.graph, mxConstants.DIRECTION_WEST);
      // const layout = new mxCompactTreeLayout(this.graph);
      try
					{
		    		layout.execute(this.graph.getDefaultParent());
					}
					catch (e)
					{
						throw e;
					}
					finally
					{
						// New API for animating graph layout results asynchronously
						var morph = new mxMorphing(this.graph);
						morph.startAnimation();
					}
    },
    /**
     * 创建监听
     */
    listenGraphEvent() {
      this.graph.addListener(mxEvent.CLICK, async (sender, evt) => {
        const cell = evt.properties.cell;
        if (!cell) {
          return;
        }
        if (cell.vertex) {
          if(typeof(this.available) === 'function' && !(await this.available())) {
            this.graph.setSelectionCell(this.selectionVertexCell);
            this.$emit('selectionChange');
          } else {
            this.setSelectCellStyle(cell);
          }
        }
      });

      this.graph.addListener(mxEvent.CELLS_ADDED, (sender, evt) => {
        const cell = evt.properties.cells[0];
        if (this.graph.isPart(cell)) {
          return;
        }

        if (cell.vertex) {
          this.autoLayout();
          this.$emit('change', this.getAllModelStages());
        } else if (cell.edge) {
          this.$emit('change', this.getAllModelStages());
          this.$nextTick( () => {
            this.autoLayout();
          })
        }
      });

      this.graph.addListener(mxEvent.LABEL_CHANGED, (sender, evt) => {
        this.$message.info(`内容改变为：${evt.getProperty("value")}`);
      });

      this.graph.addListener(mxEvent.CONNECT_CELL, (sender, evt) => {
        this.$emit('change', this.getAllModelStages());
        this.autoLayout();
      });
    },
    /**
     * 插入节点
     */
    insertVertex(data, callback) {
      const selectCell = this.getSelectionCell();
      if (!selectCell) {
        this.$message.error("请选择一个节点");
        return;
      }
      const parent = this.graph.getDefaultParent();
      if (selectCell) {
        // const cellStyle = data.
        const vCell = this.graph.insertVertex(parent, null, data, 20, 20, this.cellW, this.cellH, 'node');
        const e = this.graph.insertEdge(parent, null, '', selectCell, vCell);
        this.$nextTick( () => {
          this.autoLayout();
          this.graph.setStyle(vCell, 'fillColor', this.getStageStatusType(data.stageStatus, 'COLOR'));
          this.graph.setStyle(vCell, 'strokeColor', this.getStageStatusType(data.stageStatus, 'COLOR'));
          if (callback && typeof(callback) === 'function') {
            const modelCells = this.getAllModelStages();
            callback(modelCells);
          }
        })
      } else {
        this.$message.warning("请选择一个节点");
      }
    },
    /**
     * 删除节点
     */
    removeCell(callback) {
      const selectCell = this.getSelectionCell();
      if (!selectCell) {
        this.$message.error("请选择一个节点");
        return;
      }
      console.log("🚀🚀🚀 =>> removeCell =>> this.getCellChildNode(selectCell)",selectCell, this.graph.getChildVertices(this.graph.getDefaultParent()))
      // const allCells = this.graph.getChildVertices(this.graph.getDefaultParent());
      // let deleteCells = []
      // if (allCells.length) {
      //   let thIndex = '';
      //   console.log("🚀🚀🚀 =>> removeCell =>> thIndex", thIndex)
      //   allCells.forEach((item,index) => {
      //     if (item.mxObjectId === selectCell.mxObjectId) {
      //       thIndex = index;
      //       deleteCells = allCells.slice(index, allCells.length);
      //     }
      //   })
      // }
      // this.graph.removeCells(deleteCells);
      this.graph.removeCells([selectCell]);
      // this.autoLayout();
      if (callback && typeof(callback) === 'function') {
        const modelCells = this.getAllModelStages();
        callback(modelCells);
      }
    },
    /**
     * 编辑节点
     */
    editSelectionCell(data, callback) {
      const selectCell = this.getSelectionCell();
      if (!selectCell) {
        this.$message.error("请选择一个节点");
        return;
      }
      selectCell.setValue(data);
      this.graph.refresh(selectCell);
      this.setSelectCellStyle(selectCell);
      if (callback && typeof(callback) === 'function') {
        const modelCells = this.getAllModelStages();
        callback(modelCells);
      }
    },
    /**
     * 设定关键节点
     */
    setStageStatus(key, value, callback) {
      const selectCell = this.getSelectionCell();
      if (!selectCell) {
        this.$message.error("请选择一个节点");
        return;
      }
      selectCell.value[key] = value;
      this.graph.refresh(selectCell);
      this.setSelectCellStyle(selectCell);
      if (callback && typeof(callback) === 'function') {
        const modelCells = this.getAllModelStages();
        callback(modelCells);
      }
    },
    /**
     * 获取当前选择阶段节点，如果没有则返回null
     */
    getSelectionCell() {
      return this.graph.getSelectionCell() || this.selectionVertexCell;
    },
    /**
     * 获取当前选中节点的关联
     * @param { Sting } type: "CHILD":
     */
    getSelectionCellconnection(type='CHILD') {
      const selectCell = this.graph.getSelectionCell();
      if (!selectCell) {
        this.$message.error("请选择一个节点");
        return;
      }
      switch (type) {
        case 'CHILD':
          return this.getChildCells(selectCell);
        case 'PARENT':
          return this.getParentCells(selectCell);
      }
    },
    /**
     * 获取节点子节点
     */
    getChildCells(cell) {
      const {edges, mxObjectId} = cell;
      let childCells = [];
      if(edges && edges.length) {
        const sourceEdges = edges.filter(item => item.source.mxObjectId === mxObjectId);
        childCells = sourceEdges.map(item => item.target.value);
      }
      return childCells;
    },
    /**
     * 获取节点父节点
     */
    getParentCells(cell) {
      const {edges, mxObjectId} = cell;
      let parentsCells = [];
      if(edges && edges.length) {
        const targetEdges = edges.filter(item => item.target.mxObjectId === mxObjectId);
        parentsCells = targetEdges.map(item => item.source.value);
      }
      return parentsCells;
    },
    /**
     * 获取全部cell及其关联关系，最终的结果
     */
    getAllModelStages() {
      const cells = [];
      const edges = [];
      Object.values(this.graph.getModel().cells).forEach((item, index) => {
        if (item.vertex) {
          cells.push(item.value);
        }
        if (item.edge) {
          edges.push({
            parent: item.source.value.stageId,
            child: item.target.value.stageId,
          })
        }
      })
      return {cells, edges};
    },
    /**
     * 根据stageId查找cell节点
     */
    getCellByStageId(stageId) {
      let stageCell = null;
      Object.values(this.graph.getModel().cells).forEach((item) => {
        if (item.vertex && item.value.stageId === stageId) {
          stageCell = item;
        }
      });
      return stageCell;
    },
    /**
     * 选中stageId的cell
     */
    setSelectionCell(stageId) {
      const stageCell = this.getCellByStageId(stageId);
      if (!stageCell) {
        this.$message.error("没有当前的阶段");
        return;
      }
      this.graph.setSelectionCell(stageCell);
      this.setSelectCellStyle(stageCell);
    },
    /**
     * 设置选中的状态
     */
    setSelectCellStyle(cell) {
      this.selectionVertexCell = cell;
      const selectionCellValue = {
        mxObjectId: cell.mxObjectId,
        ...cell.value,
      }
      this.$emit('selectionChange', selectionCellValue);
      const { edges } = cell
      let edgsIDList = [];
      if(edges.length > 0) {
        edgsIDList = edges.map(e => e.mxObjectId);
        edges.forEach(e => {
          this.graph.setStyle(e, 'strokeColor', '#489CFF');
          this.graph.setStyle(e, 'dashed', 0);
        })
      }
      this.graph.setStyle(cell, 'fillColor', '#0E5EBC');
      Object.values(this.graph.getModel().cells).forEach((item, index) => {
        if (item.vertex && item.mxObjectId !== cell.mxObjectId) {
          this.graph.setStyle(item, 'fillColor', this.getStageStatusType(item.value.stageStatus, 'COLOR'));
          this.graph.setStyle(item, 'strokeColor', this.getStageStatusType(item.value.stageStatus, 'COLOR'));
        }
        if(item.edge && !edgsIDList.includes(item.mxObjectId)) {
          const disTypeStatus = [0, 1, 6];
          const isDisStatus = disTypeStatus.includes(item.source.value.stageStatus) || disTypeStatus.includes(item.target.value.stageStatus);
          const stokeColor = isDisStatus ? '#C3CFDC' : '#5A7599';
          this.graph.setStyle(item, 'strokeColor', stokeColor);
          if (item.source.value.stageStatus === 1 || item.target.value.stageStatus === 1) {
            this.graph.setStyle(item, 'dashed', isDisStatus ? 1 : 0);
          }
        }
      })
      this.$nextTick(() => {
        const selectStageDivID = `STAGE-${cell.mxObjectId}-${cell.value.stageId}`;
        const selectStageDiv = document.getElementById(selectStageDivID);
        selectStageDiv.style.borderColor = '#fff';
        if (this.oldSelectStageId && this.oldSelectObjectCellId) {
          const oldStageCell = this.getCellByObjectId(this.oldSelectObjectCellId);
          const oldSelectStageDiv = document.getElementById(this.oldSelectStageId);
          if (oldSelectStageDiv) {
            oldSelectStageDiv.style.borderColor = this.getStageStatusType(oldStageCell.value.stageStatus, 'COLOR');
          }
        }
        this.oldSelectObjectCellId = cell.mxObjectId;
        this.oldSelectStageId = selectStageDivID;
      })
    },
    /**
     * 根据mxObjectId获取对应的cell
     */
    getCellByObjectId(mxObjectId) {
      return Object.values(this.graph.getModel().cells).find(item => item.mxObjectId === mxObjectId);
    },
    /**
     * 根据不同的状态返回对应的颜色
     */
    getStageStatusType(status, type = 'TYPE') {
      let cellStyle = 'node';
        switch(status) {
          case 0:
          case 1:
          case 2:
          case 6:
            cellStyle = type === 'TYPE' ? 'disType' : '#C3CFDC';
          break;
          default:
            cellStyle = type === 'TYPE' ? 'node' : '#489CFF';
        }
        return cellStyle;
    },
    /**
     * 判断当前的节点是否有多个下个节点
     */
    hasMoreStage(stageId, type='CHILD') {
      let result = {
        hasMoreStage: false,
        cells: [],
        edges: [],
      };
      const edgsStageKey = type === 'CHILD' ? 'source' : 'target';
      const stageCell = this.getCellByStageId(stageId);
      if (!stageCell) {
        this.$message.error("没有当前阶段节点");
        return;
      }
      const { edges, mxObjectId } = stageCell;
      let connectionCell = [];
      if (type == 'CHILD') {
        connectionCell = this.getChildCells(stageCell);
      } else if (type === 'PARENT') {
        connectionCell = this.getParentCells(stageCell);
      }
      if (connectionCell.length > 1) {
          const connctionEdges = edges.filter(item => item[edgsStageKey].mxObjectId === mxObjectId);
          result.hasMoreStage = true;
          result.cells = [stageCell.value].concat(connectionCell);
          result.edges = connctionEdges.map(item => {
            return {
              parent: item.source.value.stageId,
              child: item.target.value.stageId,
            }
          })
        } else {
          result.hasMoreStage = false;
          result.cells = connectionCell;
        }
      return result;
    },
  },
};
</script>

<style lang="less" scoped>
.graph-container {
  width: 100%;
  height: 100%;
  overflow: visible;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
