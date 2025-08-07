import mxgraph from '@/mxgraph/index';
import _ from 'lodash';

const {
  mxGraph,
  mxVertexHandler,
  mxConstants,
  mxCellState,
  mxPerimeter,
  mxCellEditor,
  mxGraphHandler,
  mxEvent,
  // mxShape,
  mxEdgeHandler,
  mxEventObject,
  // mxConnectionConstraint,
  // mxHierarchicalLayout,
  // mxPoint,
} = mxgraph;
export class SectionGraph extends mxGraph {
  static getStyleDict(cell) {
    return cell.getStyle() ?  _.compact(cell.getStyle().split(';'))
      .reduce((acc, item) => {
        const [key, value] = item.split('=');
        acc[key] = value;
        return acc;
      }, {}) : {};
  }

  static convertStyleToString(styleDict) {
    const style = Object.entries(styleDict)
      .map(([key, value]) => `${key}=${value}`)
      .join(';')
      .replace(/=undefined/g, '');
    return `${style};`;
  }

  static getCellPosition(cell) {
    return _.pick(cell.getGeometry(), ['x', 'y']);
  }

  constructor(container) {
    super(container);
    this._init();
  }

  _init() {
    this._setDefaultConfig();
    this._changeLabel();
    this._putVertexStyle();
    this._setDefaultEdgeStyle();
    this._setAnchors();
  }

  _setDefaultConfig() {
    this.setConnectable(true);
    mxEvent.disableContextMenu(this.container);

    // 固定节点大小
    this.setCellsResizable(false);
    // 禁止编辑
    this.setCellsEditable(false);
    // 编辑时按回车键不换行，而是完成输入
    this.setEnterStopsCellEditing(true);

    // 编辑时按 escape 后完成输入
    mxCellEditor.prototype.escapeCancelsEditing = false;
    // 失焦时完成输入
    mxCellEditor.prototype.blurEnabled = true;

    // 禁止节点折叠
    this.foldingEnabled = false;
    // 文本包裹效果必须开启此配置
    this.setHtmlLabels(true);

    // 拖拽过程对齐线
    // mxGraphHandler.prototype.guidesEnabled = true;

    // 禁止游离线条
    this.setDisconnectOnMove(false);
    this.setAllowDanglingEdges(false);
    mxGraph.prototype.isCellMovable = cell => false;

    // 配置画布拖动
    this.panningHandler.useLeftButtonForPanning = true;
    this.panningHandler.ignoreCell = false;
    this.container.style.cursor = 'grab';
    this.setPanning(true);

    this.setMultigraph(false);
    // this.setResizeContainer(true);
    // 禁止调整线条弯曲度
    // this.setCellsBendable(false);

    // 禁止从将label从线条上拖离
    // mxGraph.prototype.edgeLabelsMovable = false;
    // mxHierarchicalLayout.prototype.edgeStyle = 4;
  }
  _changeLabel() {
    this.getLabel = (cell) => {
      if (cell && cell.vertex) {
        const divStyle = [
          `width:105px`,
          `height:57px`,
          `display:flex`,
          `flex-direction:column`,
          'padding:6px',
          'position:relative',
          'border-radius: 6px',
          'border: 1px solid #ffffff00',
        ]
        const labelStyle = [
          `flex: 50%`,
          `display: flex`,
          `justify-content: center`,
          `align-items: center`,
        ]
        const criticalStageStyle = [
          'width: 20px',
          'height: 20px',
          'position: absolute',
          'right: 1px',
          'top: 1px',
        ]
        const nomalStageIconStyle = [
          'width: 18px',
          'height: 18px',
          'position: absolute',
          'right: -8px',
          'bottom: -8px',
        ]
        const actionStageIconStyle = [
          'width: 28px',
          'height: 28px',
          'position: absolute',
          'right: -14px',
          'bottom: -14px',
        ]
        const startOrEndStageStyle = [
          'width: 20px',
          'height: 20px',
          'position: absolute',
          'left: -12px',
          'top: -12px',
        ]
        const iconStyle = 'width=100%;height:100%'
        const criticalStageDisplay = cell.value.criticalStage ? '' : 'none';
        const jumpStageDiapley = cell.value.stageStatus === 1 || cell.value.stageStatus === 2 ? '' : 'none';
        const actionStageDisplay = cell.value.stageStatus === 3 ? '' : 'none';
        const activedStageDisplay = cell.value.isActived || cell.value.stageStatus === 4 ? '' : 'none';
        const startStageDisplay = cell.value.isStart ? '' : 'none';
        const endStageDisplay = cell.value.isEnd ? '' : 'none';
        const f14 = 'font-size:14px';
        const f12 = 'font-size:12px';
        const title =  `<p style="${labelStyle.join(';')};${f14}">${cell.value.title}</p>`;
        const subhead =  `<p style="${labelStyle.join(';')};${f12}">${cell.value.time}</p>`;
        const avaterUrl = Number(graph.patientSex) === 1 ? '/public/mxgraph/images/avater1.png' : '/public/mxgraph/images/avater2.png';
        const criticalStageIcon = `<div style="${criticalStageStyle.join(';')};display:${criticalStageDisplay}"><img style="${iconStyle}" src="/public/mxgraph/images/stage.png"></img></div>`
        const jumpStageIcon = `<div style="${nomalStageIconStyle.join(';')};display:${jumpStageDiapley}"><img style="${iconStyle}" src="/public/mxgraph/images/jump.png"></img></div>`
        const actionStageIcon = `<div style="${actionStageIconStyle.join(';')};display:${actionStageDisplay}"><img style="${iconStyle};border-radius: 50%;" src="${avaterUrl}"></img></div>`
        const activedStageIcon = `<div style="${nomalStageIconStyle.join(';')};display:${activedStageDisplay}"><img style="${iconStyle}" src="/public/mxgraph/images/stageOver.png"></img></div>`
        const startStageIcon = `<div style="${startOrEndStageStyle.join(';')};display:${startStageDisplay}"><img style="${iconStyle}" src="/public/mxgraph/images/start.png"></img></div>`
        const endStageIcon = `<div style="${startOrEndStageStyle.join(';')};display:${endStageDisplay}"><img style="${iconStyle}" src="/public/mxgraph/images/end.png"></img></div>`
        const labelContainer = `<div id="STAGE-${cell.mxObjectId}-${cell.value.stageId}" style="${divStyle.join(';')}">${title}${subhead}${criticalStageIcon}${activedStageIcon}${startStageIcon}${actionStageIcon}${endStageIcon}${jumpStageIcon}</div>`
        return labelContainer
      }
    }
  }

