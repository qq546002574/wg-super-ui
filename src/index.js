import { PopupManager } from 'element-ui/lib/utils/popup';
import DomZIndex from 'dom-zindex';
import wgEditor from './packages/common/editor';
import wgEditorPlus from './packages/common/editorPlus';
import wgButton from './packages/common/button';
import wgElInput from './packages/common/input';
import wgElSelect from './packages/common/select';
import wgElOption from './packages/common/option';
import wgPagination from './packages/common/pagination';
import wgIcon from './packages/common/icon';
import WgElTree from './packages/common/tree';
import wgPopoverTree from './packages/common/popoverTree';
import wgPullTree from './packages/common/pullTree';
import wgRadioTable from './packages/common/vxeRadioTable';
import wgCheckTable from './packages/common/vxeCheckTable';
import wgRadioEditTable from './packages/common/vxeRadioEditTable';
import wgCheckEditTable from './packages/common/vxecheckEditTable';
import wgList from './packages/common/list';
import wgAlert from './packages/common/alert';
import wgNoticeDialog from './packages/common/noticeDialog';
import wgElDialog from './packages/common/dialog';
import wgPullSelect from './packages/business/wgPullSelect';
import wgSuperTree from './packages/business/SuperTree';
import wgCertificateTypeNum from './packages/business/certificateTypeNum';
import wgCodeSelect from './packages/business/codeSelect';
import wgDateRange from './packages/business/dateRange';
import wgDrugSelect from './packages/business/drugSelect';
import wgFrequencyDict from './packages/business/frequencyDict';
import wgOrgTableInput from './packages/business/orgTableInput';
import wgOrgTree from './packages/business/org-tree';
import wgOrgTreeInput from './packages/business/org-tree-input';
import wgcodeSelectTree from './packages/business/codeSelectTree';
import wgTitle from './packages/common/title';
import wgTransfer from './packages/common/transfer';
import wgInputTable from './packages/common/inputPopTable';
import wgInputTableCheck from './packages/common/inputPopTableCheck';
import wgTable from './packages/common/table';
import wgFormDialog from './packages/common/formDialog';
import wgTableColumn from './packages/common/table-column';
import wgSwitch from './packages/common/switch';
import wgCodeEdit from './packages/common/codeEdit';
import wgInputNumber from './packages/common/input-number';
import wgDateRangeUnion from './packages/common/wgDateRangeUnion';
import wgDatePicker from './packages/common/date-picker';
import wgTimePicker from './packages/common/time-picker';
import wgDateTimeDialog from './packages/common/dateTimeDialog';
import wgDrawer from './packages/common/drawer';
import wgForm from './packages/common/form';
import wgSteps from './packages/common/steps';
import wgTitleCollapse from './packages/common/titleCollapse';
import wgLeftRightLayout from './packages/common/leftRightLayout';
import wgAutocomplete from './packages/common/autocomplete';
import wgDragTable from './packages/common/dragTable';
import wgExtendSelect from './packages/common/extendSelect';
import wgTextIcon from './packages/common/textIcon';
import wgTimeline from './packages/common/timeline';
// import wgTimelineItem from './packages/common/timelineItem';
import wgTimeSelect from './packages/common/time-select';
import wgElTabs from './packages/common/tabs';
import wgTabPane from './packages/common/tabPane';
import wgTheadTooltips from './packages/common/theadToolTips';
import wgElFormItem from './packages/common/form-item';
import wgEmpty from './packages/common/noData';
import wgColorsPicker from './packages/common/colorsPicker';
import wgButtonGroup from './packages/common/button-group';
// import wgDragTableCheck from './packages/business/dragTableCheck';
import wgDragContainer from './packages/common/dragContainer';
import wgTitleBorderLayout from './packages/common/titleBorderLayout';
import wgAreaCascader from './packages/business/areaCascader';
import wgBedTable from './packages/business/bedTable';
import wgBirthAge from './packages/business/birthAge';
import wgPriceTable from './packages/business/wgPriceTable';
import wgPopDown from './packages/business/wgPopDown';
import wgPullDown from './packages/business/wgPullDown';
import wgPersonSelect from './packages/business/personSelect';
import wgOrgSelect from './packages/business/orgSelect';

// import wgSectionGraph from "./packages/business/sectionGraph";
// import wgScanCodeGun from "./packages/business/scanCodeGun";
import wgAreaCascaderCheck from './packages/business/areaCascaderCheck';

