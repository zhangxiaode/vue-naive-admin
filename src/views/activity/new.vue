<template>
  <div class="activity-new">
    <n-form
      ref="newRef"
      label-placement="left"
      label-width="180px"
      size="large"
      :model="newForm"
      :rules="newRules"
      class="newForm"
    >
      <n-form-item label="活动名称：" path="title">
        <n-input v-model:value="newForm.title" :style="{width: '370px'}" placeholder="请输入活动名称" />
      </n-form-item>
      <n-form-item label="活动开始时间：" path="start_time">
        <n-date-picker
          :is-date-disabled="state == 1 || state == 2"
          :is-time-disabled="state == 1 || state == 2"
          v-model:value="newForm.start_time"
          type="datetime"
          placeholder="请选择开始时间"
          format="yyyy.MM.dd HH:mm:ss"
        />
      </n-form-item>
      <n-form-item label="活动结束时间：" path="end_time">
        <n-date-picker
          :is-date-disabled="state == 2"
          :is-time-disabled="state == 2"
          v-model:value="newForm.end_time"
          type="datetime"
          placeholder="请选择结束时间"
          format="yyyy.MM.dd HH:mm:ss"
        />
      </n-form-item>
      <n-form-item label="核销截止时间：" path="last_verify_destroy_time">
        <n-date-picker
          :is-date-disabled="state == 2"
          :is-time-disabled="state == 2"
          v-model:value="newForm.last_verify_destroy_time"
          type="datetime"
          placeholder="请选择核销截止时间"
          format="yyyy.MM.dd HH:mm:ss"
        />
      </n-form-item>
      <n-form-item label="抽奖人数上限：" path="max_user_num">
        <n-input :disabled="state == 1 || state == 2" v-model:value="newForm.max_user_num" placeholder="请输入抽奖人数上限" />
      </n-form-item>
      <n-form-item label="封面图：" path="cover_images">
        <div>
          <n-upload
            :disabled="state == 1 || state == 2"
            class="avatar-uploader"
            action="https://upload.qiniup.com"
            :headers="headers"
            list-type="image-card"
            multiple
            :default-upload="true"
            :file-list="fileList"
            :data="uploadData"
            @preview="handlePictureCardPreview"
            @remove="handleRemove"
            @before-upload="beforePictureUpload"
            @error="handlePictureError"
            @finish="handlePictureSuccess"
          >
            <n-icon class="avatar-uploader-icon" :size="32">
              <Add />
            </n-icon>
          </n-upload>
          <n-alert class="warning" title="为保证最终效果，请上传长宽比为1:1，1M以内的素材图" :show-icon="false" type="success" :closable="false" />
        </div>
      </n-form-item>
      <n-form-item v-for="(award, index) in newForm.awards" :key="'awards.' + index + '.num'" :label="`奖品${index + 1}`" :path="'awards.' + index + '.num'">
        <div class="flex ai-center">
          <n-input :disabled="state == 1 || state == 2" v-model:value="award.name" placeholder="奖品名称" />
          <n-input :disabled="state == 1 || state == 2" class="m-0-5" v-model:value="award.num" placeholder="设置奖品份数" />
          <span>份</span>
          <n-button v-if="newForm.awards.length > 1" class="m-0-5" type="primary" size="small" :disabled="state == 1 || state == 2" @click.prevent="removeAward(index)">删除</n-button>
          <n-button v-if="newForm.awards.length - 1 === index" class="m-0-5" type="primary" size="small" :disabled="state == 1 || state == 2" @click.prevent="addAward()">新增</n-button>
        </div>
      </n-form-item>
      <n-form-item label="向用户展示奖品份数：" path="is_show_award_num">
        <n-switch :disabled="state == 1 || state == 2" v-model:value="newForm.is_show_award_num" :checked-value="1" :unchecked-value="0" />
      </n-form-item>
      <n-form-item label="图文介绍（选填）：" path="introduce_type">
        <div class="lh-40 flex flex-column jc-start ai-normal">
          <n-radio-group v-model:value="newForm.introduce_type">
            <n-space>
              <n-radio :value="1">文字</n-radio>
              <n-radio :value="2">图片</n-radio>
            </n-space>
          </n-radio-group>
          <div>
            <n-input v-if="newForm.introduce_type === 1" v-model:value="newForm.content" :rows="3" type="textarea" placeholder="请输入文字介绍" />
            <n-upload
              v-else
              class="avatar-uploader"
              action="https://upload.qiniup.com"
              :data="uploadData"
              :show-file-list="false"
              @before-upload="beforeAvatarUpload"
              @finish="handleAvatarSuccess"
            >
              <img
                v-if="newForm.pictures && newForm.pictures != ''"
                :src="newForm.pictures"
                class="avatar"
              />
              <n-icon v-else class="avatar-uploader-icon" :size="32">
                <Add />
              </n-icon>
            </n-upload>
          </div>
        </div>
      </n-form-item>
      <n-form-item label=" " class="btns">
        <n-button class="m-0-5" @click="onCancel()">取消</n-button>
        <n-button type="primary" @click="onSubmit()">保存</n-button>
      </n-form-item>
    </n-form>
    <n-modal v-model:show="dialogVisible" transform-origin="center">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { FormInst, useMessage, UploadFileInfo } from 'naive-ui'
import { Add } from '@vicons/ionicons5'
import {
  getUploadToken,
  getActivityDetail,
  createActivity,
  putActivity,
} from "@/apis/index";
const router = useRouter();
const route = useRoute();
const message = useMessage()

