<template>
  <div class="content activity-list">
    <div class="flex flex-column h-100">
      <n-form
        ref="searchRef"
        label-placement="left"
        :inline="true"
        :model="searchForm"
        class="searchForm"
      >
        <n-form-item label="活动开始时间：" path="start_time">
          <n-date-picker
            v-model:value="searchForm.start_time"
            type="datetimerange"
            start-placeholder="选择时间"
            end-placeholder="选择时间"
            separator="至"
            format="yyyy-MM-dd HH:mm:ss"
          />
        </n-form-item>
        <n-form-item label="活动名称：" path="title">
          <n-input v-model:value="searchForm.title" placeholder="请输入活动名称" />
        </n-form-item>
        <n-form-item label="活动状态：" path="state">
          <n-select v-model:value="searchForm.state" class="w-200" :options="[
            {
              label: '全部',
              value: ''
            },
            {
              label: '未开始',
              value: 0
            },
            {
              label: '进行中',
              value: 1
            },
            {
              label: '已完成',
              value: 2
            }
          ]" placeholder="请选择活动状态" />
        </n-form-item>
        <n-form-item label="核销状态：" path="verify_destroy_state">
          <n-select v-model:value="searchForm.verify_destroy_state" class="w-200" :options="[
            {
              label: '全部',
              value: ''
            },
            {
              label: '未结束',
              value: 0
            },
            {
              label: '已结束',
              value: 1
            }
          ]" placeholder="请选择活动状态" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="onSearch">查询</n-button>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" :icon="Add" @click="onCreate">
            新建活动
          </n-button>
        </n-form-item>
        <n-form-item>
          <n-button @click="onReset()"> 重置 </n-button>
        </n-form-item>
        <n-form-item>
          <n-button @click="onExport">
            <template #icon>
              <n-icon>
                <download-outline />
              </n-icon>
            </template>
            导出
          </n-button>
        </n-form-item>
      </n-form>
      <div class="flex flex-column flex-1 overflow-hidden cont">
        <div class="flex-1">
          <n-data-table style="height: 100%;" flex-height :single-line="false" :columns="columns" :data="tableData" />
        </div>
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
    <n-modal v-model:show="dialogVisible" transform-origin="center">
      <img w-full :src="qr_url" alt="Preview Image" />
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, reactive } from "vue";
import { NButton, FormInst, useMessage } from 'naive-ui'
import { Add, DownloadOutline } from '@vicons/ionicons5'
import { getActivity, turnVerifyDestroyState } from "@/apis/index";
const message = useMessage()
const searchRef = ref<FormInst | null>(null)
let searchForm: any = ref({
  start_time: null,
  title: "",
  state: "",
  verify_destroy_state: "",
});
let page = ref(1);
let per_page = ref(10);
let total = ref(4);
let columns = ref([
  {
    title: '活动名称',
    key: 'title',
    minWidth: 120
  },
  {
    title: '开始时间',
    key: 'start_time',
    minWidth: 160
  },
  {
    title: '预设结束时间',
    key: 'end_time',
    minWidth: 160
  },
  {
    title: '核销截止时间',
    key: 'last_verify_destroy_time',
    minWidth: 160
  },
  {
    title: '奖品配置',
    key: 'awards',
    minWidth: 160,
    render (row: any) {
      return row.awards.map((item: any, index: number) => {
        return h('div', { 
          key: index
        }, `${item.name} ${item.num}`)
      })
    }
  },
  {
    title: '抽奖人数上限',
    key: 'max_user_num',
    minWidth: 120
  },
  {
    title: '活动状态',
    key: 'state',
    minWidth: 100,
    render (row: any) {
      return row.state == 0 ? "未开始" : row.state == 1 ? "进行中" : "已完成"
    }
  },
  {
    title: '核销状态',
    key: 'verify_destroy_state',
    minWidth: 100,
    render (row: any) {
      return row.verify_destroy_state == 0 ? "未结束" : "已结束"
    }
  },
  {
    title: '操作',
    key: 'actions',
    minWidth: 340,
    render (row: any) {
      return [
        h(NButton, { 
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEdit(row.id)
        }, '编辑' ),
        h(NButton, { 
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          disabled: !row.qr_url,
          onClick: () => onQucode(row.qr_url),
        }, '二维码路径' ),
        h(NButton, { 
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onVerify(row.id)
        }, '核销'),
        h(NButton, { 
          type: 'primary',
          link: true,
          quaternary: true,
          size: "small",
          onClick: () => onEnd(row.id)
        }, h(
          'span',
          {
            class: row.verify_destroy_state == 0 ? 'noEnd' : 'isEnd'
          },
          row.verify_destroy_state == 0 ? "标记核销已结束" : "标记核销未结束"
        ))
      ]
    }
  }
]);
let tableData = ref([
  {
    title: '1',
    start_time: '2022/02/02',
    end_time: '2022/02/02',
    last_verify_destroy_time: '2022/02/02',
    awards: [{name: '奖品', num: 2}],
    max_user_num: 10,
    state: 1,
    verify_destroy_state: 0
  }
]);
let dialogVisible = ref(false);
let qr_url = ref("");
const getList = () => {
  getActivity({
    page: page.value,
    per_page: per_page.value,
    min_start_time:
      searchForm.value.start_time && searchForm.value.start_time.length > 0
        ? new Date(searchForm.value.start_time[0]).toLocaleString().replaceAll("/", '-')
        : null,
    max_start_time:
      searchForm.value.start_time && searchForm.value.start_time.length > 1
        ? new Date(searchForm.value.start_time[1]).toLocaleString().replaceAll("/", '-')
        : null,
    title: searchForm.value.title,
    state: searchForm.value.state,
    verify_destroy_state: searchForm.value.verify_destroy_state
  }).then((res: any) => {
    total.value = res.total;
    tableData.value = res.data;
  });
};
const onSearch = () => {
  page.value = 1;
  getList();
};
const onCreate = () => {
  window.open(`/backend/activity/new`, "_blank");
};
const onReset = () => {
  searchForm.value = {
    start_time: null,
    title: "",
    state: "",
    verify_destroy_state: "",
  }
  onSearch();
};
const onExport = () => {
  window.open(
    `/apis/activity/list?page=${page.value}&per_page=${
      per_page.value
    }&min_start_time=${
      searchForm.value.start_time && searchForm.value.start_time.length > 0
        ? searchForm.value.start_time[0]
        : ""
    }&max_start_time=${
      searchForm.value.start_time && searchForm.value.start_time.length > 1
        ? searchForm.value.start_time[1]
        : ""
    }&title=${searchForm.value.title}&state=${
      searchForm.value.state
    }&verify_destroy_state=${
      searchForm.value.verify_destroy_state
    }&alt=excel&token=${localStorage.getItem("token")}`,
    "_blank"
  );
};
const handleSizeChange = (val: number) => {
  page.value = 1;
  per_page.value = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  getList();
};
const onEdit = (id: number) => {
  window.open(`/backend/activity/new?id=${id}`, "_blank");
};
const onQucode = (url: string) => {
  dialogVisible.value = true;
  qr_url.value = url;
};
const onVerify = (id: number) => {
  window.open(`/backend/activity/verify?id=${id}`, "_blank");
};
const onEnd = (id: number) => {
  turnVerifyDestroyState({ id }).then(() => {
    // message.success("标记成功");
    page.value = 1;
    getList();
  });
};
getList();
</script>

<style lang="scss" scoped>
.searchForm {
  flex-wrap: wrap;
}
.noEnd {
  color: #f56c6c;
}
.isEnd {
  color: #67c23a;
}
.w-200 {
  width: 200px;
}
</style>