const components = [
  wgEditor,
  wgEditorPlus,
  wgButton,
  wgElInput,
  wgElSelect,
  wgElOption,
  wgPagination,
  wgIcon,
  WgElTree,
  wgPopoverTree,
  wgPullTree,
  wgRadioTable,
  wgCheckTable,
  wgRadioEditTable,
  wgCheckEditTable,
  wgAreaCascaderCheck,
  wgList,
  wgAlert,
  wgNoticeDialog,
  wgElDialog,
  wgTitle,
  wgTransfer,
  wgInputTable,
  wgInputTableCheck,
  wgTable,
  wgTableColumn,
  wgFormDialog,
  wgSwitch,
  wgCodeEdit,
  wgInputNumber,
  wgDateRangeUnion,
  wgDatePicker,
  wgTimePicker,
  wgDateTimeDialog,
  wgSuperTree,
  wgDrawer,
  wgForm,
  wgSteps,
  wgTitleCollapse,
  wgLeftRightLayout,
  wgAutocomplete,
  wgPullSelect,
  wgDragTable,
  wgCertificateTypeNum,
  wgCodeSelect,
  wgDateRange,
  wgDrugSelect,
  wgFrequencyDict,
  wgOrgTableInput,
  wgOrgTree,
  wgOrgTreeInput,
  wgcodeSelectTree,
  wgExtendSelect,
  wgTextIcon,
  wgTimeline,
  // wgTimelineItem,
  wgTimeSelect,
  wgElTabs,
  wgTabPane,
  wgTheadTooltips,
  wgElFormItem,
  wgEmpty,
  wgColorsPicker,
  wgButtonGroup,
  // wgDragTableCheck,
  wgDragContainer,
  wgTitleBorderLayout,
  wgAreaCascader,
  wgBedTable,
  wgBirthAge,
  wgPriceTable,
  wgPopDown,
  wgPullDown,
  wgPersonSelect,
  wgOrgSelect,
  // wgSectionGraph,
];

export {
  wgButton,
  wgElInput,
  wgElSelect,
  wgElOption,
  wgPagination,
  wgIcon,
  WgElTree,
  wgPopoverTree,
  wgPullTree,
  wgRadioTable,
  wgCheckTable,
  wgRadioEditTable,
  wgCheckEditTable,
  wgAreaCascaderCheck,
  wgList,
  wgAlert,
  wgNoticeDialog,
  wgElDialog,
  wgTitle,
  wgTransfer,
  wgInputTable,
  wgInputTableCheck,
  wgTable,
  wgTableColumn,
  wgFormDialog,
  wgSwitch,
  wgCodeEdit,
  wgInputNumber,
  wgDateRangeUnion,
  wgDatePicker,
  wgTimePicker,
  wgDateTimeDialog,
  wgSuperTree,
  wgDrawer,
  wgForm,
  wgSteps,
  wgTitleCollapse,
  wgLeftRightLayout,
  wgAutocomplete,
  wgPullSelect,
  wgDragTable,
  wgCertificateTypeNum,
  wgCodeSelect,
  wgDateRange,
  wgDrugSelect,
  wgFrequencyDict,
  wgOrgTableInput,
  wgOrgTree,
  wgOrgTreeInput,
  wgcodeSelectTree,
  wgExtendSelect,
  wgTextIcon,
  wgTimeline,
  // wgTimelineItem,
  wgTimeSelect,
  wgElTabs,
  wgTabPane,
  wgTheadTooltips,
  wgElFormItem,
  wgEmpty,
  wgColorsPicker,
  wgButtonGroup,
  // wgDragTableCheck,
  wgDragContainer,
  wgTitleBorderLayout,
  wgAreaCascader,
  wgBedTable,
  wgBirthAge,
  wgPriceTable,
  wgPopDown,
  wgPullDown,
  wgPersonSelect,
  wgOrgSelect,
  // wgSectionGraph,
};

const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });

  if (window.useDomZIndex) {
    Object.defineProperty(PopupManager, 'zIndex', {
      configurable: true,
      get() {
        return DomZIndex.getCurrent();
      },
      set(value) {
        DomZIndex.setCurrent(value);
      },
    });
    PopupManager.nextZIndex = DomZIndex.getNext;
  }
};
export default {
  install,
};