interface AwardItem {
  name: string;
  num: number;
}
const newRef = ref<FormInst | null>(null)
const uploadData = ref({
  token: "",
  key: "",
});
const fileList = ref([]);
const headers = reactive({
  token: localStorage.getItem("token"),
});
const newForm = reactive({
  title: "",
  start_time: null,
  end_time: null,
  last_verify_destroy_time: null,
  max_user_num: "",
  cover_images: [],
  awards: [
    {
      id: 0,
      name: "",
      num: 0,
    },
  ],
  is_show_award_num: 0,
  introduce_type: 1,
  content: "",
  pictures: "",
});
const state = ref(0);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const newRules = {
  title: [
    { required: true, message: "活动名称不能为空", trigger: "blur change" },
  ],
  start_time: [
    { required: true, message: "活动开始时间不能为空", trigger: "blur change" },
  ],
  end_time: [
    { required: true, message: "活动结束时间不能为空", trigger: "blur change" },
  ],
  last_verify_destroy_time: [
    { required: true, message: "核销截止时间不能为空", trigger: "blur change" },
  ],
  max_user_num: [
    { required: true, message: "抽奖人数上限不能为空", trigger: "blur change" },
    {
      pattern: /^[0-9]*$/,
      message: "抽奖人数上限只能为数字",
      trigger: "blur change",
    },
  ],
  cover_images: [
    { required: true, message: "封面图不能为空", trigger: "blur change" },
  ],
};
const handleRemove = () => {
  newForm.cover_images = fileList.value.map((item: any) =>
    item.percentage ? "https://ommdq027l.qnssl.com/" + item.response.key : item.url
  ) as any;
};

const handlePictureCardPreview = (uploadFile: UploadFileInfo) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const addAward = () => {
  newForm.awards.push({
    id: 0,
    name: "",
    num: 0,
  });
};
const removeAward = (index: number) => {
  if (index !== -1) {
    newForm.awards.splice(index, 1);
  }
};

const beforePictureUpload = (e: any) => {
  uploadData.value.key = `${Math.random()
    .toString(36)
    .slice(-10)}_${Date.now()}_${e.file.file.name}`;
  if (e.file.file.size / 1024 / 1024 > 1) {
    message.error("图片应在1MB以内!");
  }
};
const handlePictureError = (e: any) => {
  console.log(222)
};
const handlePictureSuccess = () => {
  newForm.cover_images = fileList.value.map((item: any) =>
    item.percentage ? "https://ommdq027l.qnssl.com/" + item.response.key : item.url
  ) as any;
};
const beforeAvatarUpload = (e: any) => {
  uploadData.value.key = `${Math.random().toString(36).slice(-10)}_${Date.now()}_${e.file.file.name}`;
};
const handleAvatarSuccess = (response: any) => {
  newForm.pictures = "https://ommdq027l.qnssl.com/" + response.key;
};

const onCancel = () => {
  window.close();
};
const onSubmit = async () => {
  newRef.value?.validate((errors) => {
    if (!errors) {
      if (newForm.awards.length === 0) {
        message.error("请至少设置一份奖品");
      } else {
        let method = createActivity;
        let params = JSON.parse(JSON.stringify(newForm));
        if (route.query.id) {
          method = putActivity;
          params["id"] = route.query.id;
        }
        method(params).then(() => {
          message.success("保存成功");
          setTimeout(() => {
            window.close();
          }, 1000);
        });
      }
    } else {
      console.log(errors)
    }
  })
};
const uploadToken = () => {
  getUploadToken().then((res: any) => {
    uploadData.value.token = res.token;
  });
};
const getDetail = () => {
  getActivityDetail({ id: route.query.id }).then((res: any) => {
    state.value = res.state;
    res.cover_images = JSON.parse(res.cover_images);
    fileList.value = res.cover_images.map((item: string) => {
      return {
        url: item,
      };
    });
    newForm.title = res.title;
    newForm.start_time = res.start_time;
    newForm.end_time = res.end_time;
    newForm.last_verify_destroy_time = res.last_verify_destroy_time;
    newForm.max_user_num = res.max_user_num;
    newForm.cover_images = res.cover_images;
    newForm.awards = res.awards;
    newForm.is_show_award_num = res.is_show_award_num;
    newForm.introduce_type = res.introduce_type;
    newForm.content = res.content;
    newForm.pictures = res.pictures;
  });
};
const init = () => {
  uploadToken();
  if (route.query.id) {
    getDetail();
  }
};
init();
</script>

<style lang="scss" scoped>
.activity-new {
  height: 100%;
  overflow: auto;
  text-align: left;
  .newForm {
    max-width: 800px;
  }
  .warning {
    margin-top: 10px;
  }

  :deep(.avatar-uploader) {
    .n-upload-trigger {
      border: 1px dashed rgb(224, 224, 230);
      background: rgb(250, 250, 252);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: opacity .3s cubic-bezier(0.4, 0, 0.2, 1), border-color .3s cubic-bezier(0.4, 0, 0.2, 1), background-color .3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .n-upload-trigger:hover {
      border-color: rgb(224, 224, 230);
    }

    .n-icon.avatar-uploader-icon {
      color: #8c939d;
      width: 148px;
      height: 148px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        font-size: 28px;
      }
    }
  }
  .avatar {
    width: 148px;
    height: 148px;
  }
}
.m-0-5 {
  margin: 0 5px;
}
.lh-40 {
  line-height: 40px;
}
</style>
