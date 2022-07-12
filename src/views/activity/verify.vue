<template>
  <div class="content activity-verify">
    <n-form
      ref="searchRef"
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
        <n-button :icon="FileDownloadFilled" @click="onExport">
          <template #icon>
            <n-icon>
              <file-download-filled />
            </n-icon>
          </template>
          导出
        </n-button>
      </n-form-item>
    </n-form>
    <div class="cont">
      <el-table
        border
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          label="全选"
          width="55"
        />
        <el-table-column
          prop="code"
          align="center"
          label="兑奖码"
          min-width="80"
        />
        <el-table-column
          prop="award_name"
          align="left"
          label="奖品"
          min-width="120"
        />
        <el-table-column
          prop="last_verify_destroy_time"
          align="center"
          label="核销截止时间"
          min-width="140"
        />
        <el-table-column
          prop="activity_title"
          align="left"
          label="活动名称"
          min-width="120"
        />
        <el-table-column
          prop="activity_start_time"
          align="center"
          label="活动开始时间"
          min-width="140"
        />
        <el-table-column
          prop="activity_end_time"
          align="center"
          label="活动结束时间"
          min-width="140"
        />
        <el-table-column
          prop="remark"
          align="left"
          label="备注"
          min-width="100"
        >
          <template #default="scoped">
            <n-input v-model:value="scoped.row.remark" placeholder="请添加备注" @blur="handleChangeRemark(scoped.row)" />
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          align="center"
          label="状态"
          min-width="80"
        >
          <template #default="scoped">
            {{
              scoped.row.state == 0
                ? "待核销"
                : scoped.row.state == 1
                ? "已核销"
                : scoped.row.state == 2
                ? "已失效"
                : scoped.row.state == -1
                ? "未领取"
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          min-width="100"
        >
          <template #default="scoped">
            <n-button quaternary type="primary" size="small" :disabled="scoped.row.state != 0" @click="onVerify(scoped.row.id)">核销</n-button>
          </template>
        </el-table-column>
      </el-table>
      <n-pagination
        class="pager"
        v-model:page="page"
        :page-count="per_page"
        :page-sizes="[10, 20, 30, 40]"
        :item-count="total"
        show-quick-jumper
        show-size-picker
        on-update:page="handleCurrentChange"
        on-update:page-size="handleSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { FormInst, FormItemRule, useMessage } from 'naive-ui'
import { FileDownloadFilled } from '@vicons/ionicons5'
import { getCodeList, verifyDestroy, patchawardCode } from "@/apis/index";
const message = useMessage()
const route = useRoute();
const searchRef = ref<FormInst | null>(null)
const searchForm = reactive({
  start_time: [],
  title: "",
  code: "",
});

const page = ref(1);
const per_page = ref(10);
const total = ref(4);
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
  getList();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  getList();
};
const onMultyVerify = () => {
  const selection = multipleSelection.value
    .filter((item: any) => item.state == 0)
    .map((item: any) => item.id);
  if (selection.length === 0) {
    message.error("请选择至少一个待核销记录");
  } else {
    verifyDestroy({ id: selection.join(",") }).then(() => {
      message.success("核销成功");
      getList();
    });
  }
};
const onReset = () => {
  console.log(searchRef)
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
  getList();
};
const onVerify = (id: number) => {
  verifyDestroy({ id }).then(() => {
    message.success("核销成功");
    onSearch();
  });
};
const handleChangeRemark = (row: any) => {
  patchawardCode({ id: row.id, remark: row.remark }).then(() => {
    message.success("备注编辑成功");
    getList();
  });
};
getList();
</script>

<style lang="scss" scoped></style>
