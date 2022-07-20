<template>
  <div class="content activity-verify">
    <n-form
      ref="searchRef"
      label-placement="left"
      :inline="true"
      :model="searchForm"
      class="searchForm"
    >
      <n-form-item label="兑奖码：" path="code">
        <n-input v-model:value="searchForm.code" placeholder="请输入兑奖码" />
      </n-form-item>
      <n-form-item label="活动名称：" path="title">
        <n-input v-model:value="searchForm.title" placeholder="请输入活动名称" />
      </n-form-item>
      <n-form-item label="活动开始时间：" path="start_time">
        <n-date-picker
          v-model="searchForm.start_time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="选择时间"
          end-placeholder="选择时间"
          value-format="yyyy.MM.dd HH:mm:ss"
        />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onSearch">筛选</n-button>
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="onMultyVerify">批量核销</n-button>
      </n-form-item>
      <n-form-item>
        <n-button @click="onReset()"> 重置 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button :icon="DownloadOutline" @click="onExport">
          导出
        </n-button>
      </n-form-item>
    </n-form>
    <div class="cont">
      <n-data-table :single-line="false" :columns="columns" :data="tableData" />
      <n-pagination
        class="pager"
        v-model:page="page"
        :page-size="per_page"
        :page-sizes="[10, 20, 30, 40]"
        :item-count="total"
        show-quick-jumper
        show-size-picker
        @update:page="handleCurrentChange"
        @update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { NButton, NInput, FormInst, useMessage } from 'naive-ui'
import { DownloadOutline } from '@vicons/ionicons5'
import { getCodeList, verifyDestroy, patchawardCode } from "@/apis/index";
// const message = useMessage()
const route = useRoute();
const searchRef = ref<FormInst | null>(null)
let searchForm = reactive({
  start_time: [],
  title: "",
  code: "",
});

const page = ref(1);
const per_page = ref(10);
const total = ref(4);

let columns = ref([
  {
    type: 'selection',
    title: '全选',
    key: 'selection',
    align: 'center',
    minWidth: 55
  },
  {
    title: '兑奖码',
    key: 'code',
    align: 'center',
    minWidth: 80
  },
  {
    title: '奖品',
    key: 'award_name',
    align: 'left',
    minWidth: 120
  },
  {
    title: '核销截止时间',
    key: 'last_verify_destroy_time',
    align: 'center',
    minWidth: 140
  },
  {
    title: '活动名称',
    key: 'activity_title',
    align: 'left',
    minWidth: 120
  },
  {
    title: '活动开始时间',
    key: 'activity_start_time',
    align: 'center',
    minWidth: 140
  },
  {
    title: '活动结束时间 ',
    key: 'activity_end_time',
    align: 'center',
    minWidth: 140
  },
  {
    title: '备注',
    key: 'remark',
    align: 'left',
    minWidth: 100,
    render (row: any) {
      return [
        h(NInput, { 
          props: {
            value: row.remark,
            placeholder: "请添加备注"
          },
          blur: handleChangeRemark(row),
          default: () => '核销' 
        })
      ]
    }
  },
  {
    title: '状态',
    key: 'state',
    align: 'center',
    minWidth: 80,
    render (row: any) {
      return row.state == 0 ? "待核销" : row.state == 1 ? "已核销" : row.state == 2 ? "已失效" : row.state == -1 ? "未领取" : "--"
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    minWidth: 100,
    render (row: any) {
      return [
        h(NButton, { 
          type: 'primary',
          quaternary: true,
          link: true,
          size: "small",
          disabled: row.state != 0,
          click: onVerify(row.id),
          default: () => '核销' 
        }, '核销'),
      ]
    }
  }
]);
const tableData = ref([]);
const multipleSelection = ref([]);
const handleSelectionChange = (val: []) => {
  multipleSelection.value = val;
};

const getList = () => {
  getCodeList({
    page: page.value,
    per_page: per_page.value,
    activity_id: route.query.id || "",
    min_start_time:
      searchForm.start_time && searchForm.start_time.length > 0
        ? searchForm.start_time[0]
        : "",
    max_start_time:
      searchForm.start_time && searchForm.start_time.length > 1
        ? searchForm.start_time[1]
        : "",
    title: searchForm.title,
    code: searchForm.code,
  }).then((res: any) => {
    total.value = res.total;
    tableData.value = res.data;
  });
};
const handleSizeChange = (val: number) => {
  page.value = 1;
  per_page.value = val;
  // getList();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  // getList();
};
const onMultyVerify = () => {
  const selection = multipleSelection.value
    .filter((item: any) => item.state == 0)
    .map((item: any) => item.id);
  if (selection.length === 0) {
    // message.error("请选择至少一个待核销记录");
  } else {
    verifyDestroy({ id: selection.join(",") }).then(() => {
      // message.success("核销成功");
      // getList();
    });
  }
};
const onReset = () => {
  searchForm = {
    start_time: [],
    title: "",
    code: "",
  }
  onSearch();
};
const onExport = () => {
  window.open(
    `/apis/awardCode/list?page=${page.value}&per_page=${
      per_page.value
    }&activity_id=${route.query.id || ""}&min_start_time=${
      searchForm.start_time && searchForm.start_time.length > 0
        ? searchForm.start_time[0]
        : ""
    }&max_start_time=${
      searchForm.start_time && searchForm.start_time.length > 1
        ? searchForm.start_time[1]
        : ""
    }&title=${searchForm.title}&code=${
      searchForm.code
    }&alt=excel&token=${localStorage.getItem("token")}`,
    "_blank"
  );
};
const onSearch = () => {
  page.value = 1;
  // getList();
};
const onVerify = (id: number) => {
  verifyDestroy({ id }).then(() => {
    // message.success("核销成功");
    onSearch();
  });
};
const handleChangeRemark = (row: any) => {
  patchawardCode({ id: row.id, remark: row.remark }).then(() => {
    // message.success("备注编辑成功");
    // getList();
  });
};
getList();
</script>

<style lang="scss" scoped>
.searchForm {
  flex-wrap: wrap;
}
</style>