  _putVertexStyle() {
    const defaultStlStyle = {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LABEL,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
      [mxConstants.STYLE_ROUNDED]: true,
      [mxConstants.STYLE_ARCSIZE]: 10, // 设置圆角程度

      [mxConstants.STYLE_STROKECOLOR]: '#489CFF',
      [mxConstants.STYLE_FONTCOLOR]: '#FFFFFF',
      [mxConstants.STYLE_FONTSIZE]: '16',
      [mxConstants.STYLE_FILLCOLOR]: '#489CFF',
      //
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: 'none',

      [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,
      [mxConstants.STYLE_IMAGE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_IMAGE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,
    }
    const selectedType = Object.assign({},defaultStlStyle, {
      [mxConstants.STYLE_FILLCOLOR]: '#0E5EBC',
    })
    const disType = Object.assign({},defaultStlStyle, {
      [mxConstants.STYLE_FILLCOLOR]: '#C3CFDC;',
      [mxConstants.STYLE_STROKECOLOR]: '#C3CFDC',
    })
    this.getStylesheet().putCellStyle('selectedType', selectedType);
    this.getStylesheet().putCellStyle('disType', disType);
    this.getStylesheet().putCellStyle('node', defaultStlStyle);

    // 设置选中状态节点的边角为圆角，默认是直角
    const oldCreateSelectionShape = mxVertexHandler.prototype.createSelectionShape;
    mxVertexHandler.prototype.createSelectionShape = function createSelectionShape(...args) {
      const res = oldCreateSelectionShape.apply(this, args);
      res.isRounded = true;
      res.stroke =  '#fff0';
      res.isDashed = false;
      res.style = {
        arcSize: 10,
      };
      return res;
    };
  }

  _setDefaultEdgeStyle() {
    const style = this.getStylesheet().getDefaultEdgeStyle();
    Object.assign(style, {
      [mxConstants.STYLE_ENDARROW] : mxConstants.ARROW_BLOCK,
      [mxConstants.STYLE_ROUNDED]: true, // 设置线条拐弯处为圆角
      [mxConstants.STYLE_STROKEWIDTH]: '1',
      [mxConstants.STYLE_STROKECOLOR]: '#5A7599',
      [mxConstants.STYLE_EDGE]: mxConstants.EDGESTYLE_ORTHOGONAL,
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#ffa94d',
    });
    // 设置拖拽线的过程出现折线，默认为直线
    this.connectionHandler.createEdgeState = () => {
      const edge = this.createEdge();
      return new mxCellState(this.view, edge, this.getCellStyle(edge));
    };
  }

  _setAnchors() {
    // 禁止从节点中心拖拽出线条
    // this.connectionHandler.isConnectableCell = () => false;
    // mxEdgeHandler.prototype.isConnectableCell = () => false;
    mxGraph.prototype.getAllConnectionConstraints = (terminal) => {
      if (terminal != null && terminal.shape != null) {
        if (terminal.shape.stencil != null) {
          if (terminal.shape.stencil != null) {
            return terminal.shape.stencil.constraints;
          }
        } else if (terminal.shape.constraints != null) {
          return terminal.shape.constraints;
        }
      }
      return null;
    };

    // mxShape.prototype.constraints = [
      // new mxConnectionConstraint(new mxPoint(0, 0), true),
      // new mxConnectionConstraint(new mxPoint(0, 1), true),
      // new mxConnectionConstraint(new mxPoint(1, 0), true),
      // new mxConnectionConstraint(new mxPoint(1, 1), true),
      // new mxConnectionConstraint(new mxPoint(0.25, 0), true),
      // new mxConnectionConstraint(new mxPoint(0.5, 0), true),
      // new mxConnectionConstraint(new mxPoint(0.75, 0), true),
      // new mxConnectionConstraint(new mxPoint(0, 0.25), true),
      // new mxConnectionConstraint(new mxPoint(0, 0.5), true),
      // new mxConnectionConstraint(new mxPoint(0, 0.75), true),
      // new mxConnectionConstraint(new mxPoint(1, 0.25), true),
      // new mxConnectionConstraint(new mxPoint(1, 0.5), true),
      // new mxConnectionConstraint(new mxPoint(1, 0.75), true),
      // new mxConnectionConstraint(new mxPoint(0.25, 1), true),
      // new mxConnectionConstraint(new mxPoint(0.5, 1), true),
      // new mxConnectionConstraint(new mxPoint(0.75, 1), true)
    // ];
  }

  _configCustomEvent() {
    const graph = this;
    const oldStart = mxEdgeHandler.prototype.start;
    mxEdgeHandler.prototype.start = function start(...args) {
      oldStart.apply(this, args);
      graph.fireEvent(new mxEventObject(mxEvent.EDGE_START_MOVE,
        'edge', this.state.cell,
        'source', this.isSource,
      ));
    };


    const oldCreatePreviewShape = mxGraphHandler.prototype.createPreviewShape;
    mxGraphHandler.prototype.createPreviewShape = function createPreviewShape(...args) {
      graph.fireEvent(new mxEventObject(mxEvent.VERTEX_START_MOVE));
      return oldCreatePreviewShape.apply(this, args);
    };
  }

  getDom(cell) {
    const state = this.view.getState(cell);
    return state.shape.node;
  }

  setStyle(cell, key, value) {
    const styleDict = SectionGraph.getStyleDict(cell);
    styleDict[key] = value;
    const style = SectionGraph.convertStyleToString(styleDict);
    this.getModel().setStyle(cell, style);
  }

  isPart(cell) {
    const state = this.view.getState(cell);
    const style = (state != null) ? state.style : this.getCellStyle(cell);
    return style.constituent === 1;
  }

  deleteSubtree(cell) {
    const cells = [];
    this.traverse(cell, true, (vertex) => {
      cells.push(vertex);
      return true;
    });
    this.removeCells(cells);
  }

  _restoreModel() {
    Object.values(this.getModel().cells)
      .forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.parse(cell.data);
        }
      });
  }

  // 将 data 变为字符串，否则还原时会报错
  _getExportModel() {
    const model = _.cloneDeep(this.getModel());
    Object.values(model.cells)
      .forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.stringify(cell.data);
        }
      });
    return model;
  }
}

let graph = {};
export const destroyGraph = () => {
  graph.destroy();
  graph = {};
};

export const createGraph = (container, patientSex) => {
  graph = new SectionGraph(container);
  graph.patientSex = patientSex;
  return graph;
};

export const changePatientSex = (patientSex) => {
  graph.patientSex = patientSex;
}

export const getGraph = () => graph;
