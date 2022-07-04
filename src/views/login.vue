<template>
  <div class="loginPage">
    <img src="../assets/loginBg.jpg" alt="" class="bg" />
    <n-form
      ref="loginRef"
      :model="loginForm"
      :rules="loginRules"
      label-width="100px"
      :size="ref('large')"
      :label-placement="ref('right')"
      class="login"
    >
      <n-form-item label="用户名：" path="username">
        <n-input v-model="loginForm.username" placeholder="请输入用户名" />
      </n-form-item>
      <n-form-item label="密码：" path="password">
        <n-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
      </n-form-item>
      <n-form-item class="btns">
        <n-button @click="onReset(loginRef)">重置</n-button>
        <n-button type="primary" @click="onSubmit(loginRef)">登录</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { FormInst, FormItemRule, useMessage } from 'naive-ui'
import { LocationQueryValueRaw, useRoute, useRouter } from "vue-router";
import { login } from "@/apis/index";
// import store from "@/store";
// const message = useMessage();
const route = useRoute();
const router = useRouter();
const loginRef = ref<FormInst>();
const loginForm = reactive({
  username: "18812345678",
  password: "123456",
});
const loginRules = reactive<FormItemRule>({
  username: { required: true, message: "用户名不能为空", trigger: ['blur', 'change'] },
  password: { required: true, message: "密码不能为空", trigger: ['blur', 'change'] },
});
const onSubmit = async () => {
  loginRef.value?.validate((errors) => {
    if (!errors) {
      login({
        mobile: loginForm.username,
        password: loginForm.password,
      }).then((res: any) => {
        localStorage.setItem("token", res.token);
        // store.commit("user/SET_NAME", res.nickname);
        // store.commit("user/SET_AVATAR", res.avatar);
        const path2: any = route.query.redirect || "/activity/list";
        console.log(path2);
        router.push(path2);
      });
    } else {
      console.log(errors)
      // message.error('验证失败')
    }
  })
};
const onReset = (formEl: FormInst | undefined) => {
  if (!formEl) return;
  // formEl.resetFields();
};
</script>

<style lang="scss" scoped>
.loginPage {
  height: 100%;
  position: relative;
  overflow: hidden;
  .bg {
    position: absolute;
    left: 50%;
    top: 50%;
    min-width: 100%;
    min-height: 100%;
    transform: translate(-50%, -50%);
  }
}
.login {
  width: 400px;
  height: 180px;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
  border: solid 1px #eee;
  background: #fff;
  border-radius: 6px;
  padding: 30px;
  text-align: center;
  .btns {
    text-align: center;
  }
}
</style>
