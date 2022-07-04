<template>
  <div class="content activity-list">
    <n-form
      ref="searchRef"
      :inline="true"
      :model="searchForm"
      class="searchForm"
    >
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
      <n-form-item label="活动名称：" path="title">
        <n-input v-model="searchForm.title" placeholder="请输入活动名称" />
      </n-form-item>
      <n-form-item label="活动状态：" path="state">
        <n-select v-model="searchForm.state" :options="[
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
        <n-select v-model="searchForm.verify_destroy_state" :options="[
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
        <n-button type="primary" :icon="Plus" @click="onCreate">
          新建活动
        </n-button>
      </n-form-item>
      <n-form-item>
        <n-button @click="onReset(searchRef)"> 重置 </n-button>
      </n-form-item>
      <n-form-item>
        <n-button @click="onExport">
          <template #icon>
            <n-icon>
              <!-- <FileDownloadFilled /> -->
              <file-download-filled />
            </n-icon>
          </template>导出
        </n-button>
      </n-form-item>
    </n-form>
    <div class="cont">
      <n-data-table bordered :columns="columns" :data="tableData" :pagination="pagination">
         <!-- :data="tableData" style="width: 100%" -->
        <el-table-column prop="title" label="活动名称" min-width="120" />
        <el-table-column prop="start_time" label="开始时间" min-width="160" />
        <el-table-column prop="end_time" label="预设结束时间" min-width="160" />
        <el-table-column
          prop="last_verify_destroy_time"
          label="核销截止时间"
          min-width="160"
        />
        <el-table-column prop="awards" label="奖品配置" min-width="160">
          <template #default="scoped">
            <div v-for="(item, index) in scoped.row.awards" :key="index">
              {{ item.name }} {{ item.num }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="max_user_num"
          label="抽奖人数上限"
          min-width="120"
        />
        <el-table-column prop="state" label="活动状态" min-width="100">
          <template #default="scoped">
            {{
              scoped.row.state == 0
                ? "未开始"
                : scoped.row.state == 1
                ? "进行中"
                : "已完成"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="verify_destroy_state"
          label="核销状态"
          min-width="100"
        >
          <template #default="scoped">
            {{ scoped.row.verify_destroy_state == 0 ? "未结束" : "已结束" }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="280">
          <template #default="scoped">
            <n-button
              link
              type="primary"
              size="small"
              @click="onEdit(scoped.row.id)"
            >
              编辑
            </n-button>
            <n-button
              link
              type="primary"
              size="small"
              :disabled="!scoped.row.qr_url"
              @click="onQucode(scoped.row.qr_url)"
            >
              二维码路径
            </n-button>
            <n-button
              link
              type="primary"
              size="small"
              @click="onVerify(scoped.row.id)"
            >
              核销
            </n-button>
            <n-button
              link
              type="primary"
              size="small"
              @click="onEnd(scoped.row.id)"
            >
              <span
                :class="
                  scoped.row.verify_destroy_state == 0 ? 'noEnd' : 'isEnd'
                "
                >{{
                  scoped.row.verify_destroy_state == 0
                    ? "标记核销已结束"
                    : "标记核销未结束"
                }}</span
              >
            </n-button>
          </template>
        </el-table-column>
      </n-data-table>
      <el-pagination
        class="pager"
        v-model:currentPage="page"
        v-model:page-size="per_page"
        :page-sizes="[10, 20, 30, 40]"
        :background="ref(true)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="qr_url" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { h, reactive, ref } from "vue";
import { NButton, FormInst, FormItemRule, useMessage } from 'naive-ui'
import { FileDownloadFilled } from '@vicons/ionicons5'
import { Plus, Download } from "@element-plus/icons-vue";
import { getActivity, turnVerifyDestroyState } from "@/apis/index";
const message = useMessage()
const searchRef = ref<FormInst>();
const searchForm = reactive({
  start_time: [],
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
    key: 'title'
  },
  {
    title: '开始时间',
    key: 'start_time'
  },
  {
    title: '预设结束时间',
    key: 'end_time'
  },
  {
    title: '核销截止时间',
    key: 'last_verify_destroy_time'
  },
  {
    title: '奖品配置',
    key: 'awards'
  },
  {
    title: '抽奖人数上限',
    key: 'max_user_num'
  },
  {
    title: '活动状态',
    key: 'state'
  },
  {
    title: '核销状态',
    key: 'verify_destroy_state'
  },
  {
    title: '操作',
    key: 'actions',
    render (row: any) {
      console.log(row)
      return h(
        NButton,
        { default: () => '编辑' },
        // { default: () => '二维码路径' },
        // { default: () => '核销' },
        // { default: () => '标记核销已结束' }
      )
    }
  }
]);
let tableData = ref([]);
let dialogVisible = ref(false);
let qr_url = ref("");
const getList = () => {
  getActivity({
    page: page.value,
    per_page: per_page.value,
    min_start_time:
      searchForm.start_time && searchForm.start_time.length > 0
        ? searchForm.start_time[0]
        : "",
    max_start_time:
      searchForm.start_time && searchForm.start_time.length > 1
        ? searchForm.start_time[1]
        : "",
    title: searchForm.title,
    state: searchForm.state,
    verify_destroy_state: searchForm.verify_destroy_state,
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
  window.open(`/kaola-backend/activity/new`, "_blank");
};
const onReset = (formEl: FormInst | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  onSearch();
};
const onExport = () => {
  window.open(
    `/apis/activity/list?page=${page.value}&per_page=${
      per_page.value
    }&min_start_time=${
      searchForm.start_time && searchForm.start_time.length > 0
        ? searchForm.start_time[0]
        : ""
    }&max_start_time=${
      searchForm.start_time && searchForm.start_time.length > 1
        ? searchForm.start_time[1]
        : ""
    }&title=${searchForm.title}&state=${
      searchForm.state
    }&verify_destroy_state=${
      searchForm.verify_destroy_state
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
  window.open(`/kaola-backend/activity/new?id=${id}`, "_blank");
};
const onQucode = (url: string) => {
  dialogVisible.value = true;
  qr_url.value = url;
};
const onVerify = (id: number) => {
  window.open(`/kaola-backend/activity/verify?id=${id}`, "_blank");
};
const onEnd = (id: number) => {
  turnVerifyDestroyState({ id }).then(() => {
    message.success("标记成功");
    page.value = 1;
    getList();
  });
};
getList();
</script>

<style lang="scss" scoped>
.noEnd {
  color: #f56c6c;
}
.isEnd {
  color: #67c23a;
}
</style>
